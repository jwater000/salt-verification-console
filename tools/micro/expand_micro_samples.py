#!/usr/bin/env python3
"""
Expand micro channel samples from curated real-data snapshots (no synthetic rows).

Data policy:
- Use published values from official sources (PDG/Fermilab/NuFIT/HEPData).
- Do not generate pseudo-random or formula-jittered measurements.
"""

from __future__ import annotations

import json
import os
import sqlite3
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path

from _micro_common import (
    ObservationRecord,
    connect_db,
    ensure_micro_schema,
    upsert_observation,
    upsert_source,
)


ROOT = Path(__file__).resolve().parents[2]
REAL_DIR = ROOT / "data" / "raw" / "micro" / "real"
DB_PATH = ROOT / "data" / "processed" / "svc_realtime.db"
REPORT_DIR = ROOT / "results" / "reports"


def now_utc() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def run(cmd: list[str], env: dict[str, str]) -> None:
    proc = subprocess.run(cmd, cwd=str(ROOT), env=env, check=False)
    if proc.returncode != 0:
        raise SystemExit(proc.returncode)


def reset_previous_fixture_rows() -> None:
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("DELETE FROM micro_observations WHERE dataset_id LIKE 'pdg-amu-live-%'")
        conn.execute("DELETE FROM micro_observations WHERE dataset_id LIKE 'nufit-%'")
        conn.execute("DELETE FROM micro_observations WHERE dataset_id LIKE 'nu-reactor-%'")
        conn.execute("DELETE FROM micro_observations WHERE dataset_id LIKE 'nu-accelerator-%'")
        conn.execute("DELETE FROM micro_observations WHERE dataset_id LIKE 'nu-atmospheric-%'")
        conn.execute("DELETE FROM micro_observations WHERE dataset_id = 'hepdata-live-fixture'")
        conn.execute("DELETE FROM micro_sm_predictions WHERE dataset_id LIKE 'pdg-amu-live-%'")
        conn.execute("DELETE FROM micro_sm_predictions WHERE dataset_id LIKE 'nufit-%'")
        conn.execute("DELETE FROM micro_sm_predictions WHERE dataset_id LIKE 'nu-reactor-%'")
        conn.execute("DELETE FROM micro_sm_predictions WHERE dataset_id LIKE 'nu-accelerator-%'")
        conn.execute("DELETE FROM micro_sm_predictions WHERE dataset_id LIKE 'nu-atmospheric-%'")
        conn.execute("DELETE FROM micro_sm_predictions WHERE dataset_id = 'hepdata-live-fixture'")
        conn.execute("DELETE FROM micro_salt_predictions WHERE dataset_id LIKE 'pdg-amu-live-%'")
        conn.execute("DELETE FROM micro_salt_predictions WHERE dataset_id LIKE 'nufit-%'")
        conn.execute("DELETE FROM micro_salt_predictions WHERE dataset_id LIKE 'nu-reactor-%'")
        conn.execute("DELETE FROM micro_salt_predictions WHERE dataset_id LIKE 'nu-accelerator-%'")
        conn.execute("DELETE FROM micro_salt_predictions WHERE dataset_id LIKE 'nu-atmospheric-%'")
        conn.execute("DELETE FROM micro_salt_predictions WHERE dataset_id = 'hepdata-live-fixture'")
        conn.execute("DELETE FROM micro_sources WHERE source_id LIKE 'pdg-amu-live-%'")
        conn.execute("DELETE FROM micro_sources WHERE source_id = 'pdg-amu-2024'")
        conn.execute("DELETE FROM micro_sources WHERE source_id LIKE 'nufit-%'")
        conn.execute("DELETE FROM micro_sources WHERE source_id = 'nufit-live'")
        conn.execute("DELETE FROM micro_sources WHERE source_id LIKE 'reactor-%'")
        conn.execute("DELETE FROM micro_sources WHERE source_id LIKE 'accelerator-%'")
        conn.execute("DELETE FROM micro_sources WHERE source_id LIKE 'atmospheric-%'")
        conn.execute("DELETE FROM micro_sources WHERE source_id = 'hepdata-jet-tail-live'")
        conn.execute("DELETE FROM micro_sources WHERE source_id = 'hepdata-jet-tail-seed'")
        conn.commit()
    finally:
        conn.close()


def write_real_snapshots() -> dict[str, str]:
    REAL_DIR.mkdir(parents=True, exist_ok=True)
    out: dict[str, str] = {}

    # Published muon g-2 snapshots (units are absolute a_mu values)
    # Sources:
    # - BNL E821 final (Phys. Rev. D 73, 072003, 2006)
    # - Fermilab Run-1 (PRL 126, 141801, 2021)
    # - Fermilab final precision (official release, 2025-06-03)
    pdg_rows = [
        {
            "dataset_id": "pdg-amu-live-1",
            "version_tag": "bnl-e821-2006",
            "source_url": "https://doi.org/10.1103/PhysRevD.73.072003",
            "measured_value": 116592080e-11,
            "stat_err": 54e-11,
            "sys_err": 33e-11,
        },
        {
            "dataset_id": "pdg-amu-live-2",
            "version_tag": "fermilab-run1-2021",
            "source_url": "https://doi.org/10.1103/PhysRevLett.126.141801",
            "measured_value": 116592040e-11,
            "stat_err": 54e-11,
            "sys_err": 0.0,
        },
        {
            "dataset_id": "pdg-amu-live-3",
            "version_tag": "fermilab-run2-3-2023",
            "source_url": "https://doi.org/10.1103/PhysRevLett.131.161802",
            "measured_value": 116592057e-11,
            "stat_err": 25e-11,
            "sys_err": 0.0,
        },
        {
            "dataset_id": "pdg-amu-live-4",
            "version_tag": "fermilab-combined-2023",
            "source_url": "https://doi.org/10.1103/PhysRevLett.131.161802",
            "measured_value": 116592055e-11,
            "stat_err": 24e-11,
            "sys_err": 0.0,
        },
        {
            "dataset_id": "pdg-amu-live-5",
            "version_tag": "fermilab-newdata-2025",
            "source_url": "https://doi.org/10.1103/7clf-sm2v",
            "measured_value": 116592071.0e-11,
            "stat_err": 16.2e-11,
            "sys_err": 0.0,
        },
        {
            "dataset_id": "pdg-amu-live-6",
            "version_tag": "fermilab-combined-2025",
            "source_url": "https://doi.org/10.1103/7clf-sm2v",
            "measured_value": 116592070.5e-11,
            "stat_err": 14.8e-11,
            "sys_err": 0.0,
        },
    ]

    for i, row in enumerate(pdg_rows, start=1):
        payload = {
            "measured_value": row["measured_value"],
            "stat_err": row["stat_err"],
            "sys_err": row["sys_err"],
        }
        path = REAL_DIR / f"pdg_muon_real_{i}.json"
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        out[f"pdg_{i}"] = str(path)
        out[f"pdg_dataset_{i}"] = row["dataset_id"]
        out[f"pdg_tag_{i}"] = row["version_tag"]
        out[f"pdg_url_{i}"] = row["source_url"]

    # Published NuFIT global-fit snapshots (normal ordering).
    # Source files:
    # - NuFIT 5.1 tables: v51.release-SKyes-NO and v51.release-SKno-NO
    # - NuFIT 5.2 tables: v52.release-SKyes-NO and v52.release-SKno-NO
    nufit_rows = [
        {
            "dataset_id": "nufit-v51-no-sk-no",
            "version_tag": "nufit-5.1-no-sk-no",
            "source_url": "https://www.nu-fit.org/?q=node/228",
            "rows": [
                {"observable_id": "nu_theta23", "measured_value": 0.573, "stat_err": 0.018, "sys_err": 0.010},
                {"observable_id": "nu_dm2_32", "measured_value": 2.515e-3, "stat_err": 0.028e-3, "sys_err": 0.012e-3},
                {"observable_id": "nu_theta13", "measured_value": 0.02220, "stat_err": 0.00056, "sys_err": 0.00024},
            ],
        },
        {
            "dataset_id": "nufit-v51-with-sk-no",
            "version_tag": "nufit-5.1-with-sk-no",
            "source_url": "https://www.nu-fit.org/?q=node/228",
            "rows": [
                {"observable_id": "nu_theta23", "measured_value": 0.450, "stat_err": 0.019, "sys_err": 0.010},
                {"observable_id": "nu_dm2_32", "measured_value": 2.510e-3, "stat_err": 0.027e-3, "sys_err": 0.012e-3},
                {"observable_id": "nu_theta13", "measured_value": 0.02246, "stat_err": 0.00055, "sys_err": 0.00024},
            ],
        },
        {
            "dataset_id": "nufit-v52-no-sk-no",
            "version_tag": "nufit-5.2-no-sk-no",
            "source_url": "https://www.nu-fit.org/?q=node/256",
            "rows": [
                {"observable_id": "nu_theta23", "measured_value": 0.572, "stat_err": 0.018, "sys_err": 0.010},
                {"observable_id": "nu_dm2_32", "measured_value": 2.511e-3, "stat_err": 0.027e-3, "sys_err": 0.012e-3},
                {"observable_id": "nu_theta13", "measured_value": 0.02203, "stat_err": 0.00055, "sys_err": 0.00023},
            ],
        },
        {
            "dataset_id": "nufit-v52-with-sk-no",
            "version_tag": "nufit-5.2-with-sk-no",
            "source_url": "https://www.nu-fit.org/?q=node/256",
            "rows": [
                {"observable_id": "nu_theta23", "measured_value": 0.451, "stat_err": 0.019, "sys_err": 0.010},
                {"observable_id": "nu_dm2_32", "measured_value": 2.507e-3, "stat_err": 0.027e-3, "sys_err": 0.012e-3},
                {"observable_id": "nu_theta13", "measured_value": 0.02225, "stat_err": 0.00054, "sys_err": 0.00023},
            ],
        },
    ]

    for i, ds in enumerate(nufit_rows, start=1):
        payload_rows = []
        for row in ds["rows"]:
            obs = row["observable_id"]
            payload_rows.append(
                {
                    "observable_id": obs,
                    "measured_value": row["measured_value"],
                    "stat_err": row["stat_err"],
                    "sys_err": row["sys_err"],
                }
            )
        payload = {"rows": payload_rows}
        path = REAL_DIR / f"nufit_real_rows_{i}.json"
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        out[f"nufit_{i}"] = str(path)
        out[f"nufit_dataset_{i}"] = ds["dataset_id"]
        out[f"nufit_tag_{i}"] = ds["version_tag"]
        out[f"nufit_url_{i}"] = ds["source_url"]

    return out


def collect_counts() -> tuple[dict[str, int], dict[str, int], dict[str, float]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(
            """
            SELECT channel, COUNT(*) AS n_obs, COUNT(DISTINCT dataset_id) AS n_datasets
            FROM micro_observations
            WHERE quality_flag='real'
            GROUP BY channel
            ORDER BY channel
            """
        ).fetchall()
        counts = {str(r["channel"]): int(r["n_obs"]) for r in rows}
        datasets = {str(r["channel"]): int(r["n_datasets"]) for r in rows}

        miss_rows = conn.execute(
            """
            SELECT channel,
                   AVG(CASE WHEN stat_err IS NULL OR sys_err IS NULL THEN 1.0 ELSE 0.0 END) AS missing_rate
            FROM micro_observations
            WHERE quality_flag='real'
            GROUP BY channel
            ORDER BY channel
            """
        ).fetchall()
        missing = {str(r["channel"]): float(r["missing_rate"]) for r in miss_rows}
        return counts, datasets, missing
    finally:
        conn.close()


def ingest_curated_neutrino_channels() -> dict[str, list[str]]:
    # Independent neutrino channels by experiment class.
    channel_rows = [
        {
            "source_id": "reactor-daya-bay-2022",
            "provider": "Daya Bay",
            "dataset_ref": "reactor-disappearance",
            "url": "https://doi.org/10.1038/s41586-022-04578-1",
            "version_tag": "dayabay-2022",
            "channel": "neutrino_reactor_disappearance",
            "dataset_id": "nu-reactor-daya-bay-2022",
            "rows": [
                {"observable_id": "nu_reactor_sin2_2theta13", "measured_value": 0.0856, "stat_err": 0.0029, "sys_err": 0.0010, "unit": "1"},
                {"observable_id": "nu_reactor_dm2_ee", "measured_value": 2.522e-3, "stat_err": 0.068e-3, "sys_err": 0.026e-3, "unit": "eV^2"},
            ],
        },
        {
            "source_id": "reactor-reno-2018",
            "provider": "RENO",
            "dataset_ref": "reactor-disappearance",
            "url": "https://doi.org/10.1103/PhysRevLett.121.201801",
            "version_tag": "reno-2018",
            "channel": "neutrino_reactor_disappearance",
            "dataset_id": "nu-reactor-reno-2018",
            "rows": [
                {"observable_id": "nu_reactor_sin2_2theta13", "measured_value": 0.0896, "stat_err": 0.0068, "sys_err": 0.0018, "unit": "1"},
                {"observable_id": "nu_reactor_dm2_ee", "measured_value": 2.68e-3, "stat_err": 0.12e-3, "sys_err": 0.07e-3, "unit": "eV^2"},
            ],
        },
        {
            "source_id": "reactor-doublechooz-2020",
            "provider": "Double Chooz",
            "dataset_ref": "reactor-disappearance",
            "url": "https://doi.org/10.1038/s41467-020-18026-z",
            "version_tag": "doublechooz-2020",
            "channel": "neutrino_reactor_disappearance",
            "dataset_id": "nu-reactor-doublechooz-2020",
            "rows": [
                {"observable_id": "nu_reactor_sin2_2theta13", "measured_value": 0.105, "stat_err": 0.014, "sys_err": 0.010, "unit": "1"},
            ],
        },
        {
            "source_id": "accelerator-t2k-2023",
            "provider": "T2K",
            "dataset_ref": "long-baseline-oscillation",
            "url": "https://doi.org/10.1103/PhysRevD.108.112003",
            "version_tag": "t2k-2023",
            "channel": "neutrino_accelerator_long_baseline",
            "dataset_id": "nu-accelerator-t2k-2023",
            "rows": [
                {"observable_id": "nu_acc_theta23", "measured_value": 0.53, "stat_err": 0.03, "sys_err": 0.01, "unit": "1"},
                {"observable_id": "nu_acc_dm2_32", "measured_value": 2.46e-3, "stat_err": 0.05e-3, "sys_err": 0.02e-3, "unit": "eV^2"},
                {"observable_id": "nu_acc_delta_cp", "measured_value": -1.89, "stat_err": 0.70, "sys_err": 0.25, "unit": "rad"},
            ],
        },
        {
            "source_id": "accelerator-nova-2024",
            "provider": "NOvA",
            "dataset_ref": "long-baseline-oscillation",
            "url": "https://novaexperiment.fnal.gov/results/",
            "version_tag": "nova-2024",
            "channel": "neutrino_accelerator_long_baseline",
            "dataset_id": "nu-accelerator-nova-2024",
            "rows": [
                {"observable_id": "nu_acc_theta23", "measured_value": 0.57, "stat_err": 0.03, "sys_err": 0.01, "unit": "1"},
                {"observable_id": "nu_acc_dm2_32", "measured_value": 2.41e-3, "stat_err": 0.07e-3, "sys_err": 0.03e-3, "unit": "eV^2"},
            ],
        },
        {
            "source_id": "atmospheric-superk-2023",
            "provider": "Super-Kamiokande",
            "dataset_ref": "atmospheric-oscillation",
            "url": "https://doi.org/10.1103/PhysRevD.108.032018",
            "version_tag": "superk-2023",
            "channel": "neutrino_atmospheric",
            "dataset_id": "nu-atmospheric-superk-2023",
            "rows": [
                {"observable_id": "nu_atm_theta23", "measured_value": 0.58, "stat_err": 0.04, "sys_err": 0.02, "unit": "1"},
                {"observable_id": "nu_atm_dm2_32", "measured_value": 2.50e-3, "stat_err": 0.06e-3, "sys_err": 0.03e-3, "unit": "eV^2"},
            ],
        },
        {
            "source_id": "atmospheric-icecube-2021",
            "provider": "IceCube/DeepCore",
            "dataset_ref": "atmospheric-oscillation",
            "url": "https://doi.org/10.1103/PhysRevD.104.072006",
            "version_tag": "icecube-2021",
            "channel": "neutrino_atmospheric",
            "dataset_id": "nu-atmospheric-icecube-2021",
            "rows": [
                {"observable_id": "nu_atm_theta23", "measured_value": 0.58, "stat_err": 0.09, "sys_err": 0.03, "unit": "1"},
                {"observable_id": "nu_atm_dm2_32", "measured_value": 2.31e-3, "stat_err": 0.11e-3, "sys_err": 0.05e-3, "unit": "eV^2"},
            ],
        },
    ]

    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        for ds in channel_rows:
            upsert_source(
                conn,
                source_id=str(ds["source_id"]),
                provider=str(ds["provider"]),
                dataset_ref=str(ds["dataset_ref"]),
                url=str(ds["url"]),
                license_name="official collaboration results",
                version_tag=str(ds["version_tag"]),
            )
            for row in ds["rows"]:
                observable_id = str(row["observable_id"])
                stat_err = float(row["stat_err"])
                sys_err = float(row["sys_err"])
                upsert_observation(
                    conn,
                    ObservationRecord(
                        channel=str(ds["channel"]),
                        observable_id=observable_id,
                        dataset_id=str(ds["dataset_id"]),
                        dataset_group="neutrino-exp",
                        x_value=None,
                        measured_value=float(row["measured_value"]),
                        stat_err=stat_err,
                        sys_err=sys_err,
                        cov_group=str(ds["channel"]),
                        unit=str(row["unit"]),
                        observed_at_utc="2024-01-01T00:00:00Z",
                        quality_flag="real",
                        source_url=str(ds["url"]),
                    ),
                )
        conn.commit()
    finally:
        conn.close()

    return {
        "reactor": [str(x["url"]) for x in channel_rows if str(x["channel"]) == "neutrino_reactor_disappearance"],
        "accelerator": [str(x["url"]) for x in channel_rows if str(x["channel"]) == "neutrino_accelerator_long_baseline"],
        "atmospheric": [str(x["url"]) for x in channel_rows if str(x["channel"]) == "neutrino_atmospheric"],
    }


def write_report(counts: dict[str, int], datasets: dict[str, int], missing: dict[str, float], meta: dict[str, str]) -> Path:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    path = REPORT_DIR / f"micro_sample_expansion_report_{datetime.now(UTC).strftime('%Y%m%d')}.md"
    pdg_urls = [meta[k] for k in sorted(meta) if k.startswith("pdg_url_")]
    nufit_urls = [meta[k] for k in sorted(meta) if k.startswith("nufit_url_")]
    reactor_urls = [meta[k] for k in sorted(meta) if k.startswith("reactor_url_")]
    accelerator_urls = [meta[k] for k in sorted(meta) if k.startswith("accelerator_url_")]
    atmospheric_urls = [meta[k] for k in sorted(meta) if k.startswith("atmospheric_url_")]

    lines = [
        "# Micro Sample Expansion Report",
        "",
        f"- generated_at_utc: {now_utc()}",
        "- quality_scope: real-only",
        "- data_policy: curated real-data snapshots only (no synthetic jitter)",
        "",
        "## Sources",
        f"- muon: {', '.join(pdg_urls)}",
        f"- neutrino-global-fit: {', '.join(nufit_urls)}",
        f"- neutrino-reactor: {', '.join(reactor_urls)}",
        f"- neutrino-accelerator: {', '.join(accelerator_urls)}",
        f"- neutrino-atmospheric: {', '.join(atmospheric_urls)}",
        "- collider: https://www.hepdata.net/record/ins1394678?format=json",
        "",
        "| channel | n_obs | distinct_dataset_id | missing_err_rate |",
        "|---|---:|---:|---:|",
    ]
    for channel in sorted(set(list(counts.keys()) + list(datasets.keys()) + list(missing.keys()))):
        lines.append(
            f"| {channel} | {counts.get(channel, 0)} | {datasets.get(channel, 0)} | {missing.get(channel, 0.0):.4f} |"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def main() -> None:
    reset_previous_fixture_rows()
    snapshots = write_real_snapshots()
    base_env = dict(os.environ)
    base_env["MICRO_INGEST_MODE"] = "real"

    pdg_n = sum(1 for k in snapshots if k.startswith("pdg_") and k[4:].isdigit())
    for i in range(1, pdg_n + 1):
        env = dict(base_env)
        env["PDG_LOCAL_JSON"] = snapshots[f"pdg_{i}"]
        env["PDG_DATASET_ID"] = snapshots[f"pdg_dataset_{i}"]
        env["PDG_VERSION_TAG"] = snapshots[f"pdg_tag_{i}"]
        env["PDG_URL"] = snapshots[f"pdg_url_{i}"]
        run([sys.executable, str(ROOT / "tools" / "micro" / "ingest_pdg.py")], env)

    for i in range(1, 5):
        env = dict(base_env)
        env["NUFIT_LOCAL_JSON"] = snapshots[f"nufit_{i}"]
        env["NUFIT_DATASET_ID"] = snapshots[f"nufit_dataset_{i}"]
        env["NUFIT_VERSION_TAG"] = snapshots[f"nufit_tag_{i}"]
        env["NUFIT_URL"] = snapshots[f"nufit_url_{i}"]
        run([sys.executable, str(ROOT / "tools" / "micro" / "ingest_nufit.py")], env)

    extra_urls = ingest_curated_neutrino_channels()
    for i, u in enumerate(extra_urls["reactor"], start=1):
        snapshots[f"reactor_url_{i}"] = u
    for i, u in enumerate(extra_urls["accelerator"], start=1):
        snapshots[f"accelerator_url_{i}"] = u
    for i, u in enumerate(extra_urls["atmospheric"], start=1):
        snapshots[f"atmospheric_url_{i}"] = u

    env = dict(base_env)
    env["HEPDATA_DATASET_ID"] = "hepdata-live-fixture"
    env["HEPDATA_VERSION_TAG"] = "ins1394678"
    run([sys.executable, str(ROOT / "tools" / "micro" / "ingest_hepdata.py")], env)

    stats_env = dict(os.environ)
    stats_env["MICRO_QUALITY_MODE"] = "real"
    run([sys.executable, str(ROOT / "tools" / "micro" / "run_micro_predictors.py")], stats_env)
    run([sys.executable, str(ROOT / "tools" / "micro" / "run_micro_stats.py")], stats_env)

    counts, datasets, missing = collect_counts()
    report = write_report(counts, datasets, missing, snapshots)

    print("micro sample expansion complete")
    print(json.dumps({"counts": counts, "datasets": datasets}, ensure_ascii=False))
    print(f"report: {report}")


if __name__ == "__main__":
    main()
