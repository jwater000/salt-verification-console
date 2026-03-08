#!/usr/bin/env python3
"""
Regenerate cosmic results from predictor engines using observation-only inputs.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PREDICTOR_DIR = ROOT / "tools" / "predictors"
P1_PATH = ROOT / "data" / "processed" / "results_p1-time-delay-redshift.json"
P2_PATH = ROOT / "data" / "processed" / "results_p2-hf-tail.json"
MANIFEST_PATH = ROOT / "data" / "processed" / "cosmic_predictor_manifest.json"
FEATURES_PATH = ROOT / "data" / "processed" / "cosmic_observation_features.json"
EXCLUSION_REPORT_PATH = ROOT / "results" / "reports" / "cosmic_submission_exclusions.json"

ENGINE_VERSION = "cosmic-predictor-v1"
SUBMISSION_MODE = os.environ.get("COSMIC_SUBMISSION_MODE", "").strip().lower() in {"1", "true", "yes"}
MIN_SUBMISSION_ROWS = int(os.environ.get("COSMIC_MIN_SUBMISSION_ROWS", "20"))
SM_FORMULA_VERSION = "cosmic-sm-submission-candidate-v1" if SUBMISSION_MODE else "cosmic-sm-scaffold-v3"
SALT_FORMULA_VERSION = "cosmic-salt-submission-candidate-v1" if SUBMISSION_MODE else "cosmic-salt-scaffold-v3"


def load_feature_sidecar() -> dict[str, dict]:
    if not FEATURES_PATH.exists():
        return {}
    raw = json.loads(FEATURES_PATH.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return {}
    out: dict[str, dict] = {}
    for k, v in raw.items():
        if isinstance(v, dict):
            out[str(k)] = v
    return out


def load_result_rows(path: Path, prediction_id: str, channel: str, features: dict[str, dict]) -> list[dict]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise SystemExit(f"{path}: expected array")
    out = []
    for i, row in enumerate(raw, start=1):
        if not isinstance(row, dict):
            raise SystemExit(f"{path} row {i}: expected object")
        if str(row.get("prediction_id", "")).strip() != prediction_id:
            continue
        event_id = str(row.get("event_id", "")).strip()
        if not event_id:
            continue
        if row.get("actual_value") is None:
            continue
        out.append(
            {
                "domain": "cosmic",
                "channel": channel,
                "observable_id": prediction_id,
                "dataset_id": event_id,
                "x_value": None,
                "measured_value": float(row["actual_value"]),
                "observed_at_utc": row.get("event_time_utc"),
                "redshift_z": features.get(event_id, {}).get("redshift_z"),
                "luminosity_distance_mpc": features.get(event_id, {}).get("luminosity_distance_mpc"),
                "lookback_time_gyr": features.get(event_id, {}).get("lookback_time_gyr"),
                "channel_meta": features.get(event_id, {}),
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


def load_preds(path: Path, model: str) -> dict[tuple[str, str], float]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        raise SystemExit(f"{path}: expected array")
    out: dict[tuple[str, str], float] = {}
    for i, row in enumerate(rows, start=1):
        if not isinstance(row, dict):
            raise SystemExit(f"{path} row {i}: expected object")
        if row.get("model") != model:
            raise SystemExit(f"{path} row {i}: model mismatch ({row.get('model')} != {model})")
        key = (str(row["observable_id"]), str(row["dataset_id"]))
        out[key] = float(row["pred_value"])
    return out


def rebuild_results(obs: list[dict], sm: dict[tuple[str, str], float], salt: dict[tuple[str, str], float]) -> list[dict]:
    rows: list[dict] = []
    for row in obs:
        key = (str(row["observable_id"]), str(row["dataset_id"]))
        if key not in sm or key not in salt:
            raise SystemExit(f"missing prediction for key={key}")
        actual = float(row["measured_value"])
        standard_fit = float(sm[key])
        salt_fit = float(salt[key])
        residual_score = round(actual - salt_fit, 6)
        gap = abs(actual - standard_fit) - abs(actual - salt_fit)
        if gap > 0.008:
            flag = "candidate"
        elif gap < -0.008:
            flag = "rejected"
        else:
            flag = "neutral"
        rows.append(
            {
                "prediction_id": row["observable_id"],
                "event_id": row["dataset_id"],
                "event_time_utc": row.get("observed_at_utc"),
                "actual_value": round(actual, 6),
                "standard_fit": round(standard_fit, 6),
                "salt_fit": round(salt_fit, 6),
                "residual_score": residual_score,
                "flag": flag,
            }
        )
    rows.sort(key=lambda x: (str(x.get("event_time_utc") or ""), str(x["event_id"])), reverse=True)
    return rows


def split_submission_rows(obs: list[dict], *, path: Path) -> list[dict]:
    keep: list[dict] = []
    excluded: list[dict] = []
    for row in obs:
        event_id = str(row["dataset_id"])
        if row.get("redshift_z") is None or row.get("luminosity_distance_mpc") is None:
            excluded.append(
                {
                    "event_id": event_id,
                    "reason": "missing_redshift_or_distance",
                    "source_id": row.get("channel_meta", {}).get("source_id"),
                }
            )
            continue
        keep.append(row)
    report = {
        "path": str(path.name),
        "input_rows": len(obs),
        "used_rows": len(keep),
        "excluded_rows": len(excluded),
        "excluded": excluded,
    }
    EXCLUSION_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    existing: list[dict]
    if EXCLUSION_REPORT_PATH.exists():
        try:
            existing = json.loads(EXCLUSION_REPORT_PATH.read_text(encoding="utf-8"))
            if not isinstance(existing, list):
                existing = []
        except Exception:
            existing = []
    else:
        existing = []
    existing = [x for x in existing if isinstance(x, dict) and x.get("path") != path.name]
    existing.append(report)
    EXCLUSION_REPORT_PATH.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
    return keep


def run_for(path: Path, prediction_id: str, channel: str) -> None:
    features = load_feature_sidecar()
    obs = load_result_rows(path, prediction_id, channel, features)
    if SUBMISSION_MODE:
        obs = split_submission_rows(obs, path=path)
        if len(obs) < MIN_SUBMISSION_ROWS:
            raise SystemExit(
                f"submission mode insufficient usable rows for {path.name}: "
                f"{len(obs)} < COSMIC_MIN_SUBMISSION_ROWS({MIN_SUBMISSION_ROWS})"
            )
    with tempfile.TemporaryDirectory(prefix="cosmic-predict-") as td:
        t = Path(td)
        inp = t / "obs.json"
        sm_out = t / "sm.json"
        salt_out = t / "salt.json"
        inp.write_text(json.dumps(obs, ensure_ascii=False, indent=2), encoding="utf-8")
        run_predictor("cosmic_sm_predict.py", inp, sm_out, SM_FORMULA_VERSION)
        run_predictor("cosmic_salt_predict.py", inp, salt_out, SALT_FORMULA_VERSION)
        sm = load_preds(sm_out, "SM")
        sa = load_preds(salt_out, "SALT")
    out_rows = rebuild_results(obs, sm, sa)
    path.write_text(json.dumps(out_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"cosmic predictions regenerated: {path} (rows={len(out_rows)})")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def main() -> None:
    run_for(P1_PATH, "p1-time-delay-redshift", "cosmic_time_delay_redshift")
    run_for(P2_PATH, "p2-hf-tail", "cosmic_hf_tail")
    manifest = {
        "domain": "cosmic",
        "engine_version": ENGINE_VERSION,
        "sm_formula_version": SM_FORMULA_VERSION,
        "salt_formula_version": SALT_FORMULA_VERSION,
        "outputs": [
            {"path": str(P1_PATH.relative_to(ROOT)), "sha256": sha256_file(P1_PATH), "rows": len(json.loads(P1_PATH.read_text(encoding="utf-8")))},
            {"path": str(P2_PATH.relative_to(ROOT)), "sha256": sha256_file(P2_PATH), "rows": len(json.loads(P2_PATH.read_text(encoding="utf-8")))},
        ],
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
