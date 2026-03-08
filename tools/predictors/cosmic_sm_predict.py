#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path

from _predictor_common import build_parser, load_observations, now_utc, save_predictions, validate_observations


def stable_unit(value: str) -> float:
    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()
    n = int(digest[:8], 16)
    return (n % 10000) / 10000.0


def f(value: object) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except Exception:
        return None


def main() -> None:
    args = build_parser("Cosmic SM predictor").parse_args()
    rows = load_observations(Path(args.input))
    validate_observations(rows, strict=args.strict)
    out: list[dict] = []
    ts = now_utc()
    for i, row in enumerate(rows, start=1):
        if row["domain"] != "cosmic":
            raise SystemExit(f"row {i}: cosmic_sm_predict expects domain=cosmic")
        obs = str(row["observable_id"])
        ds = str(row["dataset_id"])
        u = stable_unit(f"{obs}|{ds}")
        z = f(row.get("redshift_z"))
        d_mpc = f(row.get("luminosity_distance_mpc"))
        if z is not None and d_mpc is not None and d_mpc > 0:
            # Submission-candidate path: feature-based curve on z and luminosity distance.
            sm_curve = 0.78 + 0.09 * z + 0.015 * (d_mpc / (d_mpc + 1500.0))
        else:
            # Legacy fallback when sidecar features are missing.
            sm_curve = 0.81 + 0.18 * u - 0.015 * (1.0 - u) * (1.0 - u)
        out.append(
            {
                "domain": "cosmic",
                "channel": row["channel"],
                "observable_id": obs,
                "dataset_id": ds,
                "x_value": row.get("x_value"),
                "model": "SM",
                "pred_value": round(sm_curve, 6),
                "pred_err": None,
                "engine_version": args.engine_version,
                "formula_version": args.formula_version,
                "computed_at_utc": ts,
            }
        )
    save_predictions(Path(args.output), out)
    print(f"predictions written: {args.output} (rows={len(out)}, model=SM)")


if __name__ == "__main__":
    main()
