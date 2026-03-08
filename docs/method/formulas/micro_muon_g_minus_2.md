# Formula Derivation: Micro / muon_g_minus_2

최종 업데이트: `2026-03-09`

## 0) 메타데이터
- Domain: `micro`
- Channel ID: `muon_g_minus_2`
- Observable(s): `a_mu = (g-2)/2`
- Unit: dimensionless
- Engine Version (frozen eval): `micro-sm-submission-candidate-v1`, `micro-salt-submission-candidate-v1`
- Formula Version (frozen eval):
  - `micro-sm-submission-candidate-v1` (SM)
  - `micro-salt-submission-candidate-v1` (SALT)
- Decision Rule Version: `micro-decision-v3`

## 1) 관측량 정의
- 관측량 수학적 정의: `a_mu = (g_mu - 2)/2`
- 측정 방식: storage-ring 기반 precession frequency 측정치 사용
- 허용 소스: PDG(세계평균), Fermilab muon g-2 결과 레퍼런스
- 품질 게이트:
  - source URL/버전 태그 필수
  - 오차(`stat_err`, `sys_err`) 누락 시 제외

## 2) 표준이론 예측식 (SM)
### 2.1 출발식
- 분해:
  - `a_mu^SM = a_mu^QED + a_mu^EW + a_mu^HVP + a_mu^HLbL`
- 1차 근거 문헌(예시):
  - Muon g-2 Theory Initiative White Paper (2020), doi:10.1016/j.physrep.2020.07.006
  - PDG review (최신판 기준, 제출 시 연도/버전 고정 필요)

### 2.2 유도 단계 (submission target)
1. 항별 계산 입력(상수/적분 커널/데이터 기반 항) 명시
2. 항별 중심값과 불확실도 결합 방식 정의
3. 최종 `a_mu^SM` 및 `σ_SM` 산출
4. 실험값과 잔차:
   - `Δa_mu,SM = a_mu^obs - a_mu^SM`

### 2.3 적용 범위/한계
- hadronic 항(HVP/HLbL) 입력 데이터셋 선택 민감도 존재
- lattice 기반 결과와 dispersion 기반 결과를 혼용할 경우 규칙 사전고정 필요

## 3) SALT 예측식
### 3.1 출발식
- 목표 형태:
  - `a_mu^SALT = a_mu^SM + Δa_mu^SALT(θ_SALT)`
- `Δa_mu^SALT`는 SALT 유효 상호작용 항으로부터 유도해야 하며, 단순 상수 보정으로 제출하면 비판 위험 큼

### 3.2 유도 단계 (submission target)
1. SALT 유효 라그랑지안(또는 동등 기술) 명시
2. loop/order 수준에서 `a_mu` 기여항 도출
3. renormalization 조건과 cutoff 의존성 정리
4. 최종 observable:
   - `Δa_mu,SALT = a_mu^obs - a_mu^SALT`

### 3.3 적용 범위/한계
- EFT 해석이면 유효 에너지 범위 명시 필수
- 신규 파라미터는 다른 micro 채널과 공유 가능한지 검토 필요

## 4) 동등 비교 조건
- 동일 관측값(`a_mu^obs`)과 동일 오차모델 사용
- 동일 판정 규약(alpha/FDR/effect size/tie)
- 예측식은 payload 주입 금지, predictor 엔진 산출만 허용

## 5) 차원/극한 점검
- [ ] `a_mu`가 무차원량인지 최종식 단위 확인
- [ ] SALT 보정항이 `a_mu` 스케일에서 자연스러운 크기인지 점검
- [ ] 파라미터 극한(`θ_SALT -> 0`)에서 SM으로 연속 복귀하는지 확인

## 6) 파라미터 정책
- SM 항: 문헌 고정값 테이블을 버전으로 잠금
- SALT 항: 사전고정된 최소 파라미터 세트만 사용
- 채널별 임의 재피팅 금지 (prereg protocol 준수)

## 7) 구현 매핑
- 현재 코드(제출 후보): `tools/predictors/micro_sm_predict.py`, `micro_salt_predict.py`
- 상수 파일: `tools/predictors/muon_gm2_constants.json`
- 계약: `docs/method/prediction_contract.json`
- 재실행:
  - `.venv/bin/python tools/micro/run_micro_predictors.py`
  - `.venv/bin/python tools/micro/run_micro_stats.py`

## 8) 심사 대응 핵심
- 리뷰어 예상 비판:
  - “SM 기준값 선택 편향”
  - “SALT 보정항 임의성”
- 대응 증거:
  - SM 항목별 기여 분해표와 문헌 매핑
  - SALT 보정항의 유도 경로(작용/대칭/차원/루프차수)
  - `θ_SALT -> 0` 한계에서 SM 복귀 증명
