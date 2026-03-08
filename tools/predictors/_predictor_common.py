#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
CONTRACT_PATH = ROOT / "docs" / "method" / "prediction_contract.json"


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def load_contract() -> dict[str, Any]:
    return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))


def build_parser(description: str) -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=description)
    p.add_argument("--input", required=True, help="input observations json path")
    p.add_argument("--output", required=True, help="output predictions json path")
    p.add_argument("--engine-version", required=True, help="engine version id")
    p.add_argument("--formula-version", required=True, help="formula version id")
    p.add_argument(
        "--strict",
        action="store_true",
        help="fail when unknown/forbidden fields are found",
    )
    return p


def load_observations(path: Path) -> list[dict[str, Any]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise SystemExit("input must be a JSON array of observation rows")
    out = [r for r in raw if isinstance(r, dict)]
    if len(out) != len(raw):
        raise SystemExit("input contains non-object rows")
    return out


def validate_observations(rows: list[dict[str, Any]], *, strict: bool) -> None:
    contract = load_contract()
    spec = contract["input_observation"]
    required = set(spec["required"])
    optional = set(spec["optional"])
    forbidden = set(spec["forbidden"])
    known = required | optional

    for i, row in enumerate(rows):
        idx = i + 1
        missing = sorted(k for k in required if k not in row)
        if missing:
            raise SystemExit(f"row {idx}: missing required keys: {', '.join(missing)}")
        hit = sorted(k for k in forbidden if k in row)
        if hit:
            raise SystemExit(f"row {idx}: forbidden keys present: {', '.join(hit)}")
        if strict:
            unknown = sorted(k for k in row.keys() if k not in known)
            if unknown:
                raise SystemExit(f"row {idx}: unknown keys in strict mode: {', '.join(unknown)}")
        if not isinstance(row["domain"], str) or row["domain"] not in {"cosmic", "micro"}:
            raise SystemExit(f"row {idx}: domain must be cosmic|micro")
        for key in ("channel", "observable_id", "dataset_id"):
            if not isinstance(row[key], str) or not row[key].strip():
                raise SystemExit(f"row {idx}: {key} must be non-empty string")
        try:
            float(row["measured_value"])
        except Exception as exc:
            raise SystemExit(f"row {idx}: measured_value must be numeric") from exc


def save_predictions(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
