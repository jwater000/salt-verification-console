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
    args = build_parser("Cosmic SALT predictor").parse_args()
    rows = load_observations(Path(args.input))
    validate_observations(rows, strict=args.strict)
    out: list[dict] = []
    ts = now_utc()
    for i, row in enumerate(rows, start=1):
        if row["domain"] != "cosmic":
            raise SystemExit(f"row {i}: cosmic_salt_predict expects domain=cosmic")
        obs = str(row["observable_id"])
        ds = str(row["dataset_id"])
        u = stable_unit(f"{obs}|{ds}")
        z = f(row.get("redshift_z"))
        d_mpc = f(row.get("luminosity_distance_mpc"))
        if z is not None and d_mpc is not None and d_mpc > 0:
            salt_curve = (
                0.77
                + 0.10 * z
                + 0.02 * (d_mpc / (d_mpc + 1200.0))
                - 0.004 * z * z
            )
        else:
            # Legacy fallback when sidecar features are missing.
            salt_curve = 0.79 + 0.20 * (u ** 1.08) - 0.008 * (u * (1.0 - u))
        out.append(
            {
                "domain": "cosmic",
                "channel": row["channel"],
                "observable_id": obs,
                "dataset_id": ds,
                "x_value": row.get("x_value"),
                "model": "SALT",
                "pred_value": round(salt_curve, 6),
                "pred_err": None,
                "alpha": None,
                "beta": None,
                "gamma": None,
                "engine_version": args.engine_version,
                "formula_version": args.formula_version,
                "computed_at_utc": ts,
            }
        )
    save_predictions(Path(args.output), out)
    print(f"predictions written: {args.output} (rows={len(out)}, model=SALT)")


if __name__ == "__main__":
    main()
