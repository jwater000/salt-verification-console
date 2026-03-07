# SALT Verification Console MVP Plan (v2)

최종 업데이트: `2026-03-08`

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
- `/micro/overview`, `/micro/muon-g2`, `/micro/neutrino`, `/micro/collider` (세부 페이지)
- `/audit`

## 4) 공통 데이터 계약
- 핵심 컬럼:
  - `measured_value`
  - `standard_pred`
  - `salt_pred`
  - `total_err = sqrt(stat_err^2 + sys_err^2)` (없으면 `stat_err` 우선)
  - `standard_error = measured_value - standard_pred`
  - `salt_error = measured_value - salt_pred`
  - `winner = argmin(|standard_error/total_err|, |salt_error/total_err|)`
  - `winner_tie = 1 if ||standard_error|-|salt_error|| <= tie_eps`
- 공통 메타:
  - `domain` (`cosmic`/`micro`)
  - `channel`
  - `formula_version`
  - `dataset_version`
  - `quality_flag`
  - `decision_rule_version`

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
- [x] `Cosmic/Micro` 탭 및 라우트 분리
- [x] 공통 데이터 계약 필드 반영
- [x] `Audit` 페이지 초안 배포

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
- [x] 미시 ingest 스크립트(HEPData/PDG/NuFIT) 추가
- [x] 미시 스코어 테이블 구축
- [x] 미시 Evidence/Events 초기 시각화

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
- [x] 채널별 통계판정 자동 계산
- [x] FDR 포함 다중비교 판정
- [x] Limits/Audit 연결 강화

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
- [x] 책 챕터 반영(16/17/18/20/24/26)
- [x] 운영 문서와 웹 용어 완전 동기화

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

### Week 5: 평가/모니터링 분리 + Frozen 평가기반 확정
- [x] Evaluation/Monitoring 라우트 분리
- [x] frozen dataset 워크플로우(`data/frozen/current`) 연결
- [x] 미시 판정 규칙 v2(`min_n_obs`, `verdict_reason`) 반영
- [ ] 거시 frozen 표본 확장(평가용 이벤트 수 증대)
- [ ] 미시 채널별 독립 표본 확장(`muon>=3`, `neutrino>=3`, `collider>=20`)
- [ ] real-only 평가 모드 도입(`quality_flag=real` 기본 집계)
- [ ] Vercel 프로덕션 도메인 `salt.numverse.org` 연결 및 DNS 검증
- [ ] 책/부록의 관련 페이지에 공식 도메인(`salt.numverse.org`) 안내 문구 반영
- [ ] 웹사이트 개편(Evaluation/Monitoring 분리) 기준으로 책 원고 `00~28` 전수 점검 및 동기화 수정

완료 기준:
- Evaluation 페이지는 frozen 입력만 사용
- Monitoring 페이지는 실시간 후속검증만 담당
- 미시 채널 `insufficient_data` 비율을 단계적으로 축소
Owner:
- Data/Web: jwater + Codex
Deliverable:
- frozen manifest + 해시 추적 리포트
- 표본 확장 ingest 결과 리포트(채널별 n_obs, 결측률, 독립성)
- real-only 집계 옵션/기본값 반영
Dependency:
- 소스 접근성/라이선스 점검(HEPData/PDG/NuFIT)
- 채널별 독립성 메타(`dataset_group`, 실험/기간 구분)
Exit Criteria:
- 거시/미시 모두 frozen 입력 기준 재현성 100%
- 미시 채널 최소 표본 기준 충족(`n_obs` gate 통과)

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
- 기본 판정 임계값(초기 고정):
  - `alpha = 0.05` (양측)
  - `FDR q <= 0.10` 통과
  - 효과크기: `delta_rmse = (RMSE_SM - RMSE_SALT) / RMSE_SM >= 0.05`
  - 동률 기준: `tie_eps = 0.1` (정규화 잔차 단위)
- 최종 `winner` 규칙:
  - 유의성 미충족 또는 `delta_rmse < 0.05`면 `tie`
  - 조건 충족 시에만 `SALT` 또는 `SM` 승리 태깅

## 9) 리스크 및 대응
- 데이터 라이선스/재배포 제한: 소스별 라이선스 필드 강제
- 미시 데이터 스케일/복잡도: 원시 이벤트 대신 요약 관측치 우선
- 과장 해석 위험: `검증됨/가설/예측` 태그 강제
- 문서-코드 불일치: `formula_version`/`dataset_version` 추적 강제
- 라이선스/접근 실패 대응:
  - 소스 unusable 시 `blocked_by_license` 상태로 즉시 전환
  - 동일 관측량 대체 소스가 있으면 1회 대체 시도 후 기록
  - 48시간 내 대체 불가 시 해당 채널은 `No-Go` 후보로 승격

## 10) 완료 정의 (DoD)
- `Cosmic`/`Micro` 각각에서 Evidence/Events/Method/Limits 동작
- `Audit`에서 출처/버전/식/통계기준 추적 가능
- 동일 규칙으로 Standard vs SALT 비교 재현 가능
- 실패 사례 공개 포함
- 재현성 체크리스트 통과:
  - 컨테이너/런타임 이미지 태그 고정
  - 의존성 lock 파일 해시 고정
  - 입력 데이터 스냅샷 해시(`sha256`) 저장
  - 랜덤 시드(`seed`) 및 실행 명령 기록

## 10.1) Gate 측정식(고정)
- Gate A 라우트 오류율 = `5xx_or_404_count / route_request_count`
- Gate B 적재 실패율 = `failed_rows / attempted_rows`
- Gate C 재현 불일치율 = `mismatched_outputs / rerun_outputs`
- 측정 윈도우: 각 주차 종료 전 최근 7일 로그

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
z_{SM}=res_{SM}/\sigma_{tot},\quad
z_{SALT}=res_{SALT}/\sigma_{tot}
\]
\[
winner=\arg\min(|z_{SM}|,|z_{SALT}|),\quad
tie\ if\ ||z_{SM}|-|z_{SALT}||\le tie\_eps
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
  - 요약 허브: `/micro/evidence`, `/micro/events`
  - 세부 페이지: `/micro/overview`, `/micro/muon-g2`, `/micro/neutrino`, `/micro/collider`

## 16) 미시 구현 실행 순서
1. 데이터 수집 스크립트: HEPData/PDG/NuFIT ingest
2. 스키마 생성 + raw 적재
3. SM 기준값 고정
4. SALT 보정항 파라미터 잠금
5. 채널별 피팅 + 점수 계산
6. 시각화 아티팩트 생성
7. 웹 페이지 연결 + 최종 판정 리포트

## 17) 이번 주 실행 TODO Top 5
1. 거시 frozen 평가 표본 확장(현 6건 -> 목표 50+)
2. 미시 `muon_g_minus_2`/`neutrino_oscillation` 독립 표본 3건 이상 확보
3. `quality_flag=real` 전용 평가 집계 경로 추가(기본 ON)
4. frozen manifest 검증 스크립트(해시/파일 누락 검사) 추가
5. Evaluation 최종 리포트 페이지에 `insufficient_data/inconclusive/decisive` 상태 배지 반영

## 17.1) 배포/도메인 TODO
1. Vercel 프로젝트에 `salt.numverse.org` 도메인 추가
2. DNS 레코드(CNAME/A) 검증 및 SSL 발급 확인
3. 기본 리디렉션 정책(`www`/non-`www`) 확정
4. 책의 검증콘솔 안내 섹션(예: 28장 부록)에 공식 접속 도메인 명시

## 17.2) 책 동기화 TODO (00~28)
1. 웹 IA 변경(Evaluation/Monitoring/Audit) 반영 문구를 관련 장(특히 16, 17, 18, 20, 24, 26, 28)에 동기화
2. 기존 `Cosmic/Micro` 설명과 신규 상위 구조(`Evaluation`, `Monitoring`) 관계를 명시
3. 실시간 피드(GraceDB)는 후속검증용, 평가판정은 frozen dataset 기준이라는 정책을 본문에 통일
4. 장별 링크/경로 표기(`/evaluation`, `/monitoring`, `/audit`) 점검 및 업데이트

## 18) 진행 로그 (2026-03-08 기준)
- 완료: Evaluation vs Monitoring 분리 라우트 반영
- 완료: frozen snapshot 생성/로더 우선순위 연결(`data/frozen/current`)
- 완료: 미시 판정 `micro-decision-v2` 적용(`verdict_reason`, `min_n_obs`)
- 진행중: 표본 자체 확장(거시/미시 n_obs 증대)
