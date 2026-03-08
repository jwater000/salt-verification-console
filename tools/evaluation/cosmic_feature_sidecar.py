#!/usr/bin/env python3
"""
Build or validate cosmic observation feature sidecar.

Usage:
  python tools/evaluation/cosmic_feature_sidecar.py --write
  python tools/evaluation/cosmic_feature_sidecar.py --check
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
P1_PATH = ROOT / "data" / "processed" / "results_p1-time-delay-redshift.json"
P2_PATH = ROOT / "data" / "processed" / "results_p2-hf-tail.json"
SIDE_PATH = ROOT / "data" / "processed" / "cosmic_observation_features.json"
LIVE_EVENTS_PATH = ROOT / "data" / "processed" / "live_events.json"
MISSING_CSV_PATH = ROOT / "results" / "reports" / "cosmic_feature_fill_queue.csv"


def load_result_ids(path: Path) -> list[str]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    out: list[str] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        event_id = str(row.get("event_id", "")).strip()
        if event_id:
            out.append(event_id)
    return out


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


def load_live_index() -> dict[str, dict]:
    if not LIVE_EVENTS_PATH.exists():
        return {}
    raw = json.loads(LIVE_EVENTS_PATH.read_text(encoding="utf-8"))
    events = raw.get("events") if isinstance(raw, dict) else None
    if not isinstance(events, list):
        return {}
    out: dict[str, dict] = {}
    for row in events:
        if not isinstance(row, dict):
            continue
        event_id = str(row.get("external_event_id", "")).strip()
        if event_id:
            out[event_id] = row
    return out


def resolve_source_url(live_row: dict | None) -> str | None:
    if not live_row:
        return None
    payload = live_row.get("payload")
    if isinstance(payload, dict):
        links = payload.get("links")
        if isinstance(links, dict):
            self_url = links.get("self")
            if isinstance(self_url, str) and self_url.strip():
                return self_url.strip()
    return None


def merge_template(sidecar: dict[str, dict], event_ids: list[str]) -> dict[str, dict]:
    live_idx = load_live_index()
    out = dict(sidecar)
    for event_id in sorted(set(event_ids)):
        live_row = live_idx.get(event_id)
        source_id = live_row.get("source_id") if isinstance(live_row, dict) else None
        source_url = resolve_source_url(live_row)
        row = out.setdefault(
            event_id,
            {
                "redshift_z": None,
                "luminosity_distance_mpc": None,
                "lookback_time_gyr": None,
                "notes": "fill before COSMIC_SUBMISSION_MODE=1 run",
            },
        )
        if not isinstance(row, dict):
            row = {}
            out[event_id] = row
        row.setdefault("redshift_z", None)
        row.setdefault("luminosity_distance_mpc", None)
        row.setdefault("lookback_time_gyr", None)
        row.setdefault("notes", "fill before COSMIC_SUBMISSION_MODE=1 run")
        if row.get("source_id") in {None, ""} and source_id:
            row["source_id"] = source_id
        else:
            row.setdefault("source_id", None)
        if row.get("source_url") in {None, ""} and source_url:
            row["source_url"] = source_url
        else:
            row.setdefault("source_url", None)
    return out


def check_complete(sidecar: dict[str, dict], event_ids: list[str]) -> tuple[bool, list[str]]:
    missing: list[str] = []
    for event_id in sorted(set(event_ids)):
        row = sidecar.get(event_id) or {}
        if row.get("redshift_z") is None or row.get("luminosity_distance_mpc") is None:
            missing.append(event_id)
    return (len(missing) == 0), missing


def write_missing_queue(sidecar: dict[str, dict], missing: list[str]) -> None:
    MISSING_CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    with MISSING_CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["event_id", "source_id", "source_url", "redshift_z", "luminosity_distance_mpc", "lookback_time_gyr", "notes"])
        for event_id in missing:
            row = sidecar.get(event_id, {})
            w.writerow(
                [
                    event_id,
                    row.get("source_id"),
                    row.get("source_url"),
                    row.get("redshift_z"),
                    row.get("luminosity_distance_mpc"),
                    row.get("lookback_time_gyr"),
                    row.get("notes"),
                ]
            )


def main() -> None:
    p = argparse.ArgumentParser(description="Build/validate cosmic feature sidecar")
    p.add_argument("--write", action="store_true", help="write merged sidecar template")
    p.add_argument("--check", action="store_true", help="check completeness for submission mode")
    args = p.parse_args()
    if not args.write and not args.check:
        raise SystemExit("choose --write or --check")

    event_ids = load_result_ids(P1_PATH) + load_result_ids(P2_PATH)
    sidecar = load_sidecar()
    merged = merge_template(sidecar, event_ids)

    if args.write:
        SIDE_PATH.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"sidecar written: {SIDE_PATH}")
        print(f"events tracked: {len(merged)}")

    if args.check:
        ok, missing = check_complete(merged, event_ids)
        if not ok:
            write_missing_queue(merged, missing)
            print(f"[fail] missing required features for {len(missing)} events")
            print("  " + ", ".join(missing[:20]))
            print(f"  fill queue: {MISSING_CSV_PATH}")
            raise SystemExit(1)
        print(f"[ok] sidecar complete for submission mode ({len(set(event_ids))} events)")


if __name__ == "__main__":
    main()
