#!/usr/bin/env python3
"""
Ingest PDG-based micro dataset.
"""

from __future__ import annotations

import os
from typing import Any

from _micro_common import (
    ObservationRecord,
    connect_db,
    ensure_micro_schema,
    fetch_json_url,
    read_json_file,
    upsert_observation,
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


def _seed_row() -> tuple[float, float, float]:
    return (116592061e-11, 41e-11, 43e-11)


def _real_row() -> tuple[str, str, str, float, float, float]:
    local_json = os.environ.get("PDG_LOCAL_JSON", "").strip()
    url = os.environ.get("PDG_URL", "").strip()
    dataset_id = os.environ.get("PDG_DATASET_ID", "pdg-amu-live")
    version_tag = os.environ.get("PDG_VERSION_TAG", "live")
    source_url = url or "https://pdg.lbl.gov/"

    payload: dict[str, Any]
    if local_json:
        payload = read_json_file(local_json)  # type: ignore[assignment]
    elif url:
        data = fetch_json_url(url)
        if not isinstance(data, dict):
            raise RuntimeError("PDG url payload must be a JSON object")
        payload = data
    else:
        raise RuntimeError("set PDG_LOCAL_JSON or PDG_URL for real mode")

    measured = _f(payload.get("measured_value"))
    stat_err = _f(payload.get("stat_err"))
    sys_err = _f(payload.get("sys_err"))
    if None in (measured, stat_err, sys_err):
        raise RuntimeError("PDG real payload missing required numeric keys")
    return (dataset_id, source_url, version_tag, measured, stat_err, sys_err)


def _ingest(
    *,
    source_id: str,
    dataset_id: str,
    source_url: str,
    version_tag: str,
    quality_flag: str,
    measured: float,
    stat_err: float,
    sys_err: float,
) -> None:
    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        upsert_source(
            conn,
            source_id=source_id,
            provider="PDG",
            dataset_ref="muon-g-2-world-average",
            url=source_url,
            license_name="PDG terms",
            version_tag=version_tag,
        )

        upsert_observation(
            conn,
            ObservationRecord(
                channel="muon_g_minus_2",
                observable_id="muon_g_minus_2",
                dataset_id=dataset_id,
                dataset_group="pdg-muon-g2",
                x_value=None,
                measured_value=measured,
                stat_err=stat_err,
                sys_err=sys_err,
                cov_group="muon-g2",
                unit="1",
                observed_at_utc="2024-01-01T00:00:00Z",
                quality_flag=quality_flag,
                source_url=source_url,
            ),
        )
        conn.commit()
    finally:
        conn.close()


def main() -> None:
    if want_real_ingest():
        try:
            dataset_id, source_url, version_tag, measured, stat_err, sys_err = _real_row()
            _ingest(
                source_id="pdg-amu-live",
                dataset_id=dataset_id,
                source_url=source_url,
                version_tag=version_tag,
                quality_flag="real",
                measured=measured,
                stat_err=stat_err,
                sys_err=sys_err,
            )
            print(f"ingested: pdg real ({dataset_id})")
            return
        except Exception as exc:
            raise SystemExit(f"pdg real ingest failed (no seed fallback in real mode): {exc}") from exc

    measured, stat_err, sys_err = _seed_row()
    _ingest(
        source_id="pdg-amu-2024",
        dataset_id="pdg-amu-2024",
        source_url="https://pdg.lbl.gov/",
        version_tag="2024-seed-v1",
        quality_flag="seed",
        measured=measured,
        stat_err=stat_err,
        sys_err=sys_err,
    )
    print("ingested: pdg seed (muon_g_minus_2)")


if __name__ == "__main__":
    main()
