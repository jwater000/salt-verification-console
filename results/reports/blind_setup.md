# Blind Setup

- 작성일: `2026-03-06`
- 작성자: `jwater`
- 관련 예측: `P-001`, `P-002`
- 프로토콜 참조:
  - `docs/protocols/blind_protocol.md`
  - `docs/protocols/stats_protocol.md`

## 분할 규칙
- 공개/숨김 비율: `70% / 30%`
- 분할 기준: 이벤트 시각(`event_time_utc`) 오름차순

## 데이터셋별 분할 결과

| Prediction | Dataset | Total | Public | Holdout | Holdout Range |
|---|---:|---:|---:|---:|---|
| P-001 | dataset-gw-001 | 3 | 2 | 1 | 2017-01-04T10:11:58Z ~ 2017-01-04T10:11:58Z |
| P-002 | dataset-he-001 | 3 | 2 | 1 | 2016-05-09T08:58:46Z ~ 2016-05-09T08:58:46Z |

## 잠금 선언
- 잠금일자: `2026-03-06`
- 잠금 커밋/태그: `N/A (local workspace)`
- 변경 금지 항목:
  - 가설 문구
  - 판정 임계값
  - 분할 규칙
  - 실패 조건

## 실행 체크리스트
- [x] 공개 구간에서 파라미터 확정
- [x] `REGISTRY` 잠금 상태 확인
- [x] 숨김 구간 미열람 확인
