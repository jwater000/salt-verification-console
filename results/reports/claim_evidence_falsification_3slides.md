# 3-Slide Summary: Claim / Evidence / Falsification

## Slide 1: Claim
- 제목: `SALT Verification Console`
- 핵심 주장:
  - SALT는 표준 기준선 대비 잔차 패턴을 사전예측 형태로 검증 가능하게 제시한다.
  - 예측(P-001, P-002)은 반증 조건과 판정 규칙을 잠금 상태로 공개한다.
- 화면 포인트:
  - `/predictions` 레지스트리
  - `docs/registry/REGISTRY.md` 잠금 상태

## Slide 2: Evidence
- 데이터:
  - LIGO 이벤트(`dataset-gw-001`)
  - FERMI 이벤트(`dataset-he-001`)
- 증거 형식:
  - `results/reports/p001_results.csv`
  - `results/reports/p002_results.csv`
  - `/dashboard`의 표준 vs SALT 비교, 필터, 다운로드
- 재현 경로:
  - `analysis/*/build_residual_report.py`
  - `results/reports/repro_run_20260306.txt`

## Slide 3: Falsification
- 반증 규칙:
  - 문서: `docs/predictions/P-001.md`, `docs/predictions/P-002.md`
  - 통계 기준: `alpha=0.05`, `q<0.10`, `|d|>=0.20`
- 블라인드 실행 결과(2026-03-06):
  - P-001: Inconclusive
  - P-002: Inconclusive
  - 이유: holdout 표본 수 `n<20`
- 다음 단계:
  - 이벤트 수 확장 후 동일 프로토콜로 재평가
