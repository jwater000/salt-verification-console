#!/usr/bin/env python3
"""
Collect public event feeds into a normalized JSON file.

This is a tolerant MVP collector:
- If one source fails, others still succeed.
- Output is always written so downstream scripts can run predictably.
"""

from __future__ import annotations

import json
import os
import tarfile
from io import BytesIO, StringIO
import csv
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
OUT_PATH = ROOT / "data" / "processed" / "live_events.json"

GWOSC_URL = os.getenv("GWOSC_EVENTS_URL", "https://gwosc.org/api/v2/event-versions/")
GRACEDB_URL = os.getenv(
    "GRACEDB_EVENTS_URL",
    "https://gracedb.ligo.org/apiweb/superevents/",
)
GCN_URL = os.getenv("GCN_EVENTS_URL", "")
ZTF_URL = os.getenv("ZTF_EVENTS_URL", "")
HEASARC_URL = os.getenv("HEASARC_EVENTS_URL", "")

if not GCN_URL:
    GCN_URL = "https://gcn.nasa.gov/circulars/archive.json.tar.gz"
if not ZTF_URL:
    ZTF_URL = (
        "https://irsa.ipac.caltech.edu/cgi-bin/ZTF/nph_light_curves"
        "?POS=CIRCLE+298.0025+29.87147+0.0014&BANDNAME=g&FORMAT=CSV"
    )
if not HEASARC_URL:
    HEASARC_URL = (
        "https://heasarc.gsfc.nasa.gov/xamin/query"
        "?table=fermigbrst&ResultMax=200&format=stream"
    )


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def fetch_json(url: str) -> tuple[dict[str, Any] | list[Any] | None, str | None]:
    req = Request(url, headers={"User-Agent": "svc-realtime-collector/0.1"})
    try:
        with urlopen(req, timeout=20) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw), None
    except (URLError, TimeoutError, ValueError) as exc:
        return None, str(exc)


def fetch_raw(url: str) -> tuple[bytes | None, str | None]:
    req = Request(url, headers={"User-Agent": "svc-realtime-collector/0.1"})
    try:
        with urlopen(req, timeout=30) as resp:
            return resp.read(), None
    except (URLError, TimeoutError) as exc:
        return None, str(exc)


def parse_json_tar_gz(raw: bytes, source_id: str) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    with tarfile.open(fileobj=BytesIO(raw), mode="r:gz") as tf:
        for member in tf.getmembers():
            if not member.isfile():
                continue
            if not member.name.endswith(".json"):
                continue
            extracted = tf.extractfile(member)
            if extracted is None:
                continue
            try:
                payload = json.loads(extracted.read().decode("utf-8", errors="ignore"))
            except ValueError:
                continue
            items = find_items(payload)
            if items:
                out.extend(normalize(source_id, items))
            elif isinstance(payload, dict):
                out.extend(normalize(source_id, [payload]))
    return out


def parse_csv_rows(raw: bytes, source_id: str) -> list[dict[str, Any]]:
    text = raw.decode("utf-8", errors="ignore")
    buf = StringIO(text)
    reader = csv.DictReader(buf)
    rows: list[dict[str, Any]] = []
    for i, row in enumerate(reader):
        clean = {k.strip() if k else "": (v.strip() if isinstance(v, str) else v) for k, v in row.items()}
        if not clean:
            continue
        clean.setdefault("id", clean.get("objectid") or clean.get("oid") or f"{source_id}-{i+1}")
        rows.append(clean)
    return normalize(source_id, rows)


def parse_pipe_rows(raw: bytes, source_id: str) -> list[dict[str, Any]]:
    text = raw.decode("utf-8", errors="ignore")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    header: list[str] | None = None
    out_rows: list[dict[str, Any]] = []
    for line in lines:
        if line.lower().startswith("number of rows"):
            break
        if "|" not in line:
            continue
        parts = [p.strip() for p in line.split("|")]
        if header is None:
            header = parts
            continue
        if header and len(parts) == len(header):
            row = dict(zip(header, parts))
            row.setdefault("id", row.get("name") or row.get("trigger_name") or row.get("event_id"))
            out_rows.append(row)
    return normalize(source_id, out_rows)


def find_items(payload: dict[str, Any] | list[Any]) -> list[dict[str, Any]]:
    if isinstance(payload, dict):
        for key in ("results", "events", "superevents", "data", "features"):
            value = payload.get(key)
            if isinstance(value, list):
                return [x for x in value if isinstance(x, dict)]
    if isinstance(payload, list):
        return [x for x in payload if isinstance(x, dict)]
    return []


def pick_event_id(item: dict[str, Any]) -> str | None:
    for key in (
        "event_id",
        "superevent_id",
        "graceid",
        "name",
        "id",
        "circularId",
        "ivorn",
        "eventId",
        "objectId",
        "trigger_name",
        "triggerid",
    ):
        value = item.get(key)
        if value:
            return str(value)
    properties = item.get("properties")
    if isinstance(properties, dict):
        for key in ("event_id", "id", "name", "objectId"):
            value = properties.get(key)
            if value:
                return str(value)
    return None


def pick_event_time(item: dict[str, Any]) -> str | None:
    # Keep original provider time string if possible.
    for key in (
        "event_time",
        "created",
        "createdOn",
        "publishedOn",
        "submittedOn",
        "t_0",
        "date",
        "time",
        "gpstime",
        "jd",
        "mjd",
    ):
        value = item.get(key)
        if value is None:
            continue
        text = str(value)
        if text.endswith("Z") or "T" in text:
            return text
    properties = item.get("properties")
    if isinstance(properties, dict):
        for key in ("event_time", "created", "published", "obs_time", "mjd", "jd"):
            value = properties.get(key)
            if value is None:
                continue
            text = str(value)
            if text.endswith("Z") or "T" in text:
                return text
    return None


def normalize(source_id: str, items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for item in items:
        event_id = pick_event_id(item)
        if not event_id:
            continue
        out.append(
            {
                "source_id": source_id,
                "external_event_id": event_id,
                "event_time_utc": pick_event_time(item),
                "quality_flag": "unknown",
                "payload": item,
            }
        )
    return out


def source_specs() -> list[dict[str, str]]:
    return [
        {"source_id": "gwosc", "url": GWOSC_URL},
        {"source_id": "gracedb", "url": GRACEDB_URL},
        {"source_id": "gcn", "url": GCN_URL},
        {"source_id": "ztf", "url": ZTF_URL},
        {"source_id": "heasarc", "url": HEASARC_URL},
    ]


def main() -> None:
    collected: list[dict[str, Any]] = []
    errors: list[dict[str, str]] = []
    sources = source_specs()
    for spec in sources:
        source_id = spec["source_id"]
        url = spec["url"]
        if source_id in {"gwosc", "gracedb"}:
            payload, err = fetch_json(url)
            if payload is not None:
                collected.extend(normalize(source_id, find_items(payload)))
            elif err:
                errors.append({"source_id": source_id, "error": err})
            continue

        raw, err = fetch_raw(url)
        if raw is None:
            errors.append({"source_id": source_id, "error": err or "fetch failed"})
            continue

        try:
            if source_id == "gcn":
                collected.extend(parse_json_tar_gz(raw, source_id))
            elif source_id == "ztf":
                collected.extend(parse_csv_rows(raw, source_id))
            elif source_id == "heasarc":
                collected.extend(parse_pipe_rows(raw, source_id))
            else:
                errors.append({"source_id": source_id, "error": "unsupported source parser"})
        except Exception as exc:  # noqa: BLE001
            errors.append({"source_id": source_id, "error": f"parse failed: {exc}"})

    payload = {
        "generated_at_utc": now_utc(),
        "sources": sources,
        "event_count": len(collected),
        "events": collected,
        "errors": errors,
    }
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"events collected: {len(collected)}")
    if errors:
        print(f"sources with errors: {len(errors)}")
    print(f"written: {OUT_PATH}")


if __name__ == "__main__":
    main()
