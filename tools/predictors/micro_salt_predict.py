#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from _predictor_common import build_parser, load_observations, now_utc, save_predictions, validate_observations


SALT_BASELINES: dict[str, float] = {
    "nu_theta23": 0.562,
    "nu_dm2_32": 2.503e-3,
    "nu_theta13": 0.0222,
    "nu_reactor_sin2_2theta13": 0.0851,
    "nu_reactor_dm2_ee": 2.510e-3,
    "nu_acc_theta23": 0.555,
    "nu_acc_dm2_32": 2.49e-3,
    "nu_acc_delta_cp": -1.70,
    "nu_atm_theta23": 0.558,
    "nu_atm_dm2_32": 2.498e-3,
}

COLLIDER_REF_PT = 450.0
COLLIDER_SALT_EXP = 1.12

ROOT = Path(__file__).resolve().parents[2]
MUON_CONST_PATH = ROOT / "tools" / "predictors" / "muon_gm2_constants.json"


def muon_salt_prediction() -> float:
    payload = json.loads(MUON_CONST_PATH.read_text(encoding="utf-8"))
    comp = payload["sm_components"]
    sm_1e11 = (
        float(comp["a_mu_qed"])
        + float(comp["a_mu_ew"])
        + float(comp["a_mu_hvp_lo"])
        + float(comp["a_mu_hvp_nlo"])
        + float(comp["a_mu_hvp_nnlo"])
        + float(comp["a_mu_hlbl"])
    )
    delta_1e11 = float(payload["salt_delta"]["delta_a_mu_salt"])
    return (sm_1e11 + delta_1e11) * 1e-11


def resolve_salt_baseline(row: dict, obs: str, idx: int) -> float:
    if obs == "muon_g_minus_2":
        return muon_salt_prediction()
    if obs in SALT_BASELINES:
        return float(SALT_BASELINES[obs])
    if obs == "collider_high_pt_tail":
        x_value = row.get("x_value")
        if x_value is None:
            raise SystemExit(f"row {idx}: collider_high_pt_tail requires x_value")
        x = float(x_value)
        if x <= 0:
            raise SystemExit(f"row {idx}: collider_high_pt_tail x_value must be > 0")
        return (COLLIDER_REF_PT / x) ** COLLIDER_SALT_EXP
    raise SystemExit(f"row {idx}: unsupported observable_id for SALT baseline: {obs}")


def main() -> None:
    args = build_parser("Micro SALT predictor (submission-candidate)").parse_args()
    rows = load_observations(Path(args.input))
    validate_observations(rows, strict=args.strict)
    out: list[dict] = []
    ts = now_utc()
    for i, row in enumerate(rows, start=1):
        if row["domain"] != "micro":
            raise SystemExit(f"row {i}: micro_salt_predict expects domain=micro")
        obs = str(row["observable_id"])
        pred_value = resolve_salt_baseline(row, obs, i)
        pred_err = row.get("stat_err")
        pred_err_f = None if pred_err is None else float(pred_err)
        out.append(
            {
                "domain": "micro",
                "channel": row["channel"],
                "observable_id": row["observable_id"],
                "dataset_id": row["dataset_id"],
                "x_value": row.get("x_value"),
                "model": "SALT",
                "pred_value": pred_value,
                "pred_err": pred_err_f,
                "alpha": 0.001,
                "beta": 0.0005,
                "gamma": 0.0,
                "engine_version": args.engine_version,
                "formula_version": args.formula_version,
                "computed_at_utc": ts,
            }
        )
    save_predictions(Path(args.output), out)
    print(f"predictions written: {args.output} (rows={len(out)}, model=SALT)")


if __name__ == "__main__":
    main()
