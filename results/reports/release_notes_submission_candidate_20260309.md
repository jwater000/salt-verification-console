# Release Notes: Submission Candidate v1

Date: 2026-03-09
Scope: SALT Verification Console (cosmic + micro submission candidate pipeline)

## 1) Release Summary
- Objective: move both cosmic and micro predictors to `submission-candidate-v1` formula tracks.
- Status: Submission readiness report is `PASS`.
- Readiness report: `results/reports/submission_readiness_report_20260309.md`

## 2) Formula/Engine Lock
- engine_version (cosmic): `cosmic-predictor-v1`
- engine_version (micro): `micro-predictor-v1`
- cosmic_sm formula: `cosmic-sm-submission-candidate-v1`
- cosmic_salt formula: `cosmic-salt-submission-candidate-v1`
- micro_sm formula: `micro-sm-submission-candidate-v1`
- micro_salt formula: `micro-salt-submission-candidate-v1`

## 3) Reproducibility Hashes
- micro prediction lock sha256:
  - `327bafd8582b8de649b471c6751891691e3836160f19009bde644c901e3d89f2`
- frozen dataset version:
  - `frozen-20260308`
- frozen manifest sha256:
  - `1c36f819961fdea39a80147168de3a430a645ea9ac798e6f2221ae62d458896c`

## 4) Core Output Hashes
- `results_p1-time-delay-redshift.json` sha256:
  - `7bb89d7e1f45604cef74d3fe64a7b4b45d8e4569835c77c5cf3f6e1d72de14af`
- `results_p2-hf-tail.json` sha256:
  - `de16807de7e1f2052307363c116f8c00ce835cd98dbb3e6b59ebf6e669999bd5`
- micro SM prediction sha256:
  - `a10f12fc8aa5ec74537c69a620512dde95ac8fed224a387353c1fa9acc37433d`
- micro SALT prediction sha256:
  - `a2adfe5466d451a85f8a7395ec581ae5f9f05773b64661ab127f9716cb3bd257`

## 5) Notable Changes in This Release
- Added preregistration protocol, formula derivation template, and paper-readiness checklist.
- Added cosmic submission-mode gating (`COSMIC_SUBMISSION_MODE`) and feature sidecar validation.
- Added queue/apply/enrich workflows for cosmic feature filling.
- Built alternative cosmic submission candidate dataset from GCN-derived redshift signals.
- Removed public monitoring pages from main product flow.
- Simplified public IA to Results / Evidence / Reproduce and improved audit transparency.

## 6) Tag Recommendation
- Suggested git tag: `submission-candidate-v1-20260309`
- Suggested release note anchor: this file
