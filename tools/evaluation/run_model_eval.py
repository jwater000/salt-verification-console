#!/usr/bin/env python3
"""
Run unified model evaluation pipeline and write model_eval_manifest.json.
"""

from __future__ import annotations

import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "data" / "processed" / "model_eval_manifest.json"
COSMIC_MANIFEST = ROOT / "data" / "processed" / "cosmic_predictor_manifest.json"
MICRO_MANIFEST = ROOT / "data" / "processed" / "micro_predictor_manifest.json"
MICRO_LOCK = ROOT / "data" / "processed" / "micro_prediction_lock.json"
FROZEN_MANIFEST = ROOT / "data" / "frozen" / "current" / "manifest.json"


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def run(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, cwd=str(ROOT), check=False)
    if proc.returncode != 0:
        raise SystemExit(proc.returncode)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def require_nonempty(value: object, field: str) -> str:
    text = str(value or "").strip()
    if not text:
        raise SystemExit(f"missing required field: {field}")
    return text


def main() -> None:
    display_commands = [
        ".venv/bin/python tools/evaluation/run_cosmic_predictors.py",
        ".venv/bin/python tools/evaluation/expand_cosmic_frozen_samples.py",
        ".venv/bin/python tools/micro/run_micro_predictors.py",
        ".venv/bin/python tools/micro/run_micro_stats.py",
    ]
    commands = [
        [sys.executable, str(ROOT / "tools" / "evaluation" / "run_cosmic_predictors.py")],
        [sys.executable, str(ROOT / "tools" / "evaluation" / "expand_cosmic_frozen_samples.py")],
        [sys.executable, str(ROOT / "tools" / "micro" / "run_micro_predictors.py")],
        [sys.executable, str(ROOT / "tools" / "micro" / "run_micro_stats.py")],
    ]
    for show_cmd, exec_cmd in zip(display_commands, commands):
        print("[run]", show_cmd)
        run(exec_cmd)

    cosmic = read_json(COSMIC_MANIFEST) if COSMIC_MANIFEST.exists() else {}
    micro = read_json(MICRO_MANIFEST) if MICRO_MANIFEST.exists() else {}
    micro_lock = read_json(MICRO_LOCK) if MICRO_LOCK.exists() else {}
    frozen = read_json(FROZEN_MANIFEST) if FROZEN_MANIFEST.exists() else {}
    micro_lock_sha = require_nonempty(micro_lock.get("prediction_lock_sha256"), "micro_prediction_lock.prediction_lock_sha256")
    micro_sm_sha = require_nonempty(micro.get("sm_prediction_sha256"), "micro_predictor_manifest.sm_prediction_sha256")
    micro_salt_sha = require_nonempty(micro.get("salt_prediction_sha256"), "micro_predictor_manifest.salt_prediction_sha256")

    payload = {
        "generated_at_utc": now_utc(),
        "pipeline": "run_model_eval",
        "commands": display_commands,
        "engine_versions": {
            "cosmic": cosmic.get("engine_version"),
            "micro": micro.get("engine_version"),
        },
        "formula_versions": {
            "cosmic_sm": cosmic.get("sm_formula_version"),
            "cosmic_salt": cosmic.get("salt_formula_version"),
            "micro_sm": micro.get("sm_formula_version"),
            "micro_salt": micro.get("salt_formula_version"),
        },
        "prediction_locks": {
            "micro_prediction_lock_sha256": micro_lock_sha,
            "micro_sm_prediction_sha256": micro_sm_sha,
            "micro_salt_prediction_sha256": micro_salt_sha,
        },
        "frozen": {
            "dataset_version": frozen.get("dataset_version"),
            # frozen/current/manifest.json also hashes model_eval_manifest.json.
            # Storing that manifest hash inside model_eval_manifest.json creates
            # a circular dependency, so this is computed at read-time in web.
            "manifest_sha256": None,
        },
    }
    MANIFEST_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"model eval manifest: {MANIFEST_PATH}")

    run([sys.executable, str(ROOT / "tools" / "evaluation" / "build_frozen_snapshot.py")])
    run([sys.executable, str(ROOT / "tools" / "evaluation" / "verify_frozen_manifest.py")])


if __name__ == "__main__":
    main()
