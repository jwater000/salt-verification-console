# Data Contract (MVP v0.1)

이 문서는 웹 콘솔이 읽는 사전계산 결과 파일의 최소 스키마를 정의한다.

## 1) `data/processed/predictions.json`

필수 필드:
- `id`: 예측 식별자 (`p1-time-delay-redshift` 등)
- `title`: 예측 제목
- `summary`: 한 줄 요약
- `status`: `draft | analysis | locked | evaluated | archived`
- `datasets`: 데이터셋 ID 배열
- `falsification`: 반증 기준 문장

## 2) `data/processed/datasets.json`

필수 필드:
- `id`: 데이터셋 식별자
- `title`: 데이터셋 이름
- `source`: 출처
- `updated_at`: `YYYY-MM-DD`
- `events`: 이벤트 수

## 3) `data/processed/results_<prediction>.json`

필수 필드:
- `prediction_id`
- `event_id`
- `standard_fit` (number)
- `salt_fit` (number)
- `residual_score` (number)
- `flag` (`candidate | neutral | rejected`)

권장 필드:
- `event_time_utc` (`YYYY-MM-DDTHH:MM:SSZ`)
- `actual_value` (number, 실측값)
- `standard_error` (number, `actual_value - standard_fit`)
- `salt_error` (number, `actual_value - salt_fit`)

## 4) 파일 운영 규칙
- 모든 파일은 UTF-8, LF 기준
- 날짜는 `YYYY-MM-DD`
- 수치 필드는 문자열 금지
- 새로운 필드 추가 시 하위호환 유지
