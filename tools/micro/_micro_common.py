#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sqlite3
import ssl
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "data" / "processed" / "svc_realtime.db"
SCHEMA_PATH = ROOT / "docs" / "method" / "micro_db_schema.sql"


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def ingest_mode() -> str:
    return os.environ.get("MICRO_INGEST_MODE", "seed").strip().lower()


def want_real_ingest() -> bool:
    return ingest_mode() in {"real", "live"}


def connect_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_micro_schema(conn: sqlite3.Connection) -> None:
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    conn.executescript(schema)
    ensure_micro_fit_runs_columns(conn)
    ensure_micro_observation_columns(conn)


def ensure_micro_fit_runs_columns(conn: sqlite3.Connection) -> None:
    existing = {row[1] for row in conn.execute("PRAGMA table_info(micro_fit_runs)").fetchall()}
    if "verdict_reason" not in existing:
        conn.execute("ALTER TABLE micro_fit_runs ADD COLUMN verdict_reason TEXT")
    if "exploratory_verdict" not in existing:
        conn.execute("ALTER TABLE micro_fit_runs ADD COLUMN exploratory_verdict TEXT")
    if "exploratory_reason" not in existing:
        conn.execute("ALTER TABLE micro_fit_runs ADD COLUMN exploratory_reason TEXT")
    if "neutrino_family_q" not in existing:
        conn.execute("ALTER TABLE micro_fit_runs ADD COLUMN neutrino_family_q REAL")


def ensure_micro_observation_columns(conn: sqlite3.Connection) -> None:
    existing = {row[1] for row in conn.execute("PRAGMA table_info(micro_observations)").fetchall()}
    if "dataset_group" not in existing:
        conn.execute("ALTER TABLE micro_observations ADD COLUMN dataset_group TEXT")


def dedupe_micro_tables(conn: sqlite3.Connection) -> None:
    # SQLite UNIQUE does not collapse NULL keys, so keep latest row per NULL-x key.
    conn.execute(
        """
        DELETE FROM micro_observations
        WHERE obs_id IN (
          SELECT o1.obs_id
          FROM micro_observations o1
          JOIN micro_observations o2
            ON o1.observable_id = o2.observable_id
           AND o1.dataset_id = o2.dataset_id
           AND o1.x_value IS NULL
           AND o2.x_value IS NULL
           AND o1.obs_id < o2.obs_id
        )
        """
    )
    conn.execute(
        """
        DELETE FROM micro_sm_predictions
        WHERE pred_id IN (
          SELECT s1.pred_id
          FROM micro_sm_predictions s1
          JOIN micro_sm_predictions s2
            ON s1.observable_id = s2.observable_id
           AND s1.dataset_id = s2.dataset_id
           AND s1.x_value IS NULL
           AND s2.x_value IS NULL
           AND s1.pred_id < s2.pred_id
        )
        """
    )
    conn.execute(
        """
        DELETE FROM micro_salt_predictions
        WHERE salt_pred_id IN (
          SELECT s1.salt_pred_id
          FROM micro_salt_predictions s1
          JOIN micro_salt_predictions s2
            ON s1.observable_id = s2.observable_id
           AND s1.dataset_id = s2.dataset_id
           AND s1.x_value IS NULL
           AND s2.x_value IS NULL
           AND s1.salt_pred_id < s2.salt_pred_id
        )
        """
    )


def read_json_file(path: str | Path) -> dict | list:
    p = Path(path)
    return json.loads(p.read_text(encoding="utf-8"))


def fetch_json_url(
    url: str,
    *,
    timeout_s: float = 30.0,
    insecure: bool = False,
    user_agent: str = "salt-verification-console/0.1",
) -> dict | list:
    req = Request(url, headers={"User-Agent": user_agent})
    context = None
    if insecure:
        context = ssl._create_unverified_context()
    try:
        with urlopen(req, timeout=timeout_s, context=context) as resp:  # nosec: B310
            body = resp.read().decode("utf-8")
    except URLError as exc:
        raise RuntimeError(f"failed to fetch url: {url} ({exc})") from exc
    return json.loads(body)


@dataclass
class ObservationRecord:
    channel: str
    observable_id: str
    dataset_id: str
    dataset_group: str | None
    x_value: float | None
    measured_value: float
    stat_err: float | None
    sys_err: float | None
    cov_group: str | None
    unit: str | None
    observed_at_utc: str | None
    quality_flag: str
    source_url: str


@dataclass
class PredictionRecord:
    observable_id: str
    dataset_id: str
    x_value: float | None
    value: float
    value_err: float | None
    model_ref: str


def upsert_source(
    conn: sqlite3.Connection,
    *,
    source_id: str,
    provider: str,
    dataset_ref: str,
    url: str,
    license_name: str,
    version_tag: str,
) -> None:
    conn.execute(
        """
        INSERT INTO micro_sources (
          source_id, provider, dataset_ref, url, license, version_tag, fetched_at_utc
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(source_id) DO UPDATE SET
          provider=excluded.provider,
          dataset_ref=excluded.dataset_ref,
          url=excluded.url,
          license=excluded.license,
          version_tag=excluded.version_tag,
          fetched_at_utc=excluded.fetched_at_utc
        """,
        (source_id, provider, dataset_ref, url, license_name, version_tag, now_utc()),
    )


def upsert_observation(conn: sqlite3.Connection, row: ObservationRecord) -> None:
    if row.x_value is None:
        existing = conn.execute(
            """
            SELECT obs_id
            FROM micro_observations
            WHERE observable_id=? AND dataset_id=? AND x_value IS NULL
            ORDER BY obs_id DESC
            LIMIT 1
            """,
            (row.observable_id, row.dataset_id),
        ).fetchone()
        if existing is not None:
            conn.execute(
                """
                UPDATE micro_observations
                SET channel=?,
                    dataset_group=?,
                    measured_value=?,
                    stat_err=?,
                    sys_err=?,
                    cov_group=?,
                    unit=?,
                    observed_at_utc=?,
                    quality_flag=?,
                    source_url=?,
                    ingested_at_utc=(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
                WHERE obs_id=?
                """,
                (
                    row.channel,
                    row.dataset_group,
                    row.measured_value,
                    row.stat_err,
                    row.sys_err,
                    row.cov_group,
                    row.unit,
                    row.observed_at_utc,
                    row.quality_flag,
                    row.source_url,
                    existing["obs_id"],
                ),
            )
            return

    conn.execute(
        """
        INSERT INTO micro_observations (
          channel, observable_id, dataset_id, dataset_group, x_value,
          measured_value, stat_err, sys_err, cov_group, unit,
          observed_at_utc, quality_flag, source_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(observable_id, dataset_id, x_value) DO UPDATE SET
          channel=excluded.channel,
          dataset_group=excluded.dataset_group,
          measured_value=excluded.measured_value,
          stat_err=excluded.stat_err,
          sys_err=excluded.sys_err,
          cov_group=excluded.cov_group,
          unit=excluded.unit,
          observed_at_utc=excluded.observed_at_utc,
          quality_flag=excluded.quality_flag,
          source_url=excluded.source_url,
          ingested_at_utc=(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
        """,
        (
            row.channel,
            row.observable_id,
            row.dataset_id,
            row.dataset_group,
            row.x_value,
            row.measured_value,
            row.stat_err,
            row.sys_err,
            row.cov_group,
            row.unit,
            row.observed_at_utc,
            row.quality_flag,
            row.source_url,
        ),
    )


def upsert_sm_prediction(conn: sqlite3.Connection, row: PredictionRecord) -> None:
    if row.x_value is None:
        existing = conn.execute(
            """
            SELECT pred_id
            FROM micro_sm_predictions
            WHERE observable_id=? AND dataset_id=? AND x_value IS NULL
            ORDER BY pred_id DESC
            LIMIT 1
            """,
            (row.observable_id, row.dataset_id),
        ).fetchone()
        if existing is not None:
            conn.execute(
                """
                UPDATE micro_sm_predictions
                SET sm_pred=?,
                    sm_pred_err=?,
                    sm_model_ref=?
                WHERE pred_id=?
                """,
                (row.value, row.value_err, row.model_ref, existing["pred_id"]),
            )
            return

    conn.execute(
        """
        INSERT INTO micro_sm_predictions (
          observable_id, dataset_id, x_value, sm_pred, sm_pred_err, sm_model_ref
        )
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(observable_id, dataset_id, x_value) DO UPDATE SET
          sm_pred=excluded.sm_pred,
          sm_pred_err=excluded.sm_pred_err,
          sm_model_ref=excluded.sm_model_ref
        """,
        (row.observable_id, row.dataset_id, row.x_value, row.value, row.value_err, row.model_ref),
    )


def upsert_salt_prediction(
    conn: sqlite3.Connection,
    row: PredictionRecord,
    *,
    alpha: float | None,
    beta: float | None,
    gamma: float | None,
    formula_version: str,
) -> None:
    if row.x_value is None:
        existing = conn.execute(
            """
            SELECT salt_pred_id
            FROM micro_salt_predictions
            WHERE observable_id=? AND dataset_id=? AND x_value IS NULL
            ORDER BY salt_pred_id DESC
            LIMIT 1
            """,
            (row.observable_id, row.dataset_id),
        ).fetchone()
        if existing is not None:
            conn.execute(
                """
                UPDATE micro_salt_predictions
                SET salt_pred=?,
                    alpha_micro=?,
                    beta_micro=?,
                    gamma_micro=?,
                    formula_version=?
                WHERE salt_pred_id=?
                """,
                (row.value, alpha, beta, gamma, formula_version, existing["salt_pred_id"]),
            )
            return

    conn.execute(
        """
        INSERT INTO micro_salt_predictions (
          observable_id, dataset_id, x_value, salt_pred,
          alpha_micro, beta_micro, gamma_micro, formula_version
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(observable_id, dataset_id, x_value) DO UPDATE SET
          salt_pred=excluded.salt_pred,
          alpha_micro=excluded.alpha_micro,
          beta_micro=excluded.beta_micro,
          gamma_micro=excluded.gamma_micro,
          formula_version=excluded.formula_version
        """,
        (
            row.observable_id,
            row.dataset_id,
            row.x_value,
            row.value,
            alpha,
            beta,
            gamma,
            formula_version,
        ),
    )
