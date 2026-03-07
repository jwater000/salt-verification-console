#!/usr/bin/env python3
"""
Ingest NuFIT-based micro dataset (real mode with seed fallback).
"""

from __future__ import annotations

import os
from typing import Any

from _micro_common import (
    ObservationRecord,
    PredictionRecord,
    connect_db,
    ensure_micro_schema,
    fetch_json_url,
    read_json_file,
    upsert_observation,
    upsert_salt_prediction,
    upsert_sm_prediction,
    upsert_source,
    want_real_ingest,
)


def _f(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _seed_rows() -> list[tuple[str, float, float, float, float, float]]:
    return [
        ("nu_theta23", 0.866, 0.020, 0.010, 0.858, 0.862),
        ("nu_dm2_32", 2.455e-3, 0.035e-3, 0.015e-3, 2.453e-3, 2.454e-3),
    ]


def _extract_rows(payload: Any) -> list[tuple[str, float, float, float, float, float]]:
    rows: list[tuple[str, float, float, float, float, float]] = []
    if isinstance(payload, dict) and isinstance(payload.get("rows"), list):
        for r in payload["rows"]:
            if not isinstance(r, dict):
                continue
            obs = str(r.get("observable_id", "")).strip()
            measured = _f(r.get("measured_value"))
            stat_err = _f(r.get("stat_err"))
            sys_err = _f(r.get("sys_err"))
            sm_pred = _f(r.get("sm_pred"))
            salt_pred = _f(r.get("salt_pred"))
            if obs and None not in (measured, stat_err, sys_err, sm_pred, salt_pred):
                rows.append((obs, measured, stat_err, sys_err, sm_pred, salt_pred))
    return rows


def _real_rows() -> tuple[str, str, str, list[tuple[str, float, float, float, float, float]]]:
    local_json = os.environ.get("NUFIT_LOCAL_JSON", "").strip()
    url = os.environ.get("NUFIT_URL", "").strip()
    dataset_id = os.environ.get("NUFIT_DATASET_ID", "nufit-live")
    version_tag = os.environ.get("NUFIT_VERSION_TAG", "live")
    source_url = url or "https://www.nu-fit.org/"
    insecure = os.environ.get("NUFIT_ALLOW_INSECURE", "").strip().lower() in {"1", "true", "yes"}

    payload: Any
    if local_json:
        payload = read_json_file(local_json)
    elif url:
        payload = fetch_json_url(url, insecure=insecure)
    else:
        raise RuntimeError("set NUFIT_LOCAL_JSON or NUFIT_URL for real mode")

    rows = _extract_rows(payload)
    if not rows:
        raise RuntimeError("NUFIT real payload missing `rows` with required fields")
    return dataset_id, source_url, version_tag, rows


def _ingest(
    *,
    source_id: str,
    dataset_id: str,
    source_url: str,
    version_tag: str,
    quality_flag: str,
    rows: list[tuple[str, float, float, float, float, float]],
) -> None:
    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        upsert_source(
            conn,
            source_id=source_id,
            provider="NuFIT",
            dataset_ref="global-fit-normal-ordering",
            url=source_url,
            license_name="NuFIT terms",
            version_tag=version_tag,
        )

        for observable_id, measured, stat_err, sys_err, sm_pred, salt_pred in rows:
            upsert_observation(
                conn,
                ObservationRecord(
                    channel="neutrino_oscillation",
                    observable_id=observable_id,
                    dataset_id=dataset_id,
                    dataset_group="nufit-global",
                    x_value=None,
                    measured_value=measured,
                    stat_err=stat_err,
                    sys_err=sys_err,
                    cov_group="nufit",
                    unit="rad" if "theta" in observable_id else "eV^2",
                    observed_at_utc="2024-01-01T00:00:00Z",
                    quality_flag=quality_flag,
                    source_url=source_url,
                ),
            )
            upsert_sm_prediction(
                conn,
                PredictionRecord(
                    observable_id=observable_id,
                    dataset_id=dataset_id,
                    x_value=None,
                    value=sm_pred,
                    value_err=stat_err,
                    model_ref="NuFIT-SM-baseline",
                ),
            )
            upsert_salt_prediction(
                conn,
                PredictionRecord(
                    observable_id=observable_id,
                    dataset_id=dataset_id,
                    x_value=None,
                    value=salt_pred,
                    value_err=stat_err,
                    model_ref="SALT-micro-template",
                ),
                alpha=0.001,
                beta=0.0005,
                gamma=0.0,
                formula_version="micro-v0-template",
            )
        conn.commit()
    finally:
        conn.close()


def main() -> None:
    if want_real_ingest():
        try:
            dataset_id, source_url, version_tag, rows = _real_rows()
            _ingest(
                source_id="nufit-live",
                dataset_id=dataset_id,
                source_url=source_url,
                version_tag=version_tag,
                quality_flag="real",
                rows=rows,
            )
            print(f"ingested: nufit real ({dataset_id}, rows={len(rows)})")
            return
        except Exception as exc:
            print(f"[warn] nufit real ingest failed; fallback to seed ({exc})")

    _ingest(
        source_id="nufit-5.2",
        dataset_id="nufit-5.2",
        source_url="https://www.nu-fit.org/",
        version_tag="5.2-seed-v1",
        quality_flag="seed",
        rows=_seed_rows(),
    )
    print("ingested: nufit seed (neutrino_oscillation)")


if __name__ == "__main__":
    main()
