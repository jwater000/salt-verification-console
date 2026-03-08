#!/usr/bin/env python3
"""
Compute micro_scores and micro_fit_runs from ingested observations/predictions.
"""

from __future__ import annotations

import json
import hashlib
import math
import os
from collections import defaultdict
from datetime import UTC, datetime
from pathlib import Path

from _micro_common import connect_db, ensure_micro_schema


ROOT = Path(__file__).resolve().parents[2]
OUT_PATH = ROOT / "data" / "processed" / "micro_snapshot.json"
AUDIT_PATH = ROOT / "data" / "processed" / "audit_manifest.json"
PREDICTION_LOCK_PATH = ROOT / "data" / "processed" / "micro_prediction_lock.json"

DECISION_RULE_VERSION = "micro-decision-v3"
TIE_EPS = 0.1
ALPHA = 0.05
FDR_Q = 0.10
EFFECT_SIZE_MIN = 0.05
MIN_N_OBS = 3
WIN_RATE_MIN = 0.60
EXPLORE_FDR_Q = 0.25
EXPLORE_EFFECT_SIZE_MIN = 0.02
EXPLORE_WIN_RATE_MIN = 0.55
NEUTRINO_FAMILY_Q = 0.10
QUALITY_MODE = os.environ.get("MICRO_QUALITY_MODE", "real").strip().lower() or "real"
ALLOW_LOCK_UPDATE = os.environ.get("MICRO_PREDICTION_LOCK_ALLOW_UPDATE", "").strip().lower() in {"1", "true", "yes"}


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def normal_cdf(x: float) -> float:
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def bh_adjust(pvals: list[float]) -> list[float]:
    if not pvals:
        return []
    n = len(pvals)
    indexed = sorted(enumerate(pvals), key=lambda t: t[1])
    out = [1.0] * n
    running = 1.0
    for rank in range(n, 0, -1):
        idx, p = indexed[rank - 1]
        q = min(running, (p * n) / rank)
        running = q
        out[idx] = q
    return out


def aic(rss: float, n: int, k: int) -> float:
    if n <= 0:
        return float("nan")
    safe_rss = max(rss, 1e-18)
    return n * math.log(safe_rss / n) + 2 * k


def bic(rss: float, n: int, k: int) -> float:
    if n <= 0:
        return float("nan")
    safe_rss = max(rss, 1e-18)
    return n * math.log(safe_rss / n) + k * math.log(n)


def one_sided_binomial_p(win: int, loss: int) -> float:
    m = win + loss
    if m <= 0:
        return 1.0
    tail = 0
    for k in range(win, m + 1):
        tail += math.comb(m, k)
    return tail / float(2**m)


def build_prediction_lock(rows: list) -> tuple[str, int]:
    canonical: list[str] = []
    for r in rows:
        x_raw = r["x_value"]
        x = "null" if x_raw is None else f"{float(x_raw):.12g}"
        line = "|".join(
            [
                str(r["channel"]),
                str(r["observable_id"]),
                str(r["dataset_id"]),
                x,
                f"{float(r['sm_pred']):.16g}",
                f"{float(r['salt_pred']):.16g}",
                str(r["formula_version"]),
            ]
        )
        canonical.append(line)
    canonical.sort()
    payload = "\n".join(canonical).encode("utf-8")
    return hashlib.sha256(payload).hexdigest(), len(canonical)


def main() -> None:
    if QUALITY_MODE not in {"real", "all"}:
        raise SystemExit("MICRO_QUALITY_MODE must be 'real' or 'all'")

    where_clause = "WHERE o.quality_flag = 'real'" if QUALITY_MODE == "real" else ""
    observations_where_clause = "WHERE quality_flag = 'real'" if QUALITY_MODE == "real" else ""

    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        rows = conn.execute(
            f"""
            SELECT
              o.channel, o.observable_id, o.dataset_id, o.x_value,
              o.measured_value, o.stat_err, o.sys_err,
              sp.sm_pred, sa.salt_pred, sa.formula_version
            FROM micro_observations o
            JOIN micro_sm_predictions sp
              ON sp.observable_id = o.observable_id
             AND sp.dataset_id = o.dataset_id
             AND (
               (sp.x_value IS NULL AND o.x_value IS NULL) OR
               (sp.x_value = o.x_value)
             )
            JOIN micro_salt_predictions sa
              ON sa.observable_id = o.observable_id
             AND sa.dataset_id = o.dataset_id
             AND (
               (sa.x_value IS NULL AND o.x_value IS NULL) OR
               (sa.x_value = o.x_value)
             )
            {where_clause}
            ORDER BY o.channel, o.observable_id, o.dataset_id, COALESCE(o.x_value, -1)
            """
        ).fetchall()

        prediction_lock_sha256, prediction_pair_count = build_prediction_lock(rows)
        previous_lock: dict | None = None
        if PREDICTION_LOCK_PATH.exists():
            try:
                previous_lock = json.loads(PREDICTION_LOCK_PATH.read_text(encoding="utf-8"))
            except Exception:
                previous_lock = None
        if previous_lock:
            prev_hash = str(previous_lock.get("prediction_lock_sha256", "")).strip()
            if prev_hash and prev_hash != prediction_lock_sha256 and not ALLOW_LOCK_UPDATE:
                raise SystemExit(
                    "micro prediction lock mismatch: "
                    f"prev={prev_hash} current={prediction_lock_sha256}. "
                    "Set MICRO_PREDICTION_LOCK_ALLOW_UPDATE=1 to accept update."
                )
        lock_payload = {
            "generated_at_utc": now_utc(),
            "quality_mode": QUALITY_MODE,
            "prediction_pair_count": prediction_pair_count,
            "prediction_lock_sha256": prediction_lock_sha256,
        }
        PREDICTION_LOCK_PATH.write_text(json.dumps(lock_payload, ensure_ascii=False, indent=2), encoding="utf-8")

        conn.execute("DELETE FROM micro_scores")
        conn.execute("DELETE FROM micro_fit_runs")

        pvals: list[float] = []
        score_rows: list[dict] = []
        for r in rows:
            stat_err = r["stat_err"] if r["stat_err"] is not None else 0.0
            sys_err = r["sys_err"] if r["sys_err"] is not None else 0.0
            total_err = math.sqrt(stat_err * stat_err + sys_err * sys_err)
            if total_err <= 0:
                total_err = 1e-12

            res_sm = float(r["measured_value"]) - float(r["sm_pred"])
            res_salt = float(r["measured_value"]) - float(r["salt_pred"])
            pull_sm = res_sm / total_err
            pull_salt = res_salt / total_err

            abs_sm = abs(pull_sm)
            abs_salt = abs(pull_salt)
            tie = abs(abs_sm - abs_salt) <= TIE_EPS
            if tie:
                win = "TIE"
            elif abs_salt < abs_sm:
                win = "SALT"
            else:
                win = "SM"

            # Improvement p-value from one-sided z-test over absolute pull gap.
            z_improve = abs_sm - abs_salt
            p_improve = 1.0 - normal_cdf(z_improve)

            pvals.append(p_improve)
            score_rows.append(
                {
                    "channel": r["channel"],
                    "observable_id": r["observable_id"],
                    "dataset_id": r["dataset_id"],
                    "x_value": r["x_value"],
                    "total_err": total_err,
                    "res_sm": res_sm,
                    "res_salt": res_salt,
                    "pull_sm": pull_sm,
                    "pull_salt": pull_salt,
                    "winner": win,
                    "winner_tie": 1 if tie else 0,
                    "p_improve": p_improve,
                }
            )

        qvals = bh_adjust(pvals)
        ts = now_utc()
        for idx, row in enumerate(score_rows):
            q = qvals[idx]
            conn.execute(
                """
                INSERT INTO micro_scores (
                  channel, observable_id, dataset_id, x_value, total_err,
                  res_sm, res_salt, pull_sm, pull_salt,
                  winner, winner_tie, p_improve, q_improve,
                  decision_rule_version, computed_at_utc
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    row["channel"],
                    row["observable_id"],
                    row["dataset_id"],
                    row["x_value"],
                    row["total_err"],
                    row["res_sm"],
                    row["res_salt"],
                    row["pull_sm"],
                    row["pull_salt"],
                    row["winner"],
                    row["winner_tie"],
                    row["p_improve"],
                    q,
                    DECISION_RULE_VERSION,
                    ts,
                ),
            )

        grouped: dict[str, list[dict]] = defaultdict(list)
        for idx, row in enumerate(score_rows):
            row = dict(row)
            row["q_improve"] = qvals[idx]
            grouped[row["channel"]].append(row)

        channel_stats: dict[str, dict] = {}
        channel_pvals: list[float] = []
        channel_order: list[str] = []
        for channel, items in grouped.items():
            n = len(items)
            rss_sm = sum(x["res_sm"] ** 2 for x in items)
            rss_salt = sum(x["res_salt"] ** 2 for x in items)
            chi2_sm = sum(x["pull_sm"] ** 2 for x in items)
            chi2_salt = sum(x["pull_salt"] ** 2 for x in items)
            rmse_sm = math.sqrt(rss_sm / n) if n else float("nan")
            rmse_salt = math.sqrt(rss_salt / n) if n else float("nan")
            delta_rmse = 0.0 if rmse_sm == 0 else (rmse_sm - rmse_salt) / rmse_sm
            win = sum(1 for x in items if (abs(x["pull_sm"]) - abs(x["pull_salt"])) > 1e-12)
            loss = sum(1 for x in items if (abs(x["pull_sm"]) - abs(x["pull_salt"])) < -1e-12)
            decisive = win + loss
            win_rate = 0.0 if decisive == 0 else win / decisive
            channel_p = one_sided_binomial_p(win, loss)
            channel_order.append(channel)
            channel_pvals.append(channel_p)
            channel_stats[channel] = {
                "n": n,
                "rss_sm": rss_sm,
                "rss_salt": rss_salt,
                "chi2_sm": chi2_sm,
                "chi2_salt": chi2_salt,
                "rmse_sm": rmse_sm,
                "rmse_salt": rmse_salt,
                "delta_rmse": delta_rmse,
                "win_rate": win_rate,
                "channel_p": channel_p,
            }

        channel_qvals = bh_adjust(channel_pvals)
        channel_q_map = {channel_order[i]: channel_qvals[i] for i in range(len(channel_order))}
        neutrino_channels = [c for c in channel_order if c.startswith("neutrino_")]
        neutrino_pvals = [channel_stats[c]["channel_p"] for c in neutrino_channels]
        neutrino_qvals = bh_adjust(neutrino_pvals)
        neutrino_q_map = {neutrino_channels[i]: neutrino_qvals[i] for i in range(len(neutrino_channels))}

        for channel in channel_order:
            stat = channel_stats[channel]
            n = stat["n"]
            rmse_sm = stat["rmse_sm"]
            rmse_salt = stat["rmse_salt"]
            delta_rmse = stat["delta_rmse"]
            win_rate = stat["win_rate"]
            channel_fdr_q = channel_q_map[channel]
            neutrino_family_q = neutrino_q_map.get(channel)

            salt_better = rmse_salt < rmse_sm
            stat_pass = channel_fdr_q <= FDR_Q
            effect_pass = delta_rmse >= EFFECT_SIZE_MIN
            consistency_pass = win_rate >= WIN_RATE_MIN

            verdict = "tie"
            verdict_reason = "insufficient_statistical_evidence"
            if n < MIN_N_OBS:
                verdict = "insufficient_data"
                verdict_reason = f"n_obs<{MIN_N_OBS}"
            elif not stat_pass:
                verdict = "tie"
                verdict_reason = f"fdr_q>{FDR_Q:.2f}"
            elif not effect_pass:
                verdict = "tie"
                verdict_reason = f"delta_rmse<{EFFECT_SIZE_MIN:.2f}"
            elif not consistency_pass:
                verdict = "tie"
                verdict_reason = f"win_rate<{WIN_RATE_MIN:.2f}"
            elif salt_better:
                verdict = "salt_better"
                verdict_reason = "fdr_pass+effect_pass+consistency_pass+rmse_salt<rmse_sm"
            else:
                verdict = "sm_better"
                verdict_reason = "fdr_pass+effect_pass+consistency_pass+rmse_sm<=rmse_salt"

            exploratory_stat_pass = channel_fdr_q <= EXPLORE_FDR_Q
            if channel.startswith("neutrino_") and neutrino_family_q is not None:
                exploratory_stat_pass = exploratory_stat_pass or (neutrino_family_q <= NEUTRINO_FAMILY_Q)
            exploratory_effect_pass = delta_rmse >= EXPLORE_EFFECT_SIZE_MIN
            exploratory_consistency_pass = win_rate >= EXPLORE_WIN_RATE_MIN

            exploratory_verdict = "tie"
            exploratory_reason = "insufficient_statistical_evidence"
            if n < MIN_N_OBS:
                exploratory_verdict = "insufficient_data"
                exploratory_reason = f"n_obs<{MIN_N_OBS}"
            elif not exploratory_stat_pass:
                exploratory_verdict = "tie"
                exploratory_reason = (
                    f"fdr_q>{EXPLORE_FDR_Q:.2f}"
                    if neutrino_family_q is None
                    else f"fdr_q>{EXPLORE_FDR_Q:.2f} and family_q>{NEUTRINO_FAMILY_Q:.2f}"
                )
            elif not exploratory_effect_pass:
                exploratory_verdict = "tie"
                exploratory_reason = f"delta_rmse<{EXPLORE_EFFECT_SIZE_MIN:.2f}"
            elif not exploratory_consistency_pass:
                exploratory_verdict = "tie"
                exploratory_reason = f"win_rate<{EXPLORE_WIN_RATE_MIN:.2f}"
            elif salt_better:
                exploratory_verdict = "salt_better"
                exploratory_reason = "explore_pass+rmse_salt<rmse_sm"
            else:
                exploratory_verdict = "sm_better"
                exploratory_reason = "explore_pass+rmse_sm<=rmse_salt"

            params = {
                "alpha": ALPHA,
                "fdr_q_threshold": FDR_Q,
                "effect_size_min": EFFECT_SIZE_MIN,
                "tie_eps": TIE_EPS,
                "min_n_obs": MIN_N_OBS,
                "win_rate_min": WIN_RATE_MIN,
                "explore_fdr_q_threshold": EXPLORE_FDR_Q,
                "explore_effect_size_min": EXPLORE_EFFECT_SIZE_MIN,
                "explore_win_rate_min": EXPLORE_WIN_RATE_MIN,
                "neutrino_family_q_threshold": NEUTRINO_FAMILY_Q,
                "stat_test": "one_sided_binomial_on_winner_direction",
                "quality_mode": QUALITY_MODE,
            }
            conn.execute(
                """
                INSERT INTO micro_fit_runs (
                  channel, fit_scope, params_json, n_obs,
                  chi2_sm, chi2_salt, rmse_sm, rmse_salt,
                  aic_sm, aic_salt, bic_sm, bic_salt,
                  fdr_q, verdict, verdict_reason, exploratory_verdict, exploratory_reason, neutrino_family_q, computed_at_utc
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    channel,
                    "channel",
                    json.dumps(params, ensure_ascii=False),
                    n,
                    stat["chi2_sm"],
                    stat["chi2_salt"],
                    rmse_sm,
                    rmse_salt,
                    aic(stat["rss_sm"], n, 1),
                    aic(stat["rss_salt"], n, 3),
                    bic(stat["rss_sm"], n, 1),
                    bic(stat["rss_salt"], n, 3),
                    channel_fdr_q,
                    verdict,
                    verdict_reason,
                    exploratory_verdict,
                    exploratory_reason,
                    neutrino_family_q,
                    ts,
                ),
            )

        conn.commit()

        micro_sources = [dict(r) for r in conn.execute("SELECT * FROM micro_sources ORDER BY source_id").fetchall()]
        micro_observations = [
            dict(r)
            for r in conn.execute(
                f"""
                SELECT channel, observable_id, dataset_id, x_value, measured_value,
                       dataset_group, stat_err, sys_err, unit, quality_flag, observed_at_utc, source_url
                FROM micro_observations
                {observations_where_clause}
                ORDER BY channel, observable_id, dataset_id, COALESCE(x_value, -1)
                """
            ).fetchall()
        ]
        micro_scores = [
            dict(r)
            for r in conn.execute(
                """
                SELECT channel, observable_id, dataset_id, x_value, total_err,
                       res_sm, res_salt, pull_sm, pull_salt, winner, winner_tie,
                       p_improve, q_improve, decision_rule_version, computed_at_utc
                FROM micro_scores
                ORDER BY channel, observable_id, dataset_id, COALESCE(x_value, -1)
                """
            ).fetchall()
        ]
        micro_fit_runs = [
            dict(r)
            for r in conn.execute(
                """
                SELECT run_id, channel, fit_scope, params_json, n_obs,
                       chi2_sm, chi2_salt, rmse_sm, rmse_salt,
                       aic_sm, aic_salt, bic_sm, bic_salt, fdr_q, verdict, verdict_reason,
                       exploratory_verdict, exploratory_reason, neutrino_family_q, computed_at_utc
                FROM micro_fit_runs
                ORDER BY channel, run_id
                """
            ).fetchall()
        ]

        OUT_PATH.write_text(
            json.dumps(
                {
                    "generated_at_utc": ts,
                    "decision_rule_version": DECISION_RULE_VERSION,
                    "prediction_lock_sha256": prediction_lock_sha256,
                    "sources": micro_sources,
                    "observations": micro_observations,
                    "scores": micro_scores,
                    "fit_runs": micro_fit_runs,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )

        formula_versions = sorted(
            {
                str(r["formula_version"])
                for r in conn.execute("SELECT DISTINCT formula_version FROM micro_salt_predictions").fetchall()
                if r["formula_version"]
            }
        )
        dataset_versions = sorted({str(x["version_tag"]) for x in micro_sources if x.get("version_tag")})
        audit_payload = {
            "generated_at_utc": ts,
            "formula_version": formula_versions,
            "dataset_version": dataset_versions,
            "decision_rule_version": DECISION_RULE_VERSION,
            "prediction_lock_sha256": prediction_lock_sha256,
            "rerun_commands": [
                ".venv/bin/python tools/micro/run_micro_cycle.py",
                ".venv/bin/python tools/realtime/run_realtime_cycle.py",
            ],
        }
        AUDIT_PATH.write_text(json.dumps(audit_payload, ensure_ascii=False, indent=2), encoding="utf-8")

    finally:
        conn.close()

    print(f"quality_mode: {QUALITY_MODE}")
    print(f"micro stats computed: {OUT_PATH}")
    print(f"audit manifest refreshed: {AUDIT_PATH}")


if __name__ == "__main__":
    main()
