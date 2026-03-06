# SALT Verification Console MVP Plan (v2)

최종 업데이트: `2026-03-07`

## 변경 요약
- 기존 단일 축 계획을 `거시(Cosmic)`/`미시(Micro)` 이중 트랙 계획으로 전환
- 웹 정보구조를 `도메인 탭 + 공통 4페이지(Evidence/Events/Method/Limits)`로 고정
- `Standard` 용어를 도메인별로 분리 고정 (`Cosmic=ΛCDM`, `Micro=SM`)
- 검증 파이프라인을 `수집 -> 정규화 -> 예측계산 -> 통계판정 -> 반증평가`로 통합
- 데이터/식/버전 추적을 위한 `Audit` 운영 페이지를 필수 범위에 포함

## 1) 제품 정의
- 목적: SALT 예측을 공개 데이터와 같은 규칙으로 비교해 재현 가능하게 검증
- 제품명: `SALT Verification Console`
- 운영 원칙:
  - 사전예측 고정 우선
  - 표준이론 대비 SALT 비교를 동일 통계기준으로 판정
  - 성공/실패/동률을 모두 공개

## 2) 표준이론 범위 고정
- `Cosmic` 트랙 표준이론: `ΛCDM (standard cosmology)`
- `Micro` 트랙 표준이론: `SM (Standard Model)`
- 문서/웹에서 단독 `Standard` 표기는 금지하고 도메인 라벨을 병기

## 3) MVP 정보구조 (웹)
- 상위 탭:
  - `Cosmic (ΛCDM)`
  - `Micro (SM)`
- 공통 하위 페이지:
  - `Evidence`
  - `Events`
  - `Method`
  - `Limits`
- 공통 운영 페이지:
  - `Audit` (출처/버전/식/통계 기준/재현 명령)

권장 라우트:
- `/cosmic/evidence`, `/cosmic/events`, `/cosmic/method`, `/cosmic/limits`
- `/micro/evidence`, `/micro/events`, `/micro/method`, `/micro/limits`
- `/audit`

## 4) 공통 데이터 계약
- 핵심 컬럼:
  - `measured_value`
  - `standard_pred`
  - `salt_pred`
  - `standard_error = measured_value - standard_pred`
  - `salt_error = measured_value - salt_pred`
  - `winner = argmin(|standard_error|, |salt_error|)`
- 공통 메타:
  - `domain` (`cosmic`/`micro`)
  - `channel`
  - `formula_version`
  - `dataset_version`
  - `quality_flag`

## 5) 검증 파이프라인
1. 데이터 수집(공개 소스 ingest)
2. 정규화(단위/시간축/오차모델)
3. 표준예측/SALT예측 동시 계산
4. 통계 평가(`MAE`, `RMSE`, `chi2`, `AIC/BIC`, `FDR`)
5. 반증 조건 평가
6. 웹 시각화/리포트 생성

## 6) 도메인별 MVP 범위

### 6.1 Cosmic (즉시 운영)
- 채널: Shapiro, 중력 적색편이, 렌즈 지연, GNSS/GPS, GW-EM
- 현행 페이지 기반 운영: `/evidence`, `/events`, `/method`, `/limits`
- API: `/api/live/snapshot` 및 실시간 산출물 연동 유지

### 6.2 Micro (신규 구축)
- 1차 채널:
  - `muon_g_minus_2`
  - `neutrino_oscillation`
  - `collider_high_pt_tail`
- 원천 데이터:
  - HEPData
  - PDG
  - NuFIT
  - (필요 시) CERN Open Data
- 상태 정책:
  - 관측량별 SALT 예측식 잠금 전: `검증대기`
  - 잠금 후: `검증실행`

## 7) 일정 (운영 전환 + 확장)

### Week 1: 구조 전환
- [ ] `Cosmic/Micro` 탭 및 라우트 분리
- [ ] 공통 데이터 계약 필드 반영
- [ ] `Audit` 페이지 초안 배포

완료 기준:
- 도메인 구분 라우트 접근 가능
- `Standard=ΛCDM/SM` 혼동 문구 0건
Owner:
- Product/Web: jwater + Codex
Deliverable:
- 라우트 구조 반영 PR 1건
- `Audit` 페이지 초안(출처/버전/식 버전/재현 커맨드 표시)
Dependency:
- 기존 `/evidence`, `/events`, `/method`, `/limits` 페이지 안정 동작
Exit Criteria:
- `/cosmic/*`, `/micro/*` 경로에서 404 없이 기본 렌더
- 네비게이션에서 도메인 전환 가능

### Week 2: Micro 데이터 파이프라인
- [ ] 미시 ingest 스크립트(HEPData/PDG/NuFIT) 추가
- [ ] 미시 스코어 테이블 구축
- [ ] 미시 Evidence/Events 초기 시각화

완료 기준:
- 미시 3채널 중 최소 2채널 데이터 적재 성공
Owner:
- Data/Model: jwater + Codex
Deliverable:
- `micro_*` 스키마 SQL 파일
- 소스별 ingest 스크립트 3종(HEPData/PDG/NuFIT)
- 적재 검증 리포트 1건(row count, 결측률, 버전)
Dependency:
- 원천 데이터 접근 경로/라이선스 확정
- 채널별 관측량 ID 고정
Exit Criteria:
- 미시 3채널 중 최소 2채널 `micro_observations` 적재
- `micro_scores` 샘플 계산 성공

### Week 3: 통계/반증 자동화
- [ ] 채널별 통계판정 자동 계산
- [ ] FDR 포함 다중비교 판정
- [ ] Limits/Audit 연결 강화

완료 기준:
- 채널별 `winner`와 반증 판정 자동 산출
Owner:
- Data/Stats: jwater + Codex
Deliverable:
- 채널별 `chi2`, `RMSE`, `AIC/BIC`, `FDR` 자동 계산 배치
- 반증 판정 규칙 자동 태깅(`verdict`)
- `/micro/limits` 및 `/audit` 연동
Dependency:
- Week 2 ingest 안정화
- SALT 보정항 파라미터 잠금
Exit Criteria:
- 자동 산출 결과 재실행 시 동일(동일 입력 기준)
- 반증 규칙이 리포트에 누락 없이 표시

### Week 4: 문서 동기화
- [ ] 책 챕터 반영(16/17/18/20/24/26)
- [ ] 운영 문서와 웹 용어 완전 동기화

완료 기준:
- 책/웹/로드맵 간 용어/식 버전 불일치 0건
Owner:
- Docs/QA: jwater + Codex
Deliverable:
- 책 챕터 수정 커밋
- 문서-웹 용어 매핑표
- 최종 운영 체크리스트
Dependency:
- Week 1~3 산출물 확정
Exit Criteria:
- `Standard` 표기 충돌 0건
- `formula_version`, `dataset_version` 참조 경로 일치

## 7.1) Go / No-Go 체크포인트

### Gate A (Week 1 종료)
- Go: 도메인 라우트(`/cosmic/*`, `/micro/*`)와 `Audit` 기본 렌더 확인
- No-Go 조건:
  - 라우트 오류율 > 5%
  - 용어 충돌(`Standard` 단독 표기) 3건 이상

### Gate B (Week 2 종료)
- Go: 미시 3채널 중 최소 2채널 ingest 성공
- No-Go 조건:
  - 데이터 적재 실패율 > 20%
  - 소스 라이선스/버전 추적 누락

### Gate C (Week 3 종료)
- Go: 채널별 자동 판정 + 반증 태깅 자동화 완료
- No-Go 조건:
  - 동일 입력 재실행 결과 불일치
  - FDR/통계 출력 누락

### Gate D (Week 4 종료)
- Go: 문서/웹/로드맵 동기화 완료 후 운영 전환
- No-Go 조건:
  - 식 버전/데이터 버전 참조 불일치
  - 실패 사례 공개 누락

## 8) 반증 기준(공통)
- 단일 파라미터 세트로 다중 데이터셋 동시 적합 실패 시 해당 가설 기각
- SALT 우세 판단은 효과크기 + 유의성 동시 충족이 필요
- 유리한 구간만 선택 보고하는 행위를 금지(실패 구간 동시 공개)

## 9) 리스크 및 대응
- 데이터 라이선스/재배포 제한: 소스별 라이선스 필드 강제
- 미시 데이터 스케일/복잡도: 원시 이벤트 대신 요약 관측치 우선
- 과장 해석 위험: `검증됨/가설/예측` 태그 강제
- 문서-코드 불일치: `formula_version`/`dataset_version` 추적 강제

## 10) 완료 정의 (DoD)
- `Cosmic`/`Micro` 각각에서 Evidence/Events/Method/Limits 동작
- `Audit`에서 출처/버전/식/통계기준 추적 가능
- 동일 규칙으로 Standard vs SALT 비교 재현 가능
- 실패 사례 공개 포함

## 11) 미시 채널 상세 범위 (고정)
1. `muon_g_minus_2`
2. `neutrino_oscillation` (\(\theta_{23}\), \(\Delta m^2_{32}\) 중심)
3. `collider_high_pt_tail` (\(d\sigma/dX\), \(X=p_T\) 또는 \(m_{jj}\))

## 12) 미시 원천 데이터 소스 (권장 조합)
1. HEPData: 충돌기 분포/오차표
2. PDG: SM 기준값/세계평균 기준 테이블
3. NuFIT: 중성미자 글로벌 핏 값/구간
4. (선택) CERN Open Data: 원시 이벤트가 필요할 때만

## 13) 미시 DB 스키마 (핵심 테이블)
1. `micro_sources`  
`source_id, provider, dataset_ref, url, license, version_tag, fetched_at_utc`
2. `micro_observations`  
`obs_id, channel, observable_id, dataset_id, x_value, measured_value, stat_err, sys_err, cov_group, unit, observed_at_utc`
3. `micro_sm_predictions`  
`pred_id, observable_id, dataset_id, x_value, sm_pred, sm_pred_err, sm_model_ref`
4. `micro_salt_predictions`  
`salt_pred_id, observable_id, dataset_id, x_value, salt_pred, alpha_micro, beta_micro, gamma_micro, formula_version`
5. `micro_scores`  
`score_id, observable_id, dataset_id, x_value, res_sm, res_salt, pull_sm, pull_salt, winner, computed_at_utc`
6. `micro_fit_runs`  
`run_id, channel, fit_scope, params_json, chi2_sm, chi2_salt, aic_sm, aic_salt, bic_sm, bic_salt, fdr_q, verdict`
7. `micro_artifacts`  
`artifact_id, run_id, plot_type, path, sha256, created_at_utc`

## 14) 미시 검증식 잠금 템플릿
공통 정의:
\[
res_{SM}=O_{meas}-O_{SM},\quad
res_{SALT}=O_{meas}-O_{SALT},\quad
winner=\arg\min(|res_{SM}|,|res_{SALT}|)
\]

뮤온 g-2:
\[
a_\mu=(g-2)/2,\quad
a_\mu^{SALT}=a_\mu^{SM}+\Delta a_\mu^{SALT}(\alpha_\mu,\beta_\mu,\ldots)
\]

중성미자 진동:
\[
P^{SALT}_{\alpha\to\beta}=P^{SM}_{\alpha\to\beta}+\Delta P_{SALT}(L,E;\alpha_\nu,\beta_\nu,\ldots)
\]
또는
\[
\theta_{23}^{SALT}=\theta_{23}^{SM}+\delta\theta_{23}^{SALT},\quad
(\Delta m^2_{32})^{SALT}=(\Delta m^2_{32})^{SM}+\delta(\Delta m^2)^{SALT}
\]

충돌기 고-\(p_T\) 꼬리:
\[
\left(\frac{d\sigma}{dX}\right)_{SALT}=\left(\frac{d\sigma}{dX}\right)_{SM}\cdot\left[1+\kappa\left(\frac{X}{X_0}\right)^q\right]
\]

## 15) 미시 통계/반증/시각화 기준
- 채널별 기본 통계: \(\chi^2\), RMSE, AIC/BIC
- 다중비교: Benjamini-Hochberg FDR
- 반증 조건: 단일 파라미터 세트로 3개 이상 독립 데이터셋 동시 적합 실패 시 해당 채널 기각
- 웹 시각화 라우트:
  - `/micro/overview`
  - `/micro/muon-g2`
  - `/micro/neutrino`
  - `/micro/collider`

## 16) 미시 구현 실행 순서
1. 데이터 수집 스크립트: HEPData/PDG/NuFIT ingest
2. 스키마 생성 + raw 적재
3. SM 기준값 고정
4. SALT 보정항 파라미터 잠금
5. 채널별 피팅 + 점수 계산
6. 시각화 아티팩트 생성
7. 웹 페이지 연결 + 최종 판정 리포트

## 17) 이번 주 실행 TODO Top 5
1. `micro_*` SQL 스키마 파일 확정 및 커밋
2. HEPData/PDG/NuFIT ingest 최소 동작 버전 구현
3. `/micro/overview` 페이지 골격 + 데이터 바인딩
4. 통계 계산 배치(`chi2`, `RMSE`, `AIC/BIC`, `FDR`) 1차 구현
5. `Audit` 페이지에 `formula_version`/`dataset_version` 노출
