# Preregistration Protocol for Prediction Formulas (v1)

최종 업데이트: `2026-03-09`

목적:
- 표준이론(SM/ΛCDM) 예측식과 SALT 예측식을 과학자 검증 가능한 형태로 사전고정한다.
- 데이터 확인 후 식/파라미터를 바꾸는 사후최적화(HARKing, p-hacking)를 차단한다.

적용 범위:
- `Cosmic` 채널 전체
- `Micro` 채널 전체
- 논문 본문/부록/코드(`tools/predictors/*`)와 Audit 문서 전체

## 1) 고정 전 필수 입력
1. 채널 정의: 관측량 이름, 단위, 표준 표기, 데이터 소스
2. 표준이론 식: 원문헌/공식 문서 근거 URL, 식 번호, 근사 조건
3. SALT 식: 유도 시작점(가정/공리), 유효 범위, 자유항 정의
4. 오차모델: 통계오차/계통오차 결합 규칙
5. 판정 규칙: alpha, FDR, effect size, tie 기준

## 2) 고정(Freeze) 산출물
아래 파일/필드는 고정 대상이다.
1. `docs/method/formula_derivation_template.md` 기반 채널별 식 문서
2. `docs/method/prediction_contract.json` (입출력 계약)
3. `tools/predictors/*` 엔진 코드
4. `data/frozen/current/micro_prediction_lock.json`
5. `data/frozen/current/audit_manifest.json`
6. `data/frozen/current/model_eval_manifest.json`

고정 식별자:
- `engine_version`
- `formula_version`
- `prediction_lock_sha256`
- `frozen manifest sha256`

## 3) 금지 사항
1. 평가 데이터 조회 후 식 구조 변경
2. 채널별 예외 규칙을 문서 없이 코드에만 반영
3. 표준식/SALT식 중 한쪽만 유리하게 오차모델 변경
4. 실패 채널 누락 또는 선택적 보고

## 4) 변경 관리 (Amendment)
고정 후 변경이 필요하면 아래를 모두 수행한다.
1. 변경 사유를 `scientific` / `bugfix` / `data_contract` 중 하나로 분류
2. 변경 전/후 식 차이(diff)와 영향을 채널별로 문서화
3. `formula_version` 증가
4. 변경 전 버전으로 재실행 결과를 부록에 병기
5. 변경 로그를 `docs/registry/REGISTRY.md`에 기록

## 5) 심사 대응용 최소 증거
1. 차원 일관성 점검 표
2. 극한 거동 점검(`x->0`, `x->inf`, 저에너지/고에너지)
3. 파라미터 민감도 분석
4. 독립 재현자(내부 팀 외) 재실행 로그 1건 이상
5. 부정 결과(표준 우세/동률/판정불가) 포함 보고

## 6) 운영 게이트 (Go/No-Go)
다음 조건을 모두 만족해야 논문 제출 단계로 진행한다.
1. 고정 해시 일치(`prediction_lock_sha256`, manifest sha256)
2. 동일 입력 재실행 시 출력 불일치율 0%
3. 채널별 식 문서에 근거 문헌 누락 0건
4. 표준식/SALT식 적용 범위 불일치 0건
5. 통계 규약 위반 0건

