# Micro Ingest Modes

`tools/micro/ingest_*.py` scripts support two modes:

- `seed` (default): deterministic built-in sample rows
- `real`: try real/local source payload first, then fallback to seed on failure

Set mode:

```bash
MICRO_INGEST_MODE=real .venv/bin/python tools/micro/run_micro_cycle.py
```

## Source-specific inputs

### HEPData

- `HEPDATA_LOCAL_JSON`: local JSON file path (preferred for stable runs)
- `HEPDATA_URL`: remote JSON URL (default: `https://www.hepdata.net/record/ins1394678?format=json`)
- `HEPDATA_DATASET_ID` (optional, default `hepdata-live`)
- `HEPDATA_VERSION_TAG` (optional, default `live`)

Accepted local JSON formats:

1. `{ "points": [ { "x": 500, "y": 0.92, "stat_err": 0.02, "sys_err": 0.01 } ] }`
2. HEPData-style `independent_variables` + `dependent_variables`

### PDG

- `PDG_LOCAL_JSON`: local JSON file path
- `PDG_URL`: remote JSON URL (optional, if endpoint exists)
- `PDG_DATASET_ID` (optional, default `pdg-amu-live`)
- `PDG_VERSION_TAG` (optional, default `live`)

Required keys in PDG payload:

```json
{
  "measured_value": 0.0,
  "stat_err": 0.0,
  "sys_err": 0.0,
  "sm_pred": 0.0,
  "salt_pred": 0.0
}
```

### NuFIT

- `NUFIT_LOCAL_JSON`: local JSON file path
- `NUFIT_URL`: remote JSON URL (optional)
- `NUFIT_ALLOW_INSECURE=1`: allow insecure TLS fetch (for cert issues)
- `NUFIT_DATASET_ID` (optional, default `nufit-live`)
- `NUFIT_VERSION_TAG` (optional, default `live`)

Required keys in NuFIT payload:

```json
{
  "rows": [
    {
      "observable_id": "nu_theta23",
      "measured_value": 0.867,
      "stat_err": 0.02,
      "sys_err": 0.01,
      "sm_pred": 0.859,
      "salt_pred": 0.863
    }
  ]
}
```

## Notes

- In `real` mode, a fetch/parse error does not stop pipeline execution; script logs warning and uses seed rows.
- For reproducible CI, prefer `*_LOCAL_JSON` inputs over live URLs.
