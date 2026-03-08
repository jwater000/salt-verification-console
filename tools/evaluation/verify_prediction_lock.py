#!/usr/bin/env python3
"""
Verify micro prediction lock hash without mutating artifacts.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "data" / "processed" / "svc_realtime.db"
LOCK_PATH = ROOT / "data" / "processed" / "micro_prediction_lock.json"


def build_prediction_lock(rows: list[sqlite3.Row]) -> tuple[str, int]:
    canonical: list[str] = []
    for r in rows:
        x_raw = r["x_value"]
        x = "null" if x_raw is None else f"{float(x_raw):.12g}"
        line = "|".join(
            [
                str(r["channel"]),
                str(r["observable_id"]),
                str(r["dataset_id"]),
                x,
                f"{float(r['sm_pred']):.16g}",
                f"{float(r['salt_pred']):.16g}",
                str(r["formula_version"]),
            ]
        )
        canonical.append(line)
    canonical.sort()
    payload = "\n".join(canonical).encode("utf-8")
    return hashlib.sha256(payload).hexdigest(), len(canonical)


def verify(lock_path: Path, db_path: Path) -> int:
    if not lock_path.exists():
        print(f"[error] lock file missing: {lock_path}")
        return 2
    if not db_path.exists():
        print(f"[error] db missing: {db_path}")
        return 2

    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    expected_hash = str(lock.get("prediction_lock_sha256", "")).strip()
    quality_mode = str(lock.get("quality_mode", "real")).strip().lower()
    if quality_mode not in {"real", "all"}:
        print(f"[error] invalid quality_mode in lock: {quality_mode}")
        return 2
    where_clause = "WHERE o.quality_flag='real'" if quality_mode == "real" else ""

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(
            f"""
            SELECT
              o.channel, o.observable_id, o.dataset_id, o.x_value,
              sp.sm_pred, sa.salt_pred, sa.formula_version
            FROM micro_observations o
            JOIN micro_sm_predictions sp
              ON sp.observable_id = o.observable_id
             AND sp.dataset_id = o.dataset_id
             AND ((sp.x_value IS NULL AND o.x_value IS NULL) OR (sp.x_value = o.x_value))
            JOIN micro_salt_predictions sa
              ON sa.observable_id = o.observable_id
             AND sa.dataset_id = o.dataset_id
             AND ((sa.x_value IS NULL AND o.x_value IS NULL) OR (sa.x_value = o.x_value))
            {where_clause}
            ORDER BY o.channel, o.observable_id, o.dataset_id, COALESCE(o.x_value, -1)
            """
        ).fetchall()
    finally:
        conn.close()

    actual_hash, n = build_prediction_lock(rows)
    if expected_hash != actual_hash:
        print("[fail] micro prediction lock mismatch")
        print(f"  expected: {expected_hash}")
        print(f"  actual  : {actual_hash}")
        print(f"  rows    : {n}")
        return 1

    print("[ok] micro prediction lock verified")
    print(f"  hash={actual_hash}")
    print(f"  rows={n} quality_mode={quality_mode}")
    return 0


def main() -> None:
    p = argparse.ArgumentParser(description="Verify micro prediction lock hash")
    p.add_argument("--lock", default=str(LOCK_PATH), help="path to micro_prediction_lock.json")
    p.add_argument("--db", default=str(DB_PATH), help="path to svc_realtime.db")
    args = p.parse_args()
    raise SystemExit(verify(Path(args.lock).resolve(), Path(args.db).resolve()))


if __name__ == "__main__":
    main()
