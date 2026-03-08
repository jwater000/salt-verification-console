#!/usr/bin/env python3
"""
Build frozen evaluation snapshot from data/processed.

This script copies evaluation artifacts into:
- data/frozen/<dataset_version>/
- data/frozen/current/
and writes manifest.json with file hashes.
"""

from __future__ import annotations

import hashlib
import json
import os
import shutil
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROCESSED_DIR = ROOT / "data" / "processed"
FROZEN_DIR = ROOT / "data" / "frozen"
CURRENT_DIR = FROZEN_DIR / "current"

FROZEN_FILES = [
    "audit_manifest.json",
    "model_eval_manifest.json",
    "cosmic_predictor_manifest.json",
    "micro_predictor_manifest.json",
    "micro_prediction_lock.json",
    "micro_snapshot.json",
    "results_p1-time-delay-redshift.json",
    "results_p2-hf-tail.json",
]


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def copy_selected(dst_dir: Path) -> list[dict]:
    dst_dir.mkdir(parents=True, exist_ok=True)
    out: list[dict] = []
    for name in FROZEN_FILES:
        src = PROCESSED_DIR / name
        if not src.exists():
            continue
        dst = dst_dir / name
        shutil.copy2(src, dst)
        out.append({"name": name, "sha256": sha256_file(dst), "bytes": dst.stat().st_size})
    return out


def main() -> None:
    dataset_version = os.environ.get("FROZEN_DATASET_VERSION", "").strip()
    if not dataset_version:
        dataset_version = datetime.now(UTC).strftime("frozen-%Y%m%d")

    version_dir = FROZEN_DIR / dataset_version
    files = copy_selected(version_dir)
    current_files = copy_selected(CURRENT_DIR)

    manifest = {
        "dataset_version": dataset_version,
        "created_at_utc": now_utc(),
        "source_base": "data/processed",
        "notes": "Evaluation uses frozen/current only. Monitoring uses live snapshot.",
        "files": files,
    }
    current_manifest = {
        **manifest,
        "files": current_files,
    }
    (version_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (CURRENT_DIR / "manifest.json").write_text(
        json.dumps(current_manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"frozen snapshot built: {dataset_version}")
    print(f"version_dir: {version_dir}")
    print(f"current_dir: {CURRENT_DIR}")
    print(f"files: {len(files)}")


if __name__ == "__main__":
    main()
