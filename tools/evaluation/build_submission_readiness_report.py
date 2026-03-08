#!/usr/bin/env python3
"""
Build a paper-submission readiness report from current frozen/processed artifacts.
"""

from __future__ import annotations

import json
import subprocess
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROCESSED = ROOT / "data" / "processed"
FROZEN_CURRENT = ROOT / "data" / "frozen" / "current"
REPORT_PATH = ROOT / "results" / "reports" / "submission_readiness_report_20260309.md"
EXCLUSIONS_PATH = ROOT / "results" / "reports" / "cosmic_submission_exclusions.json"


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def read_json(path: Path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def pass_fail(ok: bool) -> str:
    return "PASS" if ok else "FAIL"


def main() -> None:
    model_eval = read_json(PROCESSED / "model_eval_manifest.json", {})
    cosmic_manifest = read_json(PROCESSED / "cosmic_predictor_manifest.json", {})
    micro_manifest = read_json(PROCESSED / "micro_predictor_manifest.json", {})
    micro_lock = read_json(PROCESSED / "micro_prediction_lock.json", {})
    frozen_manifest = read_json(FROZEN_CURRENT / "manifest.json", {})
    sidecar = read_json(PROCESSED / "cosmic_observation_features.json", {})
    exclusions = read_json(EXCLUSIONS_PATH, [])

    fv = model_eval.get("formula_versions", {})
    pl = model_eval.get("prediction_locks", {})
    frozen = model_eval.get("frozen", {})

    checks: list[tuple[str, bool, str]] = []
    checks.append(
        (
            "Formula versions are submission-candidate-v1 for cosmic/micro",
            all(
                str(fv.get(k, "")).endswith("submission-candidate-v1")
                for k in ("cosmic_sm", "cosmic_salt", "micro_sm", "micro_salt")
            ),
            str(fv),
        )
    )
    checks.append(
        (
            "Micro prediction lock exists and matches model_eval",
            bool(micro_lock.get("prediction_lock_sha256"))
            and str(micro_lock.get("prediction_lock_sha256")) == str(pl.get("micro_prediction_lock_sha256")),
            f"lock={micro_lock.get('prediction_lock_sha256')} eval={pl.get('micro_prediction_lock_sha256')}",
        )
    )
    checks.append(
        (
            "Frozen manifest exists with required files",
            isinstance(frozen_manifest.get("files"), list) and len(frozen_manifest.get("files", [])) >= 8,
            f"files={len(frozen_manifest.get('files', []))}",
        )
    )
    checks.append(
        (
            "Cosmic sidecar has redshift+distance for current 50 events",
            isinstance(sidecar, dict)
            and len(sidecar) >= 50
            and sum(
                1
                for r in sidecar.values()
                if isinstance(r, dict)
                and r.get("redshift_z") is not None
                and r.get("luminosity_distance_mpc") is not None
            )
            >= 50,
            f"total={len(sidecar) if isinstance(sidecar, dict) else 0} "
            f"both_filled={sum(1 for r in sidecar.values() if isinstance(r, dict) and r.get('redshift_z') is not None and r.get('luminosity_distance_mpc') is not None) if isinstance(sidecar, dict) else 0}",
        )
    )
    checks.append(
        (
            "No cosmic submission exclusions in latest run",
            isinstance(exclusions, list)
            and all(int(x.get("excluded_rows", 0)) == 0 for x in exclusions if isinstance(x, dict)),
            json.dumps(exclusions, ensure_ascii=False)[:400],
        )
    )
    checks.append(
        (
            "Processed manifests include non-empty frozen manifest sha256",
            bool(str(frozen.get("manifest_sha256", "")).strip()),
            f"manifest_sha256={frozen.get('manifest_sha256')}",
        )
    )

    # Optional runtime smoke check for web build.
    web_build_ok = False
    web_build_note = ""
    proc = subprocess.run(
        ["npm", "run", "build", "--", "--webpack"],
        cwd=str(ROOT / "web"),
        check=False,
        capture_output=True,
        text=True,
    )
    if proc.returncode == 0:
        web_build_ok = True
        web_build_note = "web build succeeded"
    else:
        web_build_note = f"web build failed (code={proc.returncode})"
    checks.append(("Web production build", web_build_ok, web_build_note))

    all_pass = all(ok for _, ok, _ in checks)

    lines: list[str] = []
    lines.append("# Submission Readiness Report")
    lines.append("")
    lines.append(f"- generated_at_utc: `{now_utc()}`")
    lines.append(f"- overall: **{pass_fail(all_pass)}**")
    lines.append(f"- dataset_version: `{frozen.get('dataset_version')}`")
    lines.append("")
    lines.append("## Check Results")
    for name, ok, note in checks:
        lines.append(f"- [{ 'x' if ok else ' ' }] {name} :: {pass_fail(ok)}")
        lines.append(f"  - note: `{note}`")
    lines.append("")
    lines.append("## Artifacts")
    lines.append(f"- processed/model_eval_manifest.json")
    lines.append(f"- processed/cosmic_predictor_manifest.json")
    lines.append(f"- processed/micro_predictor_manifest.json")
    lines.append(f"- processed/micro_prediction_lock.json")
    lines.append(f"- frozen/current/manifest.json")
    lines.append(f"- results/reports/cosmic_submission_exclusions.json")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"report: {REPORT_PATH}")
    print(f"overall: {pass_fail(all_pass)}")


if __name__ == "__main__":
    main()
