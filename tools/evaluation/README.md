# Evaluation Frozen Snapshot

Build frozen evaluation inputs from `data/processed`:

```bash
.venv/bin/python tools/evaluation/build_frozen_snapshot.py
```

Optional dataset version override:

```bash
FROZEN_DATASET_VERSION=frozen-20260308 .venv/bin/python tools/evaluation/build_frozen_snapshot.py
```

Outputs:

- `data/frozen/<dataset_version>/`
- `data/frozen/current/`
- `manifest.json` with file hashes for audit/provenance
