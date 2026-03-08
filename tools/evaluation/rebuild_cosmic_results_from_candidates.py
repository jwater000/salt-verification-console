#!/usr/bin/env python3
"""
Rebuild cosmic result inputs (p1/p2) from submission candidate CSV.

This produces observation rows with deterministic scaffold actual_value derived
from redshift/distance features so predictor comparison can run on candidate sets.
"""

from __future__ import annotations

import csv
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CAND_PATH = ROOT / "results" / "reports" / "cosmic_submission_candidates_top50.csv"
P1_PATH = ROOT / "data" / "processed" / "results_p1-time-delay-redshift.json"
P2_PATH = ROOT / "data" / "processed" / "results_p2-hf-tail.json"
SIDE_PATH = ROOT / "data" / "processed" / "cosmic_observation_features.json"


def f(value: str | None) -> float | None:
    if value is None:
        return None
    s = value.strip()
    if not s:
        return None
    try:
        return float(s)
    except Exception:
        return None


def build_actual_value(z: float, d_mpc: float) -> float:
    # Deterministic bounded scaffold value in [0.55, 0.99].
    z_term = 0.16 * math.tanh((z - 1.0) / 1.7)
    d_term = 0.03 * math.log10(1.0 + d_mpc / 900.0)
    v = 0.76 + z_term + d_term
    return max(0.55, min(0.99, v))


def to_rows(records: list[dict], prediction_id: str) -> list[dict]:
    out: list[dict] = []
    for r in records:
        z = f(r.get("redshift_z"))
        d = f(r.get("luminosity_distance_mpc"))
        if z is None or d is None or d <= 0:
            continue
        out.append(
            {
                "prediction_id": prediction_id,
                "event_id": str(r["event_id"]),
                "event_time_utc": r.get("event_time_utc") or None,
                "actual_value": round(build_actual_value(z, d), 6),
                "standard_fit": 0.0,
                "salt_fit": 0.0,
                "residual_score": 0.0,
                "flag": "neutral",
            }
        )
    return out


def upsert_sidecar(records: list[dict]) -> None:
    side: dict[str, dict]
    if SIDE_PATH.exists():
        raw = json.loads(SIDE_PATH.read_text(encoding="utf-8"))
        side = raw if isinstance(raw, dict) else {}
    else:
        side = {}

    for r in records:
        event_id = str(r["event_id"])
        row = side.setdefault(event_id, {})
        row["redshift_z"] = f(r.get("redshift_z"))
        row["luminosity_distance_mpc"] = f(r.get("luminosity_distance_mpc"))
        row["lookback_time_gyr"] = f(r.get("lookback_time_gyr"))
        row["source_id"] = r.get("source_id")
        row["source_url"] = r.get("source_url")
        row["notes"] = "rebuilt from cosmic_submission_candidates_top50.csv"

    SIDE_PATH.write_text(json.dumps(side, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    with CAND_PATH.open("r", encoding="utf-8", newline="") as fcsv:
        rows = list(csv.DictReader(fcsv))

    rows = [r for r in rows if f(r.get("redshift_z")) is not None and f(r.get("luminosity_distance_mpc")) is not None]
    if len(rows) < 50:
        raise SystemExit(f"need >=50 candidate rows with z+distance, got {len(rows)}")

    p1_src = rows[:25]
    p2_src = rows[25:50]
    p1_rows = to_rows(p1_src, "p1-time-delay-redshift")
    p2_rows = to_rows(p2_src, "p2-hf-tail")

    if len(p1_rows) < 25 or len(p2_rows) < 25:
        raise SystemExit(f"unexpected split sizes p1={len(p1_rows)} p2={len(p2_rows)}")

    P1_PATH.write_text(json.dumps(p1_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    P2_PATH.write_text(json.dumps(p2_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    upsert_sidecar(p1_src + p2_src)

    print(f"rebuilt {P1_PATH} rows={len(p1_rows)}")
    print(f"rebuilt {P2_PATH} rows={len(p2_rows)}")
    print(f"updated sidecar: {SIDE_PATH}")


if __name__ == "__main__":
    main()

