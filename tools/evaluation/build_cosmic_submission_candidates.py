#!/usr/bin/env python3
"""
Build alternative cosmic submission candidate set from live_events (GCN-first).

Outputs:
- results/reports/cosmic_submission_candidates.csv
- results/reports/cosmic_submission_candidates_top50.csv
"""

from __future__ import annotations

import csv
import json
import math
import re
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LIVE_EVENTS_PATH = ROOT / "data" / "processed" / "live_events.json"
OUT_ALL = ROOT / "results" / "reports" / "cosmic_submission_candidates.csv"
OUT_TOP50 = ROOT / "results" / "reports" / "cosmic_submission_candidates_top50.csv"

# Fixed cosmology for reproducible conversion from z to distance/lookback.
H0 = 67.66  # km/s/Mpc
OMEGA_M = 0.3111
OMEGA_L = 1.0 - OMEGA_M
C_KM_S = 299792.458
SEC_PER_GYR = 365.25 * 24 * 3600 * 1e9
MPC_KM = 3.085677581491367e19


RE_Z = [
    re.compile(r"\bredshift\b[^0-9]{0,20}(?:z\s*[=:~]\s*)?([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
    re.compile(r"\bz\s*\(?(?:phot|spec)?\)?\s*[=:~]\s*([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE),
]


def parse_event_time(text: str | None) -> datetime:
    s = (text or "").strip()
    for fmt in ("%Y-%m-%d %H:%M:%S UTC", "%Y-%m-%dT%H:%M:%SZ"):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            pass
    return datetime(1970, 1, 1)


def resolve_event_time(event_row: dict, payload: dict) -> str | None:
    t1 = event_row.get("event_time_utc")
    if isinstance(t1, str) and t1.strip():
        return t1.strip()
    t2 = payload.get("createdOn")
    if isinstance(t2, str) and t2.strip():
        return t2.strip()
    return None


def extract_redshift(subject: str, body: str) -> float | None:
    text = f"{subject}\n{body}"
    for rx in RE_Z:
        m = rx.search(text)
        if not m:
            continue
        try:
            z = float(m.group(1))
        except Exception:
            continue
        if 0.0001 <= z <= 10.0:
            return z
    return None


def integrate_simpson(fn, z: float, n: int = 1200) -> float:
    if z <= 0:
        return 0.0
    if n % 2 == 1:
        n += 1
    h = z / n
    s = fn(0.0) + fn(z)
    for i in range(1, n):
        x = i * h
        s += (4.0 if i % 2 == 1 else 2.0) * fn(x)
    return s * h / 3.0


def e_of_z(z: float) -> float:
    return math.sqrt(OMEGA_M * (1.0 + z) ** 3 + OMEGA_L)


def luminosity_distance_mpc(z: float) -> float:
    integ = integrate_simpson(lambda zp: 1.0 / e_of_z(zp), z)
    d_c = (C_KM_S / H0) * integ
    return (1.0 + z) * d_c


def lookback_time_gyr(z: float) -> float:
    integ = integrate_simpson(lambda zp: 1.0 / ((1.0 + zp) * e_of_z(zp)), z)
    h0_s = H0 / MPC_KM
    t_h = 1.0 / h0_s
    return (t_h * integ) / SEC_PER_GYR


def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    cols = [
        "event_id",
        "source_id",
        "event_time_utc",
        "subject",
        "redshift_z",
        "luminosity_distance_mpc",
        "lookback_time_gyr",
        "source_url",
        "extraction_method",
        "notes",
    ]
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k) for k in cols})


def main() -> None:
    payload = json.loads(LIVE_EVENTS_PATH.read_text(encoding="utf-8"))
    events = payload.get("events", []) if isinstance(payload, dict) else []

    candidates: list[dict] = []
    for e in events:
        if not isinstance(e, dict):
            continue
        if e.get("source_id") != "gcn":
            continue
        p = e.get("payload")
        if not isinstance(p, dict):
            continue
        event_id = str(e.get("external_event_id", "")).strip()
        if not event_id:
            continue
        subject = str(p.get("subject", "")).strip()
        body = str(p.get("body", "")).strip()
        z = extract_redshift(subject, body)
        if z is None:
            continue
        dl = luminosity_distance_mpc(z)
        lb = lookback_time_gyr(z)
        candidates.append(
            {
                "event_id": event_id,
                "source_id": "gcn",
                "event_time_utc": resolve_event_time(e, p),
                "subject": subject,
                "redshift_z": round(z, 8),
                "luminosity_distance_mpc": round(dl, 6),
                "lookback_time_gyr": round(lb, 9),
                "source_url": f"https://gcn.nasa.gov/circulars/{event_id}",
                "extraction_method": "regex(redshift) + Planck18(flat LCDM) conversion",
                "notes": "auto-generated candidate; verify astrophysical context before submission",
            }
        )

    # Deduplicate by event_id, keep latest event_time if duplicated.
    by_id: dict[str, dict] = {}
    for r in candidates:
        key = str(r["event_id"])
        prev = by_id.get(key)
        if prev is None or parse_event_time(str(r.get("event_time_utc"))) > parse_event_time(str(prev.get("event_time_utc"))):
            by_id[key] = r
    rows = list(by_id.values())
    rows.sort(key=lambda r: parse_event_time(str(r.get("event_time_utc"))), reverse=True)

    write_csv(OUT_ALL, rows)
    write_csv(OUT_TOP50, rows[:50])

    print(f"candidates_total: {len(rows)}")
    print(f"all_csv: {OUT_ALL}")
    print(f"top50_csv: {OUT_TOP50}")


if __name__ == "__main__":
    main()
