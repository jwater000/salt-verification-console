# SALT Verification Console

검증 목적 웹 콘솔(MVP)입니다. 핵심은 예측-데이터-판정을 재현 가능하게 공개하는 것입니다.

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
- 로드맵: `docs/roadmap/SVC_MVP_PLAN.md`
- 실시간 설계: `docs/roadmap/SVC_REALTIME_VALIDATION_PLAN.md`
- 아키텍처/ERD: `docs/method/ARCHITECTURE_ERD.md`
- 협업 실행 원칙: `docs/roadmap/COLLAB_EXECUTION_PROTOCOL.md`
- 블라인드: `docs/protocols/blind_protocol.md`
- 통계: `docs/protocols/stats_protocol.md`
