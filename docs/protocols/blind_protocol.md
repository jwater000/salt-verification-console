# Blind Protocol

## 목적
- 사후 해석 편향을 줄이기 위해 예측 고정 후 블라인드 평가를 수행한다.

## 범위
- 대상 예측: `P-001`, `P-002` (추가 가능)
- 대상 분석: `analysis/ligo`, `analysis/fermi`

## 고정 항목(잠금 전 확정)
- 가설 문구
- 전처리 규칙
- 특징량/점수 정의
- 판정 임계값
- 실패 조건

## 블라인드 절차
1. 학습/튜닝 구간과 숨김(holdout) 구간을 분리한다.
2. 숨김 구간 메타정보를 잠금한다.
3. 공개 구간으로만 파이프라인/임계값을 확정한다.
4. `docs/registry/REGISTRY.md`에 잠금 선언 후 서명(날짜)을 남긴다.
5. 숨김 구간을 해제하고 단 1회 평가한다.
6. 결과를 `results/reports/`에 저장하고 재실행 로그를 남긴다.

## 숨김(holdout) 구간 규칙 (고정)
- 고정일자: `2026-03-06`
- 분할 비율: 공개 `70%`, 숨김 `30%`
- 분할 기준:
  - `P-001`(LIGO): 이벤트 시각 기준으로 최신 30%를 숨김
  - `P-002`(FERMI): 이벤트 시각 기준으로 최신 30%를 숨김
- 잠금 전 허용:
  - 공개 구간에서만 임계값/전처리 튜닝 가능
- 잠금 후 금지:
  - 숨김 구간 재정의
  - 분할 비율 변경
  - 숨김 해제 전 결과 미리 조회

## 금지 사항
- 숨김 구간 반복 조회 후 임계값 재조정 금지
- 결과 확인 후 특성/모델/전처리 변경 금지
- 사후적으로 유리한 지표 선택 금지

## 실패 조건(프로토콜 위반)
- 잠금 이후 코드/규칙 변경 발생
- 숨김 구간 미리 열람한 정황 존재
- 동일 예측에 대해 2회 이상 평가 수행

## 산출물
- 블라인드 설정 기록: `results/reports/blind_setup.md`
- 평가 결과: `results/reports/blind_eval_YYYYMMDD.md`
- 실행 로그: `results/reports/repro_run_YYYYMMDD.txt`

## 실행 명령(고정)
- LIGO 결과 재생성: `.venv/bin/python analysis/ligo/build_residual_report.py`
- FERMI 결과 재생성: `.venv/bin/python analysis/fermi/build_residual_report.py`
- 웹 검증 빌드: `cd web && npm run lint && npm run build`
