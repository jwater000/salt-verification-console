# SVC Term Sync Table

웹/문서/데이터 파이프라인에서 혼동이 잦은 핵심 용어를 단일 표기로 고정한다.

| 항목 | 고정 표기 | 적용 범위 |
|---|---|---|
| 거시 표준이론 | `ΛCDM` | `/cosmic/*`, 거시 비교 문맥의 `Standard` |
| 미시 표준이론 | `SM` | `/micro/*`, 미시 비교 문맥 |
| SALT 비교항 | `salt_pred` | micro/cosmic 비교 결과 |
| 실측값 | `measured_value` 또는 `actual_value` | micro(`measured_value`), cosmic(`actual_value`) |
| 판정 승자 | `winner` (`SALT`/`SM`/`Standard`/`TIE`) | 이벤트 및 채널 집계 |
| 통계 규칙 버전 | `decision_rule_version` | `micro_scores`, audit manifest |
| 식 버전 | `formula_version` | `micro_salt_predictions`, audit manifest |
| 데이터 버전 | `dataset_version` | audit manifest |
| 잠금 정책 | `운영잠금(operational lock)` | 책 16/17/18/20/24/26/28, `/micro/method` |

## 금지 규칙
- 미시 문맥에서 `Standard` 단독 표기 금지 (`SM` 명시).
- 거시 문맥에서 `SM`을 표준우주론 의미로 사용 금지.
- `완전잠금(perfect lock)`을 운영 요구사항으로 선언 금지.
