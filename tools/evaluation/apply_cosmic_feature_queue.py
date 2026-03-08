#!/usr/bin/env python3
"""
Apply manual cosmic feature queue CSV into cosmic_observation_features.json.

Usage:
  python tools/evaluation/apply_cosmic_feature_queue.py
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SIDE_PATH = ROOT / "data" / "processed" / "cosmic_observation_features.json"
QUEUE_PATH = ROOT / "results" / "reports" / "cosmic_feature_fill_queue.csv"


def to_float_or_none(v: str | None) -> float | None:
    if v is None:
        return None
    s = v.strip()
    if not s:
        return None
    try:
        return float(s)
    except Exception:
        return None


def load_sidecar() -> dict[str, dict]:
    if not SIDE_PATH.exists():
        return {}
    raw = json.loads(SIDE_PATH.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return {}
    out: dict[str, dict] = {}
    for k, v in raw.items():
        if isinstance(v, dict):
            out[str(k)] = v
    return out


def main() -> None:
    sidecar = load_sidecar()
    if not QUEUE_PATH.exists():
        raise SystemExit(f"queue csv not found: {QUEUE_PATH}")

    applied = 0
    updated_numeric = 0
    with QUEUE_PATH.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            event_id = str(row.get("event_id", "")).strip()
            if not event_id:
                continue
            target = sidecar.setdefault(event_id, {})

            for key in ("source_id", "source_url", "notes"):
                val = row.get(key)
                if val is not None and val.strip():
                    target[key] = val.strip()

            for key in ("redshift_z", "luminosity_distance_mpc", "lookback_time_gyr"):
                num = to_float_or_none(row.get(key))
                if num is not None:
                    target[key] = num
                    updated_numeric += 1
                else:
                    target.setdefault(key, None)

            applied += 1

    SIDE_PATH.write_text(json.dumps(sidecar, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"applied rows: {applied}")
    print(f"updated numeric fields: {updated_numeric}")
    print(f"sidecar updated: {SIDE_PATH}")


if __name__ == "__main__":
    main()

