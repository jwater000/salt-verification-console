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
- includes `micro_prediction_lock.json` for prediction tamper check
- includes predictor/eval manifests (`model_eval_manifest.json`, `cosmic_predictor_manifest.json`, `micro_predictor_manifest.json`)

Verify frozen manifest integrity (required files + hash/size):

```bash
.venv/bin/python tools/evaluation/verify_frozen_manifest.py
```

Verify specific frozen version:

```bash
.venv/bin/python tools/evaluation/verify_frozen_manifest.py --manifest data/frozen/frozen-20260307/manifest.json
```

Verify micro prediction lock integrity (DB predictions vs lock hash):

```bash
python3 tools/evaluation/verify_prediction_lock.py
```

Expand cosmic frozen sample base from `live_events` (`p1=25`, `p2=25`):

```bash
python3 tools/evaluation/expand_cosmic_frozen_samples.py
```

Regenerate cosmic `standard_fit/salt_fit` using predictor engines (observation-only input):

```bash
python3 tools/evaluation/run_cosmic_predictors.py
```

Run unified model-eval pipeline (cosmic+micro predictors -> stats -> frozen -> verify):

```bash
python3 tools/evaluation/run_model_eval.py
```
