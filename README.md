# SALT Verification Console

검증 목적 웹 콘솔(MVP)입니다. 핵심은 예측-데이터-판정을 재현 가능하게 공개하는 것입니다.

## 문서 진입점

문서가 여러 갈래로 나뉘어 있으므로, 현재 작업 기준은 아래 순서로 봅니다.

- 현재 실행 기준 문서: `docs/roadmap/current/MASTER_EXECUTION_STRUCTURE_PLAN.md`

원칙:

- `docs/roadmap/current/MASTER_EXECUTION_STRUCTURE_PLAN.md`를 현재 실행의 단일 기준으로 사용합니다.
- `docs/roadmap/reference/*`는 주제별 배경 문서입니다.
- `docs/roadmap/archive/*`는 기록 보존용이며 현재 실행 기준 문서가 아닙니다.

## 기준 데이터셋 메타데이터 (현재)
| 항목 | 내용 |
|---|---|
| dataset 버전/생성시각 | `frozen-20260308`, `2026-03-08T16:02:02Z` |
| 거시 출처 | GraceDB, GCN, HEASARC |
| 미시 출처 | HEPData, PDG, NuFIT |
| 참조 파일 경로 | `data/frozen/current/manifest.json`, `data/frozen/current/audit_manifest.json`, `docs/sources/CONFIRMED_EVENT_ENDPOINTS.md`, `docs/sources/OPEN_DATASETS_API_LIST.md` |

## 1) 환경 준비
```bash
cd /home/jwater/Development/salt-verification-console
python3 -m venv .venv
source .venv/bin/activate
.venv/bin/pip install -U pip
.venv/bin/pip install numpy matplotlib
```

## 2) 분석 결과 생성
```bash
.venv/bin/python analysis/ligo/build_residual_report.py
.venv/bin/python analysis/fermi/build_residual_report.py
```

생성 파일:
- `results/reports/p001_results.csv`
- `results/reports/p002_results.csv`
- `data/processed/results_p1-time-delay-redshift.json`
- `data/processed/results_p2-hf-tail.json`

## 3) 그래프 생성
```bash
.venv/bin/python tools/makegraph/run_all_graphs.py
```

출력 경로:
- `docs/book/graph/*.jpg`

## 4) 웹 콘솔 실행
```bash
cd web
npm install
npm run dev
```

검증 페이지:
- `http://localhost:3000/evidence`
- `http://localhost:3000/events`
- `http://localhost:3000/limits`

검증 빌드:
```bash
npm run lint
npm run build
```

## 4-1) 실시간 검증 DB 초기화 (MVP)
```bash
.venv/bin/python tools/realtime/collect_public_events.py
.venv/bin/python tools/realtime/build_realtime_db.py
.venv/bin/python tools/realtime/refresh_live_snapshot.py
```

선택(추가 소스 URL 지정):
```bash
export GCN_EVENTS_URL="<json endpoint>"
export ZTF_EVENTS_URL="<json endpoint>"
export HEASARC_EVENTS_URL="<json endpoint>"
```

기본 내장 엔드포인트(미설정 시 자동 사용):
- GWOSC: `https://gwosc.org/api/v2/event-versions/`
- GraceDB: `https://gracedb.ligo.org/apiweb/superevents/`
- GCN: `https://gcn.nasa.gov/circulars/archive.json.tar.gz`
- ZTF(IRSA): `https://irsa.ipac.caltech.edu/cgi-bin/ZTF/nph_light_curves?POS=CIRCLE+298.0025+29.87147+0.0014&BANDNAME=g&FORMAT=CSV`
- HEASARC: `https://heasarc.gsfc.nasa.gov/xamin/query?table=fermigbrst&ResultMax=200&format=stream`

생성 파일:
- `data/processed/live_events.json`
- `data/processed/svc_realtime.db`
- `data/processed/live_snapshot.json`

한 번에 실행:
```bash
.venv/bin/python tools/realtime/run_realtime_cycle.py
```

자동 배치(cron, 10분 간격):
```bash
bash tools/realtime/install_cron_cycle.sh
```

크론 해제:
```bash
crontab -l | grep -v "run_realtime_cycle.py" | crontab -
```

## 4-2) GitHub Actions 자동 갱신 (권장 운영)
- 워크플로우: `.github/workflows/realtime-update.yml`
- 실행 주기: 30분 간격 + 수동 실행(`workflow_dispatch`)
- 동작: `run_realtime_cycle.py` 실행 후 `live_events.json`, `svc_realtime.db`, `live_snapshot.json` 변경 시 자동 커밋/푸시

## 5) 블라인드 검증 산출물
- 설정: `results/reports/blind_setup.md`
- 평가: `results/reports/blind_eval_20260306.md`
- 실행 로그: `results/reports/repro_run_20260306.txt`

## 6) 로드맵/프로토콜
- 현재 실행 기준: `docs/roadmap/current/MASTER_EXECUTION_STRUCTURE_PLAN.md`
- 초기 MVP 계획(아카이브): `docs/roadmap/archive/SVC_MVP_PLAN.md`
- 실시간 설계: `docs/roadmap/reference/SVC_REALTIME_VALIDATION_PLAN.md`
- 아키텍처/ERD: `docs/method/ARCHITECTURE_ERD.md`
- 협업 실행 원칙: `docs/roadmap/reference/COLLAB_EXECUTION_PROTOCOL.md`
- 블라인드: `docs/protocols/blind_protocol.md`
- 통계: `docs/protocols/stats_protocol.md`
- 예측식 사전고정: `docs/protocols/prereg_prediction_protocol.md`
- 채널별 식 도출 템플릿: `docs/method/formula_derivation_template.md`
- 채널별 식 도출 샘플:
  - `docs/method/formulas/cosmic_time_delay_redshift.md`
  - `docs/method/formulas/micro_muon_g_minus_2.md`
- 논문 제출 점검표: `docs/roadmap/reference/paper_submission_readiness_checklist.md`

## 7) Cosmic 제출 모드 준비 (feature sidecar 필수)
0. 대체 cosmic 후보셋 생성(권장)
```bash
.venv/bin/python tools/evaluation/build_cosmic_submission_candidates.py
```
- 출력:
  - `results/reports/cosmic_submission_candidates.csv`
  - `results/reports/cosmic_submission_candidates_top50.csv`

1. sidecar 템플릿 생성/병합
```bash
.venv/bin/python tools/evaluation/cosmic_feature_sidecar.py --write
```

2. 이벤트별 `redshift_z`, `luminosity_distance_mpc` 채우기
- 파일: `data/processed/cosmic_observation_features.json`
- 자동 보강(가능한 항목만):
```bash
.venv/bin/python tools/evaluation/enrich_cosmic_features.py
```
- 또는 큐 CSV 편집 후 자동 반영:
```bash
# edit results/reports/cosmic_feature_fill_queue.csv
.venv/bin/python tools/evaluation/apply_cosmic_feature_queue.py
```

3. 제출 모드 검증 + 실행
```bash
.venv/bin/python tools/evaluation/cosmic_feature_sidecar.py --check
COSMIC_SUBMISSION_MODE=1 MICRO_SUBMISSION_MODE=1 .venv/bin/python tools/evaluation/run_model_eval.py
```
