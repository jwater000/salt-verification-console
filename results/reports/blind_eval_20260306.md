# Blind Evaluation Report

- 평가일: `2026-03-06`
- 평가자: `jwater`
- 실행 로그: `results/reports/repro_run_20260306.txt`
- 실행 커맨드:
  - `.venv/bin/python analysis/ligo/build_residual_report.py`
  - `.venv/bin/python analysis/fermi/build_residual_report.py`

## 요약 결론
- P-001: `Inconclusive`
- P-002: `Inconclusive`

## P-001 결과 (Holdout)
- 표본 수(`n`): `1`
- Holdout 이벤트: `GW170104`
- 효과 방향성: 일치(Δfit = +0.03)
- FDR q-value: `N/A (n<20)`
- 효과크기(`|d|`): `N/A (n<20)`
- 판정: `Inconclusive` (통계 프로토콜의 최소 표본수 미충족)
- 근거 파일:
  - `results/reports/p001_results.csv`
  - `data/processed/results_p1-time-delay-redshift.json`

## P-002 결과 (Holdout)
- 표본 수(`n`): `1`
- Holdout 이벤트: `GRB160509A`
- 효과 방향성: 불일치(Δfit = -0.009)
- FDR q-value: `N/A (n<20)`
- 효과크기(`|d|`): `N/A (n<20)`
- 판정: `Inconclusive` (통계 프로토콜의 최소 표본수 미충족)
- 근거 파일:
  - `results/reports/p002_results.csv`
  - `data/processed/results_p2-hf-tail.json`

## 프로토콜 준수 점검
- [x] 숨김 구간 1회 평가 원칙 준수
- [x] 잠금 이후 임계값 변경 없음
- [x] 제외/이상치 로그 첨부 완료 (`results/reports/excluded_events.csv`)

## 비고
- 제한점:
  - 현재 시드 데이터는 표본 수가 매우 작아 통계적 결론이 불가함.
- 다음 조치:
  - 이벤트 수 확장(>=20) 후 동일 프로토콜로 재평가.
