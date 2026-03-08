# Predictor Engines

이 디렉토리는 거시/미시 예측 엔진의 공통 CLI/계약 구현을 담는다.

## 계약 파일

- `docs/method/prediction_contract.json`

## 공통 CLI 규약

모든 엔진은 아래 인자를 필수로 받습니다.

- `--input`
- `--output`
- `--engine-version`
- `--formula-version`

선택:

- `--strict` (계약 외 키/금지 키 발견 시 실패)

## 엔진 파일

- `cosmic_sm_predict.py`
- `cosmic_salt_predict.py`
- `micro_sm_predict.py`
- `micro_salt_predict.py`

현재 상태(2026-03-09):

- `micro_sm_predict.py`, `micro_salt_predict.py`: `submission-candidate-v1` 예측식 구현(입력 계약 검증 + 예측 산출)
- `cosmic_sm_predict.py`, `cosmic_salt_predict.py`: `submission-candidate-v1` 예측식 구현(입력 계약 검증 + 예측 산출)
