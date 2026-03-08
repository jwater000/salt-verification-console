#!/usr/bin/env python3
"""
Select cosmic evaluation rows from existing real result files for frozen samples.

Policy:
- Do not synthesize `actual_value`/`standard_fit`/`salt_fit`.
- Use only rows already present in processed result files.
"""

from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
P1_PATH = ROOT / "data" / "processed" / "results_p1-time-delay-redshift.json"
P2_PATH = ROOT / "data" / "processed" / "results_p2-hf-tail.json"
REPORT_DIR = ROOT / "results" / "reports"

P1_TARGET = 25
P2_TARGET = 25


def load_rows(path: Path, prediction_id: str) -> list[dict]:
    if not path.exists():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        return []
    rows = [r for r in raw if isinstance(r, dict)]
    rows = [r for r in rows if str(r.get("prediction_id", "")).strip() == prediction_id]
    rows = [r for r in rows if r.get("actual_value") is not None]
    rows = [r for r in rows if str(r.get("event_id", "")).strip()]
    return rows


def dedupe_and_select(rows: list[dict], target: int) -> list[dict]:
    by_event: dict[str, dict] = {}
    for r in rows:
        event_id = str(r.get("event_id", "")).strip()
        current = by_event.get(event_id)
        if current is None:
            by_event[event_id] = r
            continue
        prev_t = str(current.get("event_time_utc") or "")
        next_t = str(r.get("event_time_utc") or "")
        if next_t > prev_t:
            by_event[event_id] = r

    out = list(by_event.values())
    out.sort(key=lambda x: (str(x.get("event_time_utc") or ""), str(x.get("event_id") or "")), reverse=True)
    return out[:target]


def write_report(p1_rows: list[dict], p2_rows: list[dict]) -> Path:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    path = REPORT_DIR / f"cosmic_sample_expansion_report_{datetime.now(UTC).strftime('%Y%m%d')}.md"
    lines = [
        "# Cosmic Frozen Sample Expansion Report",
        "",
        f"- generated_at_utc: {datetime.now(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')}",
        f"- p1 rows: {len(p1_rows)}",
        f"- p2 rows: {len(p2_rows)}",
        f"- total rows: {len(p1_rows) + len(p2_rows)}",
        "",
        "## Data Sources",
        "- GraceDB API: https://gracedb.ligo.org/apiweb/superevents/",
        "- GCN Circular Archive: https://gcn.nasa.gov/circulars/archive.json.tar.gz",
        "- HEASARC API reference: https://heasarc.gsfc.nasa.gov/docs/archive/apis.html",
        "- Internal input files: data/processed/results_p1-time-delay-redshift.json, data/processed/results_p2-hf-tail.json",
        "",
        "## Gate Check",
        f"- frozen cosmic total >= 50: {'PASS' if (len(p1_rows) + len(p2_rows)) >= 50 else 'FAIL'}",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def main() -> None:
    p1_rows = dedupe_and_select(load_rows(P1_PATH, "p1-time-delay-redshift"), P1_TARGET)
    p2_rows = dedupe_and_select(load_rows(P2_PATH, "p2-hf-tail"), P2_TARGET)

    if len(p1_rows) < P1_TARGET or len(p2_rows) < P2_TARGET:
        raise SystemExit(
            "insufficient real cosmic rows for target; "
            f"p1={len(p1_rows)}/{P1_TARGET}, p2={len(p2_rows)}/{P2_TARGET}"
        )

    P1_PATH.write_text(json.dumps(p1_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    P2_PATH.write_text(json.dumps(p2_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    report = write_report(p1_rows, p2_rows)

    print(f"wrote {len(p1_rows)} rows: {P1_PATH}")
    print(f"wrote {len(p2_rows)} rows: {P2_PATH}")
    print(f"report: {report}")


if __name__ == "__main__":
    main()
