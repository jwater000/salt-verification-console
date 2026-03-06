#!/usr/bin/env python3
"""
Refresh live snapshot JSON from SQLite realtime DB.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "data" / "processed" / "svc_realtime.db"
OUT_PATH = ROOT / "data" / "processed" / "live_snapshot.json"


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"DB not found: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        streams = [
            dict(r)
            for r in conn.execute(
                """
                SELECT stream_id, label, provider, embed_url, source_url, status, last_checked_utc
                FROM stream_sources
                ORDER BY stream_id
                """
            ).fetchall()
        ]

        recent_events = [
            dict(r)
            for r in conn.execute(
                """
                SELECT prediction_id, source_id, event_id, event_time_utc,
                       actual_value, standard_fit, salt_fit,
                       standard_error, salt_error, residual_score, flag, computed_at_utc
                FROM model_scores
                ORDER BY COALESCE(event_time_utc, computed_at_utc) DESC
                LIMIT 20
                """
            ).fetchall()
        ]

        recent_observations = [
            dict(r)
            for r in conn.execute(
                """
                SELECT source_id, event_id, event_time_utc, quality_flag
                FROM events_normalized
                ORDER BY COALESCE(event_time_utc, '') DESC, event_pk DESC
                LIMIT 20
                """
            ).fetchall()
        ]

        windows = [
            dict(r)
            for r in conn.execute(
                """
                SELECT source_id, prediction_id, window_label, window_end_utc,
                       mae, rmse, avg_delta_fit, sample_count
                FROM metric_windows
                ORDER BY window_end_utc DESC, source_id, prediction_id, window_label
                """
            ).fetchall()
        ]
    finally:
        conn.close()

    payload = {
        "generated_at_utc": datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "streams": streams,
        "recent_events": recent_events,
        "recent_observations": recent_observations,
        "metric_windows": windows,
    }
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"snapshot refreshed: {OUT_PATH}")
    print(
        "streams: "
        f"{len(streams)}, recent_events: {len(recent_events)}, "
        f"recent_observations: {len(recent_observations)}, metric_windows: {len(windows)}"
    )


if __name__ == "__main__":
    main()
