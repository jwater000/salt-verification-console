#!/usr/bin/env python3
"""
Build SQLite DB for SALT realtime validation MVP.

This script bootstraps DB schema and imports current processed result JSON files
so the web tier can move from file-based reads to query-based reads.
"""

from __future__ import annotations

import json
import math
import sqlite3
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[2]
SCHEMA_PATH = ROOT / "docs" / "method" / "realtime_db_schema.sql"
PROCESSED_DIR = ROOT / "data" / "processed"
DB_PATH = ROOT / "data" / "processed" / "svc_realtime.db"
STREAMS_PATH = ROOT / "data" / "processed" / "live_streams.json"
LIVE_EVENTS_PATH = ROOT / "data" / "processed" / "live_events.json"


def execute_schema(conn: sqlite3.Connection) -> None:
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    conn.executescript(schema)
    ensure_model_scores_columns(conn)


def ensure_model_scores_columns(conn: sqlite3.Connection) -> None:
    existing = {
        row[1]
        for row in conn.execute("PRAGMA table_info(model_scores)").fetchall()
    }
    wanted: dict[str, str] = {
        "actual_value": "REAL",
        "standard_error": "REAL",
        "salt_error": "REAL",
    }
    for column, column_type in wanted.items():
        if column not in existing:
            conn.execute(f"ALTER TABLE model_scores ADD COLUMN {column} {column_type}")


def load_json(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def load_live_events(path: Path) -> list[dict]:
    if not path.exists():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict):
        events = raw.get("events")
        if isinstance(events, list):
            return [x for x in events if isinstance(x, dict)]
    if isinstance(raw, list):
        return [x for x in raw if isinstance(x, dict)]
    return []


def iter_result_rows() -> Iterable[dict]:
    for path in sorted(PROCESSED_DIR.glob("results_*.json")):
        rows = load_json(path)
        for row in rows:
            yield row


def upsert_streams(conn: sqlite3.Connection) -> int:
    rows = load_json(STREAMS_PATH)
    count = 0
    for row in rows:
        conn.execute(
            """
            INSERT INTO stream_sources (
              stream_id, label, provider, embed_url, source_url, status, last_checked_utc
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(stream_id) DO UPDATE SET
              label=excluded.label,
              provider=excluded.provider,
              embed_url=excluded.embed_url,
              source_url=excluded.source_url,
              status=excluded.status,
              last_checked_utc=excluded.last_checked_utc
            """,
            (
                row.get("stream_id"),
                row.get("label"),
                row.get("provider"),
                row.get("embed_url"),
                row.get("source_url"),
                row.get("status", "unknown"),
                row.get("last_checked_utc"),
            ),
        )
        count += 1
    return count


def upsert_scores(conn: sqlite3.Connection) -> int:
    count = 0
    for row in iter_result_rows():
        prediction_id = row.get("prediction_id", "")
        source_id = "unknown"
        if prediction_id.startswith("p1"):
            source_id = "ligo"
        elif prediction_id.startswith("p2"):
            source_id = "fermi"

        actual_value = row.get("actual_value")
        if actual_value is not None:
            actual_value = float(actual_value)
        standard_fit = float(row.get("standard_fit", 0.0))
        salt_fit = float(row.get("salt_fit", 0.0))
        standard_error = None if actual_value is None else actual_value - standard_fit
        salt_error = None if actual_value is None else actual_value - salt_fit

        conn.execute(
            """
            INSERT INTO model_scores (
              prediction_id, source_id, event_id, event_time_utc,
              actual_value, standard_fit, salt_fit, standard_error, salt_error, residual_score, flag
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(prediction_id, source_id, event_id) DO UPDATE SET
              event_time_utc=excluded.event_time_utc,
              actual_value=excluded.actual_value,
              standard_fit=excluded.standard_fit,
              salt_fit=excluded.salt_fit,
              standard_error=excluded.standard_error,
              salt_error=excluded.salt_error,
              residual_score=excluded.residual_score,
              flag=excluded.flag
            """,
            (
                prediction_id,
                source_id,
                row.get("event_id"),
                row.get("event_time_utc"),
                actual_value,
                standard_fit,
                salt_fit,
                standard_error,
                salt_error,
                float(row.get("residual_score", 0.0)),
                row.get("flag", "neutral"),
            ),
        )
        count += 1
    return count


def upsert_live_events(conn: sqlite3.Connection) -> int:
    rows = load_live_events(LIVE_EVENTS_PATH)
    count = 0
    for row in rows:
        source_id = str(row.get("source_id", "unknown"))
        external_event_id = str(row.get("external_event_id", "")).strip()
        if not external_event_id:
            continue

        event_time_utc = row.get("event_time_utc")
        quality_flag = str(row.get("quality_flag", "unknown"))
        payload = row.get("payload", {})
        payload_text = json.dumps(payload, ensure_ascii=False)

        conn.execute(
            """
            INSERT INTO events_raw (
              source_id, external_event_id, observed_at_utc, payload_json
            )
            VALUES (?, ?, ?, ?)
            ON CONFLICT(source_id, external_event_id) DO UPDATE SET
              observed_at_utc=excluded.observed_at_utc,
              payload_json=excluded.payload_json
            """,
            (source_id, external_event_id, event_time_utc, payload_text),
        )

        feature_vector_json = json.dumps(
            {
                "source_id": source_id,
                "has_payload": bool(payload),
            },
            ensure_ascii=False,
        )
        conn.execute(
            """
            INSERT INTO events_normalized (
              source_id, event_id, event_time_utc, feature_vector_json, quality_flag
            )
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(source_id, event_id) DO UPDATE SET
              event_time_utc=excluded.event_time_utc,
              feature_vector_json=excluded.feature_vector_json,
              quality_flag=excluded.quality_flag
            """,
            (source_id, external_event_id, event_time_utc, feature_vector_json, quality_flag),
        )
        count += 1

    return count


def parse_utc(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC)
    except ValueError:
        return None


def rebuild_metric_windows(conn: sqlite3.Connection) -> int:
    rows = conn.execute(
        """
        SELECT
          prediction_id, source_id, event_time_utc,
          standard_fit, salt_fit, residual_score,
          standard_error, salt_error
        FROM model_scores
        """
    ).fetchall()

    parsed: list[tuple[str, str, datetime, float, float, float, float | None, float | None]] = []
    for (
        prediction_id,
        source_id,
        event_time_utc,
        standard_fit,
        salt_fit,
        residual_score,
        standard_error,
        salt_error,
    ) in rows:
        dt = parse_utc(event_time_utc)
        if dt is None:
            continue
        parsed.append(
            (
                prediction_id,
                source_id,
                dt,
                float(standard_fit),
                float(salt_fit),
                float(residual_score),
                None if standard_error is None else float(standard_error),
                None if salt_error is None else float(salt_error),
            )
        )

    conn.execute("DELETE FROM metric_windows")
    if not parsed:
        return 0

    window_specs: list[tuple[str, timedelta]] = [
        ("1h", timedelta(hours=1)),
        ("24h", timedelta(hours=24)),
        ("7d", timedelta(days=7)),
    ]
    latest = max(row[2] for row in parsed)

    grouped: dict[tuple[str, str], list[tuple[datetime, float, float, float, float | None, float | None]]] = {}
    for prediction_id, source_id, dt, standard_fit, salt_fit, residual_score, standard_error, salt_error in parsed:
        key = (source_id, prediction_id)
        grouped.setdefault(key, []).append((dt, standard_fit, salt_fit, residual_score, standard_error, salt_error))

    inserted = 0
    for (source_id, prediction_id), points in grouped.items():
        for window_label, span in window_specs:
            start = latest - span
            selected = [p for p in points if p[0] >= start and p[0] <= latest]
            if not selected:
                continue

            salt_errors = [p[5] for p in selected if p[5] is not None]
            residuals = [p[3] for p in selected]
            if salt_errors:
                mae = sum(abs(x) for x in salt_errors) / len(salt_errors)
                rmse = math.sqrt(sum(x * x for x in salt_errors) / len(salt_errors))
            else:
                # Fallback for legacy rows without actual_value.
                mae = sum(abs(x) for x in residuals) / len(residuals)
                rmse = math.sqrt(sum(x * x for x in residuals) / len(residuals))
            avg_delta_fit = sum(p[2] - p[1] for p in selected) / len(selected)

            conn.execute(
                """
                INSERT INTO metric_windows (
                  source_id, prediction_id, window_label, window_end_utc,
                  mae, rmse, avg_delta_fit, sample_count
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    source_id,
                    prediction_id,
                    window_label,
                    latest.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    mae,
                    rmse,
                    avg_delta_fit,
                    len(selected),
                ),
            )
            inserted += 1

    return inserted


def cleanup_old_records(conn: sqlite3.Connection) -> int:
    """
    Retain only the most recent N records to keep the DB size well under 100MB.
    """
    count = 0
    # Keep last 10,000 raw events
    conn.execute(
        """
        DELETE FROM events_raw 
        WHERE rowid NOT IN (
            SELECT rowid FROM events_raw ORDER BY observed_at_utc DESC LIMIT 10000
        )
        """
    )
    count += conn.execute("SELECT changes()").fetchone()[0]

    # Keep last 10,000 normalized events
    conn.execute(
        """
        DELETE FROM events_normalized 
        WHERE rowid NOT IN (
            SELECT rowid FROM events_normalized ORDER BY event_time_utc DESC LIMIT 10000
        )
        """
    )
    count += conn.execute("SELECT changes()").fetchone()[0]

    # Keep last 10,000 model scores
    conn.execute(
        """
        DELETE FROM model_scores 
        WHERE rowid NOT IN (
            SELECT rowid FROM model_scores ORDER BY event_time_utc DESC LIMIT 10000
        )
        """
    )
    count += conn.execute("SELECT changes()").fetchone()[0]

    return count


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        execute_schema(conn)
        stream_count = upsert_streams(conn)
        live_event_count = upsert_live_events(conn)
        score_count = upsert_scores(conn)
        metric_count = rebuild_metric_windows(conn)
        deleted_count = cleanup_old_records(conn)
        conn.commit()
        # Ensure optimal DB size
        conn.execute("VACUUM")
    finally:
        conn.close()

    print(f"DB built: {DB_PATH}")
    print(f"streams upserted: {stream_count}")
    print(f"live events upserted: {live_event_count}")
    print(f"model_scores upserted: {score_count}")
    print(f"metric_windows rebuilt: {metric_count}")
    print(f"old records cleaned: {deleted_count}")


if __name__ == "__main__":
    main()
