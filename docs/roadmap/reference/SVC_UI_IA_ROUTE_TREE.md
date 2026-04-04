# SVC UI IA + Route Tree (Cosmic/Micro/Audit)

최종 업데이트: `2026-03-08`

## 1) 목표
- 페이지 수가 늘어나도 UI가 구조적으로 유지되도록, 고정된 정보구조(IA)와 라우트 규칙을 정의한다.
- ERD(거시/미시)와 웹 페이지를 1:1에 가깝게 연결한다.

## 2) 최상위 IA (고정)
- `Cosmic (ΛCDM)`
- `Micro (SM)`
- `Audit`

상단 글로벌 네비는 위 3개만 노출한다.

## 3) 도메인 공통 하위 IA (고정)
- `Evidence`
- `Events`
- `Method`
- `Limits`

규칙:
- `Cosmic`과 `Micro`는 동일한 하위 4페이지 구조를 유지한다.
- 세부 채널 페이지는 하위 페이지 내부에서만 확장한다.

## 4) Route Tree (권장)
```text
/
├─ /cosmic
│  ├─ /cosmic/evidence
│  ├─ /cosmic/events
│  ├─ /cosmic/method
│  ├─ /cosmic/limits
│  ├─ /cosmic/channels
│  │  ├─ /cosmic/channels/shapiro-delay
│  │  ├─ /cosmic/channels/gravitational-redshift
│  │  ├─ /cosmic/channels/lensing-delay
│  │  ├─ /cosmic/channels/gnss-gps
│  │  └─ /cosmic/channels/gw-em
│  └─ /cosmic/overview
├─ /micro
│  ├─ /micro/evidence
│  ├─ /micro/events
│  ├─ /micro/method
│  ├─ /micro/limits
│  ├─ /micro/channels
│  │  ├─ /micro/channels/muon-g2
│  │  ├─ /micro/channels/neutrino-oscillation
│  │  └─ /micro/channels/collider-high-pt-tail
│  └─ /micro/overview
└─ /audit
   ├─ /audit/sources
   ├─ /audit/datasets
   ├─ /audit/formulas
   ├─ /audit/runs
   └─ /audit/reproduce
```

## 5) 화면 책임 분리 (Page Responsibility)

### 5.1 Evidence
- 목적: `measured vs standard vs SALT` 비교와 잔차 분포/승률 제공
- 핵심 뷰:
  - 3중 비교 라인/스캐터
  - residual distribution
  - winner split

### 5.2 Events
- 목적: 이벤트/관측치 단위 원자료와 정규화/스코어를 조회
- 핵심 뷰:
  - Raw table
  - Normalized table
  - Score table

### 5.3 Method
- 목적: 채널별 예측식, 파라미터, 통계 기준, 반증 규칙 명시
- 핵심 뷰:
  - 공통 판정식
  - 채널별 식/파라미터
  - alpha/FDR/effect size 기준

### 5.4 Limits
- 목적: SALT 우세뿐 아니라 표준 우세/동률/실패 사례 공개
- 핵심 뷰:
  - falsification checklist
  - rejected/hold 사례 목록
  - 기준 미충족 사유

### 5.5 Audit
- 목적: 재현성과 버전 추적의 단일 진실원천
- 핵심 뷰:
  - `dataset_version`, `formula_version`, `decision_rule_version`
  - source URL/license/version
  - run manifest + rerun command + artifact hash

## 6) ERD ↔ UI 매핑

### 6.1 Cosmic
- `stream_sources`, `stream_status_log` -> `/cosmic/events` (source 상태 탭)
- `events_raw` -> `/cosmic/events` Raw 탭
- `events_normalized` -> `/cosmic/events` Normalized 탭
- `model_scores` -> `/cosmic/evidence`, `/cosmic/events`, `/cosmic/limits`
- `metric_windows` -> `/cosmic/evidence` 요약 지표

### 6.2 Micro
- `micro_sources` -> `/audit/sources`, `/micro/events`
- `micro_observations` -> `/micro/events`
- `micro_sm_predictions`, `micro_salt_predictions` -> `/micro/evidence`, `/micro/method`
- `micro_scores` -> `/micro/evidence`, `/micro/limits`
- `micro_fit_runs` -> `/micro/limits`, `/audit/runs`
- `micro_artifacts` -> `/micro/channels/*`, `/audit/reproduce`

## 7) 네비게이션 규칙
- 상단 1차 탭: `Cosmic | Micro | Audit`
- 도메인 내부 2차 탭: `Evidence | Events | Method | Limits`
- 3차(세부) 내비는 `channels` 하위에서만 노출
- 모든 페이지 상단에 현재 컨텍스트 배지 표기:
  - `Domain: cosmic|micro`
  - `Standard: ΛCDM|SM`
  - `Decision Rule Version`

## 8) 용어/판정 표기 규칙
- 거시 문맥: `Standard = ΛCDM`
- 미시 문맥: `SM` 명시, `Standard` 단독 표기 금지
- 공통 판정식 표기는 전 페이지에서 동일 텍스트/수식 컴포넌트 재사용

## 9) 최소 구현 순서 (권장)
1. 라우트 골격 생성: `/cosmic/*`, `/micro/*`, `/audit/*`
2. 상단/2차 네비 컴포넌트 공통화
3. Cosmic 데이터 바인딩 이전 + 탭 구조 정렬
4. Audit 최소 카드(`sources/datasets/formulas/runs/reproduce`) 구현
5. Micro `검증대기` 상태 페이지 + 채널 placeholder 구현

## 10) 상태 정책
- `Cosmic`: 기본 `검증실행`
- `Micro`: 예측식 잠금 전 `검증대기`, 잠금 후 `검증실행`
- 상태는 페이지 헤더와 Audit에 동시에 표시한다.
