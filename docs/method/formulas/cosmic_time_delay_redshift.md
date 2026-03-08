# Formula Derivation: Cosmic / time_delay_redshift

최종 업데이트: `2026-03-09`

## 0) 메타데이터
- Domain: `cosmic`
- Channel ID: `time_delay_redshift`
- Observable(s): 도달시간 지연 `Δt`, 적색편이 `z`
- Unit: `s`, `dimensionless`
- Engine Version (frozen eval): `cosmic-sm-submission-candidate-v1`, `cosmic-salt-submission-candidate-v1`
- Formula Version (frozen eval): `cosmic-sm-submission-candidate-v1`, `cosmic-salt-submission-candidate-v1`
- Decision Rule Version: `micro-decision-v3` + cosmic 공통 규약(로드맵 기준)

## 1) 관측량 정의
- 관측량 수학적 정의:
  - `Δt_obs = t_arrival(EM) - t_arrival(ref)`
  - `z = (λ_obs - λ_emit) / λ_emit`
- 측정 방식:
  - 공개 카탈로그(GWOSC/GraceDB/HEASARC/GCN)의 이벤트 타임스탬프, 메타데이터 사용
- 허용 데이터 소스:
  - GraceDB, GCN, HEASARC (프로젝트 채택 소스)
- 품질 게이트:
  - timestamp/uncertainty 결측 제거
  - source provenance 미기록 데이터 제외

## 2) 표준이론 예측식 (ΛCDM/GR)
### 2.1 출발식
- 이론 배경: GR(중력 퍼텐셜 경로지연), FRW 우주론(적색편이-거리 관계)
- 1차 근거 문헌:
  - I. I. Shapiro, *Phys. Rev. Lett.* 13, 789 (1964), doi:10.1103/PhysRevLett.13.789
  - D. E. Holz & S. A. Hughes, *ApJ* 629, 15 (2005), doi:10.1086/431341
  - Planck 2018 cosmological parameters, doi:10.1051/0004-6361/201833910

### 2.2 유도 단계 (submission target)
1. 배경 시공간과 광선/파동 경로를 GR/FRW에서 정의
2. 경로 적분형 지연항(Shapiro-like)과 우주론적 지연항 분리
3. 관측 가능한 `Δt_pred,ΛCDM(z, ... )`로 투영
4. 단위/좌표계/관측 프레임 변환 명시

### 2.3 적용 범위/한계
- 강한 lensing/복수 경로 해석 불확실성이 큰 이벤트는 제외 또는 별도 태그
- EM counterpart 연계 신뢰도 낮은 이벤트는 `inconclusive`

## 3) SALT 예측식
### 3.1 출발식
- SALT 기본 가정: 공간 매질(격자/밀도구배)로부터 유효 전파속도 보정항이 생김
- 현재 상태: 내부 백서 기반의 유효항 후보만 정리됨 (완전 유도식 미고정)

### 3.2 유도 단계 (submission target)
1. SALT 유효 작용(또는 등가 공리계)에서 전파방정식 정의
2. 저에너지/관측 스케일에서의 유효 지연항 `Δt_SALT` 도출
3. 표준식과 동일 observable 기준으로
   - `Δt_pred,SALT = Δt_pred,ΛCDM + δt_SALT(ρ, E, L, θ; θ_SALT)`
4. `θ_SALT`의 물리적 의미/단위/사전고정 규칙 명시

### 3.3 적용 범위/한계
- 현재 저장소의 `cosmic_*_predict.py`는 **submission-candidate-v1 구현**이며, 최종 논문 제출 전에는 파라미터/유도근거 동결이 필요함
- 본 문서의 목적은 “제출용 식 도출 요구사항”을 고정하는 것

## 4) 동등 비교 조건
- 동일 입력 이벤트셋, 동일 시간 기준(UTC), 동일 불확실도 결합 규칙
- 동일 판정 규약(alpha/FDR/effect size/tie)
- 표준식/SALT식 모두 데이터 후행 튜닝 금지(prereg 규약)

## 5) 차원/극한 점검 (체크포인트)
- [ ] `Δt` 식의 최종 단위가 초(`s`)인지 검증
- [ ] `z -> 0` 극한에서 지연 항의 해석 가능성
- [ ] 고적색편이 영역에서 근사 유효범위 명시

## 6) 파라미터 정책
- 표준(ΛCDM) 파라미터: Planck 기준 고정값 세트 사용
- SALT 파라미터: 채널 공통 파라미터 우선, 채널별 임의 파라미터 추가 금지

## 7) 구현 매핑
- 현재 코드(제출 후보): `tools/predictors/cosmic_sm_predict.py`, `cosmic_salt_predict.py`
- 관측 피처 sidecar: `data/processed/cosmic_observation_features.json`
- 계약: `docs/method/prediction_contract.json`
- 재실행:
  - `.venv/bin/python tools/evaluation/run_model_eval.py`

## 8) 심사 대응 핵심
- 리뷰어 예상 비판: “SALT식이 현상론적 보정항에 불과하다”
- 대응 증거:
  - 유도 단계(작용 -> 운동방정식 -> observable) 문서화
  - 차원/극한/민감도 분석 표
  - prereg 고정 및 amendment 로그
