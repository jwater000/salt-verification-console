# Submission Readiness Report

- generated_at_utc: `2026-03-08T16:05:27Z`
- overall: **PASS**
- dataset_version: `frozen-20260308`

## Check Results
- [x] Formula versions are submission-candidate-v1 for cosmic/micro :: PASS
  - note: `{'cosmic_sm': 'cosmic-sm-submission-candidate-v1', 'cosmic_salt': 'cosmic-salt-submission-candidate-v1', 'micro_sm': 'micro-sm-submission-candidate-v1', 'micro_salt': 'micro-salt-submission-candidate-v1'}`
- [x] Micro prediction lock exists and matches model_eval :: PASS
  - note: `lock=327bafd8582b8de649b471c6751891691e3836160f19009bde644c901e3d89f2 eval=327bafd8582b8de649b471c6751891691e3836160f19009bde644c901e3d89f2`
- [x] Frozen manifest exists with required files :: PASS
  - note: `files=8`
- [x] Cosmic sidecar has redshift+distance for current 50 events :: PASS
  - note: `total=100 both_filled=51`
- [x] No cosmic submission exclusions in latest run :: PASS
  - note: `[{"path": "results_p1-time-delay-redshift.json", "input_rows": 25, "used_rows": 25, "excluded_rows": 0, "excluded": []}, {"path": "results_p2-hf-tail.json", "input_rows": 25, "used_rows": 25, "excluded_rows": 0, "excluded": []}]`
- [x] Processed manifests include non-empty frozen manifest sha256 :: PASS
  - note: `manifest_sha256=1c36f819961fdea39a80147168de3a430a645ea9ac798e6f2221ae62d458896c`
- [x] Web production build :: PASS
  - note: `web build succeeded`

## Artifacts
- processed/model_eval_manifest.json
- processed/cosmic_predictor_manifest.json
- processed/micro_predictor_manifest.json
- processed/micro_prediction_lock.json
- frozen/current/manifest.json
- results/reports/cosmic_submission_exclusions.json
