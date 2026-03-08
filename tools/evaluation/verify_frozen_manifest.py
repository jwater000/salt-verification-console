#!/usr/bin/env python3
"""
Verify frozen manifest integrity (required files, hash and size).
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
FROZEN_DIR = ROOT / "data" / "frozen"
REQUIRED_FILES = {
    "audit_manifest.json",
    "model_eval_manifest.json",
    "cosmic_predictor_manifest.json",
    "micro_predictor_manifest.json",
    "micro_prediction_lock.json",
    "micro_snapshot.json",
    "results_p1-time-delay-redshift.json",
    "results_p2-hf-tail.json",
}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def verify(manifest_path: Path) -> int:
    try:
        payload = json.loads(manifest_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"[error] manifest not found: {manifest_path}")
        return 2

    files = payload.get("files")
    if not isinstance(files, list):
        print("[error] manifest.files must be an array")
        return 2

    listed_names: set[str] = set()
    errors: list[str] = []
    base_dir = manifest_path.parent

    for item in files:
        name = str(item.get("name", "")).strip()
        listed_names.add(name)
        target = base_dir / name
        if not target.exists():
            errors.append(f"missing file: {name}")
            continue

        expected_hash = str(item.get("sha256", "")).strip()
        expected_bytes = item.get("bytes")
        actual_hash = sha256_file(target)
        actual_bytes = target.stat().st_size

        if expected_hash != actual_hash:
            errors.append(f"hash mismatch: {name} expected={expected_hash} actual={actual_hash}")
        if expected_bytes != actual_bytes:
            errors.append(f"bytes mismatch: {name} expected={expected_bytes} actual={actual_bytes}")

    missing_required = sorted(REQUIRED_FILES - listed_names)
    if missing_required:
        errors.append(f"required files missing from manifest: {', '.join(missing_required)}")

    # Enforce prediction lock fields across frozen artifacts.
    lock_name = "micro_prediction_lock.json"
    audit_name = "audit_manifest.json"
    model_eval_name = "model_eval_manifest.json"
    if {lock_name, audit_name, model_eval_name}.issubset(listed_names):
        try:
            lock_payload = json.loads((base_dir / lock_name).read_text(encoding="utf-8"))
            audit_payload = json.loads((base_dir / audit_name).read_text(encoding="utf-8"))
            model_eval_payload = json.loads((base_dir / model_eval_name).read_text(encoding="utf-8"))

            lock_sha = str(lock_payload.get("prediction_lock_sha256", "")).strip()
            audit_sha = str(audit_payload.get("prediction_lock_sha256", "")).strip()
            model_eval_sha = str(
                model_eval_payload.get("prediction_locks", {}).get("micro_prediction_lock_sha256", "")
            ).strip()
            if not lock_sha:
                errors.append("micro_prediction_lock.json missing prediction_lock_sha256")
            if not audit_sha:
                errors.append("audit_manifest.json missing prediction_lock_sha256")
            if not model_eval_sha:
                errors.append("model_eval_manifest.json missing prediction_locks.micro_prediction_lock_sha256")
            if lock_sha and audit_sha and lock_sha != audit_sha:
                errors.append("prediction lock mismatch: micro_prediction_lock.json vs audit_manifest.json")
            if lock_sha and model_eval_sha and lock_sha != model_eval_sha:
                errors.append("prediction lock mismatch: micro_prediction_lock.json vs model_eval_manifest.json")
        except Exception as exc:
            errors.append(f"failed to validate prediction lock fields: {exc}")

    if errors:
        print(f"[fail] {manifest_path}")
        for e in errors:
            print(f"  - {e}")
        return 1

    print(f"[ok] {manifest_path}")
    print(f"  files={len(files)} required={len(REQUIRED_FILES)}")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify frozen manifest integrity")
    parser.add_argument(
        "--manifest",
        default=str(FROZEN_DIR / "current" / "manifest.json"),
        help="path to manifest.json (default: data/frozen/current/manifest.json)",
    )
    args = parser.parse_args()
    raise SystemExit(verify(Path(args.manifest).resolve()))


if __name__ == "__main__":
    main()
