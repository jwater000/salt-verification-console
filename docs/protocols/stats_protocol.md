# Statistical Protocol

## 목적
- SALT 검증의 통계 판정 기준을 사전에 고정한다.

## 기본 원칙
- 주효과(primary endpoint) 우선
- 다중가설 보정 필수(FDR)
- 효과크기와 불확실성(신뢰구간) 동시 보고
- 유의확률만으로 결론 내리지 않음

## 유의수준 및 보정
- 기본 유의수준: `alpha = 0.05`
- 다중가설 보정: Benjamini-Hochberg FDR, `q = 0.10` (기본)
- 필요 시 보수적 대안: Bonferroni (보조 보고)

## 분석 단위
- 이벤트 단위 점수
- 데이터셋 단위 집계
- 전체 메타 점수(사전 정의 가중치 사용)

## 판정 규칙
- Supported:
  - 주효과가 사전 방향성과 일치
  - FDR 보정 후 유의 (`q < 0.10`)
  - 효과크기가 최소 실질 기준 이상 (`|Cohen's d| >= 0.20`)
- Not Supported:
  - 주효과 방향성 불일치 또는 FDR 비유의 (`q >= 0.10`)
  - 효과크기 미달 (`|Cohen's d| < 0.20`)
- Inconclusive:
  - 샘플 수 부족(`n < 20`), 결측 과다, 품질 이슈

## 결측/이상치 처리
- 결측 처리 규칙:
  - `event_id`, `event_time_utc`, `standard_fit`, `salt_fit` 중 하나라도 결측이면 해당 이벤트 제외
  - 제외 이벤트는 `results/reports/excluded_events.csv`에 기록
- 이상치 기준:
  - `residual_score`가 중앙값 기준 MAD의 `3.5`배를 초과하면 이상치 플래그 부여
  - 이상치 이벤트는 기본 분석에서 유지하되, 민감도 분석에서 제외 결과를 병행 보고
- 제외 사유는 이벤트 단위로 모두 로그 기록

## 재현성 요구
- 동일 입력에서 동일 결과 재현 가능해야 함
- 결과 파일 포맷:
  - `results/reports/*.csv`
  - `results/reports/*.json`

## 실패 조건(미지지 판정과 별도)
- 사전 정의하지 않은 지표로 결론 변경
- 보정 없는 p-value만으로 주장
- 중간 결과를 반영한 임계값 재설정
