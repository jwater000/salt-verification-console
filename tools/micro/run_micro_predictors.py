#!/usr/bin/env python3
"""
Generate micro SM/SALT predictions from observations using predictor engines.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import hashlib
from pathlib import Path

from _micro_common import PredictionRecord, connect_db, ensure_micro_schema, upsert_salt_prediction, upsert_sm_prediction


ROOT = Path(__file__).resolve().parents[2]
PREDICTOR_DIR = ROOT / "tools" / "predictors"
MANIFEST_PATH = ROOT / "data" / "processed" / "micro_predictor_manifest.json"
QUALITY_MODE = os.environ.get("MICRO_QUALITY_MODE", "real").strip().lower() or "real"
ENGINE_VERSION = os.environ.get("MICRO_PREDICTOR_ENGINE_VERSION", "micro-predictor-v1")
SUBMISSION_MODE = os.environ.get("MICRO_SUBMISSION_MODE", "").strip().lower() in {"1", "true", "yes"}
FORMULA_VERSION_SM = os.environ.get(
    "MICRO_SM_FORMULA_VERSION",
    "micro-sm-submission-candidate-v1" if SUBMISSION_MODE else "micro-sm-scaffold-v3",
)
FORMULA_VERSION_SALT = os.environ.get(
    "MICRO_SALT_FORMULA_VERSION",
    "micro-salt-submission-candidate-v1" if SUBMISSION_MODE else "micro-salt-scaffold-v3",
)


def load_observations() -> list[dict]:
    if QUALITY_MODE not in {"real", "all"}:
        raise SystemExit("MICRO_QUALITY_MODE must be 'real' or 'all'")

    where = "WHERE quality_flag='real'" if QUALITY_MODE == "real" else ""
    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        rows = conn.execute(
            f"""
            SELECT channel, observable_id, dataset_id, x_value, measured_value,
                   stat_err, sys_err, unit, observed_at_utc, source_url
            FROM micro_observations
            {where}
            ORDER BY channel, observable_id, dataset_id, COALESCE(x_value, -1)
            """
        ).fetchall()
    finally:
        conn.close()

    out: list[dict] = []
    for r in rows:
        out.append(
            {
                "domain": "micro",
                "channel": r["channel"],
                "observable_id": r["observable_id"],
                "dataset_id": r["dataset_id"],
                "x_value": r["x_value"],
                "measured_value": r["measured_value"],
                "stat_err": r["stat_err"],
                "sys_err": r["sys_err"],
                "unit": r["unit"],
                "observed_at_utc": r["observed_at_utc"],
                "source_url": r["source_url"],
            }
        )
    return out


def run_predictor(script: str, inp: Path, out: Path, formula_version: str) -> None:
    cmd = [
        sys.executable,
        str(PREDICTOR_DIR / script),
        "--input",
        str(inp),
        "--output",
        str(out),
        "--engine-version",
        ENGINE_VERSION,
        "--formula-version",
        formula_version,
        "--strict",
    ]
    proc = subprocess.run(cmd, cwd=str(ROOT), check=False)
    if proc.returncode != 0:
        raise SystemExit(proc.returncode)


def load_predictions(path: Path, expected_model: str) -> list[dict]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        raise SystemExit(f"{path} must be a JSON array")
    out = []
    for i, r in enumerate(rows, start=1):
        if not isinstance(r, dict):
            raise SystemExit(f"{path} row {i}: must be object")
        if r.get("model") != expected_model:
            raise SystemExit(f"{path} row {i}: model must be {expected_model}")
        out.append(r)
    return out


def prediction_hash(rows: list[dict]) -> str:
    lines: list[str] = []
    for r in rows:
        lines.append(
            "|".join(
                [
                    str(r.get("model")),
                    str(r.get("channel")),
                    str(r.get("observable_id")),
                    str(r.get("dataset_id")),
                    "null" if r.get("x_value") is None else f"{float(r['x_value']):.12g}",
                    f"{float(r.get('pred_value')):.16g}",
                    str(r.get("formula_version", "")),
                    str(r.get("engine_version", "")),
                ]
            )
        )
    lines.sort()
    return hashlib.sha256("\n".join(lines).encode("utf-8")).hexdigest()


def upsert_predictions(sm_rows: list[dict], salt_rows: list[dict]) -> None:
    conn = connect_db()
    try:
        ensure_micro_schema(conn)

        # Remove old predictions for keys that will be regenerated.
        keys = {
            (str(r["observable_id"]), str(r["dataset_id"]), r.get("x_value"))
            for r in sm_rows
        }
        for observable_id, dataset_id, x_value in keys:
            if x_value is None:
                conn.execute(
                    "DELETE FROM micro_sm_predictions WHERE observable_id=? AND dataset_id=? AND x_value IS NULL",
                    (observable_id, dataset_id),
                )
                conn.execute(
                    "DELETE FROM micro_salt_predictions WHERE observable_id=? AND dataset_id=? AND x_value IS NULL",
                    (observable_id, dataset_id),
                )
            else:
                xv = float(x_value)
                conn.execute(
                    "DELETE FROM micro_sm_predictions WHERE observable_id=? AND dataset_id=? AND x_value=?",
                    (observable_id, dataset_id, xv),
                )
                conn.execute(
                    "DELETE FROM micro_salt_predictions WHERE observable_id=? AND dataset_id=? AND x_value=?",
                    (observable_id, dataset_id, xv),
                )

        for r in sm_rows:
            upsert_sm_prediction(
                conn,
                PredictionRecord(
                    observable_id=str(r["observable_id"]),
                    dataset_id=str(r["dataset_id"]),
                    x_value=None if r.get("x_value") is None else float(r["x_value"]),
                    value=float(r["pred_value"]),
                    value_err=None if r.get("pred_err") is None else float(r["pred_err"]),
                    model_ref=f"SM-engine:{r.get('engine_version', ENGINE_VERSION)}",
                ),
            )

        for r in salt_rows:
            upsert_salt_prediction(
                conn,
                PredictionRecord(
                    observable_id=str(r["observable_id"]),
                    dataset_id=str(r["dataset_id"]),
                    x_value=None if r.get("x_value") is None else float(r["x_value"]),
                    value=float(r["pred_value"]),
                    value_err=None if r.get("pred_err") is None else float(r["pred_err"]),
                    model_ref=f"SALT-engine:{r.get('engine_version', ENGINE_VERSION)}",
                ),
                alpha=None if r.get("alpha") is None else float(r["alpha"]),
                beta=None if r.get("beta") is None else float(r["beta"]),
                gamma=None if r.get("gamma") is None else float(r["gamma"]),
                formula_version=str(r.get("formula_version", FORMULA_VERSION_SALT)),
            )

        conn.commit()
    finally:
        conn.close()


def main() -> None:
    obs = load_observations()
    if not obs:
        print("no observations; skip micro predictors")
        return

    with tempfile.TemporaryDirectory(prefix="micro-predict-") as td:
        tdir = Path(td)
        inp = tdir / "input_observations.json"
        sm_out = tdir / "sm_predictions.json"
        salt_out = tdir / "salt_predictions.json"
        inp.write_text(json.dumps(obs, ensure_ascii=False, indent=2), encoding="utf-8")

        run_predictor("micro_sm_predict.py", inp, sm_out, FORMULA_VERSION_SM)
        run_predictor("micro_salt_predict.py", inp, salt_out, FORMULA_VERSION_SALT)

        sm_rows = load_predictions(sm_out, "SM")
        salt_rows = load_predictions(salt_out, "SALT")
        if len(sm_rows) != len(salt_rows):
            raise SystemExit("sm/salt prediction row count mismatch")
        upsert_predictions(sm_rows, salt_rows)
        manifest = {
            "generated_at_utc": sm_rows[0]["computed_at_utc"] if sm_rows else None,
            "domain": "micro",
            "engine_version": ENGINE_VERSION,
            "sm_formula_version": FORMULA_VERSION_SM,
            "salt_formula_version": FORMULA_VERSION_SALT,
            "quality_mode": QUALITY_MODE,
            "rows": len(sm_rows),
            "sm_prediction_sha256": prediction_hash(sm_rows),
            "salt_prediction_sha256": prediction_hash(salt_rows),
        }
        MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print(
        f"micro predictions updated: rows={len(obs)}, "
        f"engine={ENGINE_VERSION}, formulas=({FORMULA_VERSION_SM},{FORMULA_VERSION_SALT}), quality_mode={QUALITY_MODE}"
    )


if __name__ == "__main__":
    main()
