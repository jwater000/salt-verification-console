#!/usr/bin/env python3
"""
Enrich cosmic_observation_features.json from source endpoints (GCN/GraceDB).

Only fills missing fields; never overwrites existing numeric values.
"""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
SIDE_PATH = ROOT / "data" / "processed" / "cosmic_observation_features.json"
LIVE_EVENTS_PATH = ROOT / "data" / "processed" / "live_events.json"


RE_Z = [
    re.compile(r"\bredshift\b[^0-9]{0,20}(?:z\s*[=:~]\s*)?([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
    re.compile(r"\bz\s*[=:~]\s*([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
]
RE_DIST = re.compile(
    r"(?:luminosity\s+distance|distance|d[_\s-]?l|D[_\s-]?L)[^0-9]{0,20}([0-9]+(?:\.[0-9]+)?)\s*(Mpc|Gpc)",
    re.IGNORECASE,
)


def f(v: Any) -> float | None:
    try:
        return float(v)
    except Exception:
        return None


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def fetch_json(url: str) -> dict | None:
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            return json.loads(r.read().decode("utf-8", "ignore"))
    except Exception:
        return None


def fetch_text(url: str) -> str:
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            return r.read().decode("utf-8", "ignore")
    except Exception:
        return ""


def parse_redshift(text: str) -> float | None:
    for rx in RE_Z:
        m = rx.search(text)
        if m:
            return f(m.group(1))
    return None


def parse_distance_mpc(text: str) -> float | None:
    m = RE_DIST.search(text)
    if not m:
        return None
    value = f(m.group(1))
    unit = str(m.group(2)).lower()
    if value is None:
        return None
    return value * 1000.0 if unit == "gpc" else value


def walk_find_numeric(obj: Any, key_words: tuple[str, ...]) -> float | None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            lk = str(k).lower()
            if any(w in lk for w in key_words):
                num = f(v)
                if num is not None:
                    return num
            got = walk_find_numeric(v, key_words)
            if got is not None:
                return got
    elif isinstance(obj, list):
        for v in obj:
            got = walk_find_numeric(v, key_words)
            if got is not None:
                return got
    return None


def main() -> None:
    side = load_json(SIDE_PATH, {})
    live = load_json(LIVE_EVENTS_PATH, {})
    events = live.get("events", []) if isinstance(live, dict) else []
    idx = {str(e.get("external_event_id", "")).strip(): e for e in events if isinstance(e, dict)}

    updated = 0
    for event_id, row in side.items():
        if not isinstance(row, dict):
            continue
        source_id = str(row.get("source_id", "")).strip().lower()
        if not source_id:
            src = idx.get(str(event_id), {})
            source_id = str(src.get("source_id", "")).strip().lower()
            if source_id:
                row["source_id"] = source_id

        # GCN: parse circular body text.
        if source_id == "gcn" and str(event_id).isdigit():
            j = fetch_json(f"https://gcn.nasa.gov/circulars/{event_id}.json")
            txt = ""
            if isinstance(j, dict):
                txt = f"{j.get('subject', '')}\n{j.get('body', '')}"
                if not row.get("source_url"):
                    row["source_url"] = f"https://gcn.nasa.gov/circulars/{event_id}"
            else:
                txt = fetch_text(f"https://gcn.nasa.gov/circulars/{event_id}.txt")

            if row.get("redshift_z") is None:
                z = parse_redshift(txt)
                if z is not None:
                    row["redshift_z"] = z
                    updated += 1
            if row.get("luminosity_distance_mpc") is None:
                d = parse_distance_mpc(txt)
                if d is not None:
                    row["luminosity_distance_mpc"] = d
                    updated += 1

        # GraceDB: look for numeric fields in payload/self endpoint.
        if source_id == "gracedb":
            src = idx.get(str(event_id), {})
            payload = src.get("payload") if isinstance(src, dict) else None
            if isinstance(payload, dict):
                if not row.get("source_url"):
                    links = payload.get("links")
                    if isinstance(links, dict) and isinstance(links.get("self"), str):
                        row["source_url"] = links["self"]
                if row.get("luminosity_distance_mpc") is None:
                    d = walk_find_numeric(payload, ("distance_mpc", "luminosity_distance", "distmean", "distance"))
                    if d is not None and d > 0:
                        row["luminosity_distance_mpc"] = d
                        updated += 1
                if row.get("redshift_z") is None:
                    z = walk_find_numeric(payload, ("redshift", "z"))
                    if z is not None and z > 0:
                        row["redshift_z"] = z
                        updated += 1

    SIDE_PATH.write_text(json.dumps(side, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"updated numeric fields: {updated}")
    print(f"sidecar: {SIDE_PATH}")


if __name__ == "__main__":
    main()

