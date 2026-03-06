# SALT Verification Console MVP Plan

최종 업데이트: `2026-03-06`

## 제품 정의
- 목적: SALT 예측, 공개 데이터, 표준 모델 대비 차이, 반증 기준을 한 콘솔에서 검증 가능 형태로 공개
- 제품명: `SALT Verification Console`
- 원칙:
  - 사전예측 고정 우선
  - 재현 가능한 사전계산 결과(JSON/CSV) 우선
  - 표준 vs SALT 비교 시각화 우선

## MVP 범위
- `/` 홈
- `/evidence`
- `/events`
- `/method`
- `/limits`
- `/api/live/snapshot` (데이터 스냅샷 조회 API)

## 핵심 예측(초기 2개)
- `P-001` 시간 지연-적색편이 공통 원인
- `P-002` 고주파/고에너지 잔차 후보

## 현재 진행 현황 요약 (2026-03-06 기준)
- 제품 방향: 설명형 콘솔 -> `증거 중심(Evidence-first)` 검증 콘솔로 전환 완료
- 데이터 모델: `actual_value`, `standard_fit`, `salt_fit` 3중 비교 구조 1차 반영 완료
- 수집 파이프라인: `GWOSC/GraceDB` 기본 연동 + `GCN/ZTF/HEASARC` 확장 슬롯/파서 준비 완료
- 자동화: `run_realtime_cycle.py` 및 cron 설치 스크립트 제공 완료
- 프런트 핵심 화면: `Home/Evidence/Events/Method/Limits` 5페이지 체계로 정리 완료

### 진행률(실행 관점)
- MVP 코어(비교 시각화/판정/재현 명령): `85%`
- 운영 자동화(주기 수집/배포 연계): `60%`
- 데이터 소스 완성도(5개 소스 실수집 안정화): `40%`

## 남은 핵심 작업 (우선순위)
1. GitHub Actions 주기 수집 워크플로우 추가
- [x] `.github/workflows/realtime-update.yml` 작성
- [x] 주기 실행 후 결과 커밋/푸시 정책 확정

2. Vercel 조회 경로 고정
- [ ] Vercel이 최신 `live_snapshot.json`을 안정적으로 읽도록 배포 동작 검증
- [ ] 수집 실패 시 사용자 안내 배너(데이터 지연/오류) 추가

3. 공개 데이터 5소스 실수집 안정화
- [ ] `GWOSC/GraceDB/GCN/ZTF/HEASARC` 실제 응답 포맷 점검 후 파서 튜닝
- [ ] 이벤트 ID 중복/충돌 처리 규칙 고정

4. Evidence 신뢰도 고도화
- [ ] 기간/소스 필터 추가
- [ ] `RMSE/MAE` 수치 카드와 판정 문구 자동 요약 강화

5. 문서/운영 기준 고정
- [ ] 실패 사례 공개 기준(표본 수 하한, 누락 허용치) 명문화
- [ ] 릴리스 체크리스트(수집 성공률, 스냅샷 최신 시각, 빌드 성공) 작성
- [x] MVP 범위에서 관리자 페이지/운영 상세(실패 소스 수·원인) 노출 제외

## To-Do 일정 (운영 전환, 2026-03-07 ~ 2026-03-13)

### 2026-03-07 (토)
- [ ] GitHub 리포지토리 기본 보호 설정 적용 (`main` 브랜치 보호, 강제 푸시 차단)
- [ ] Vercel 프로젝트 import 및 Root Directory를 `web`로 고정
- [ ] 첫 프로덕션 배포 성공 확인 (`/`, `/evidence`, `/events`, `/limits`)

완료 기준:
- `main` 직접 강제 푸시가 차단되고, Vercel 배포 URL에서 핵심 3개 경로가 200 응답

### 2026-03-08 (일)
- [ ] `.github/workflows/realtime-update.yml` 수동 실행(`workflow_dispatch`) 1회 검증
- [ ] 워크플로우 자동 커밋/푸시 권한(`contents: write`) 최종 점검
- [ ] 산출물 3종(`live_events.json`, `svc_realtime.db`, `live_snapshot.json`) 갱신 커밋 확인

완료 기준:
- Actions 성공 1회 + 산출물 갱신 커밋 1회가 `main`에 반영

### 2026-03-09 (월)
- [ ] Vercel 환경에서 `/api/live/snapshot` 최신성 점검
- [ ] 데이터 지연/수집 실패 시 안내 배너 노출 규칙 확정
- [ ] 30분 주기 액션 실행 후 웹 반영 지연 시간 측정

완료 기준:
- 최근 스냅샷 시각이 주기 실행 후 허용 지연(최대 40분) 내 유지

### 2026-03-10 (화)
- [ ] 공개 데이터 5소스(`GWOSC/GraceDB/GCN/ZTF/HEASARC`) 응답 포맷 실측 검증
- [ ] 파서 예외 케이스(빈값/필드 누락/시간 포맷) 보정
- [ ] 이벤트 ID 중복/충돌 처리 규칙 문서화

완료 기준:
- 5소스 모두 파싱 실패율 5% 미만, 중복 규칙 문서 1건 확정

### 2026-03-11 (수)
- [ ] Evidence 페이지 기간/소스 필터 검증 케이스 작성
- [ ] `RMSE/MAE` 카드와 판정 문구 자동 요약 정확성 점검
- [ ] 실패/결측 데이터 fallback 렌더링 테스트

완료 기준:
- 핵심 UI 회귀 항목 10개 이상 통과, 결측 시 화면 깨짐 0건

### 2026-03-12 (목)
- [ ] 릴리스 체크리스트 초안 작성 (`수집 성공률`, `스냅샷 최신 시각`, `빌드 성공`)
- [ ] 실패 사례 공개 기준(표본 수 하한, 누락 허용치) 문구 확정
- [ ] README/로드맵/프로토콜 문서 상호 링크 정리

완료 기준:
- 운영 기준 문서 2건(`릴리스 체크리스트`, `실패 공개 기준`) 머지 가능 상태

### 2026-03-13 (금)
- [ ] 주간 통합 리허설(수집 -> DB 갱신 -> 스냅샷 반영 -> 웹 확인) 1회
- [ ] 장애 시나리오 2건 점검(소스 타임아웃, 일부 소스 500)
- [ ] MVP 운영 전환 승인 메모 작성

완료 기준:
- 리허설 성공 1회 + 장애 시나리오 복구 확인 + 다음 주 운영 계획 확정

## 진행 체크리스트

### Day 1-2 이관/구조화
- [x] `.venv` 생성
- [x] 기본 폴더 구조 생성 (`docs`, `assets`, `data`, `analysis`, `results`, `tools`, `web`)
- [x] 책 md를 `docs/book`로 이관
- [x] 이미지 복사 (`assets/images/public`, `assets/images/graph`)
- [x] 그래프 재생성 코드 복사 (`tools/makegraph`)
- [x] md 이미지 링크 호환 폴더 구성 (`docs/book/Images`)
- [x] 중복 이미지 폴더 정리 (`docs/Images`, `assets/images/Images` 제거)
- [x] 링크 깨짐 검사 완료 (`docs/book/*.md` 기준 missing=0)
- [x] `docs/book/INDEX.md` 작성

### Day 3-4 Prediction Registry 고정
- [x] `docs/predictions/P-001.md` 템플릿 생성
- [x] `docs/predictions/P-002.md` 생성
- [x] `docs/registry/REGISTRY.md` 생성
- [x] P-001/P-002 실제 내용 채우기 (가설/반증/판정규칙/잠금일자)
- [x] REGISTRY 상태 `Draft -> Locked` 전환

### Day 5-6 검증 프로토콜 고정
- [x] `docs/protocols/blind_protocol.md` 생성
- [x] `docs/protocols/stats_protocol.md` 생성
- [x] 블라인드 숨김구간 규칙 확정
- [x] 통계 파라미터 최종 고정 (`alpha`, FDR, 효과크기 기준)

### Day 7-8 데이터 매니페스트
- [x] `data/manifests/ligo_manifest.csv` 생성
- [x] `data/manifests/fermi_manifest.csv` 생성
- [x] `docs/sources/sources.md` 생성
- [x] 출처/버전/접근일 실제 값 채우기

### Day 9-10 분석 파이프라인 v0
- [x] `analysis/ligo` 기준선+잔차 계산 스크립트
- [x] `analysis/fermi` 도달시간 잔차 계산 스크립트
- [x] 결과 산출 포맷 초안 고정 (`data/processed/*.json`, `results/reports/*.csv`)

### Day 11-12 대시보드 v0
- [x] Next.js + TypeScript + Tailwind 초기화
- [x] `/dashboard` 표준 vs SALT 비교 뷰
- [x] 필터(데이터셋/예측/이벤트/기간) 구현
- [x] 결과 다운로드(CSV/JSON) 구현

### Day 13 블라인드 검증
- [x] 사전예측 잠금 후 블라인드 1회 실행
- [x] 평가 리포트 생성 (`results/reports/blind_eval_YYYYMMDD.md`)

### Day 14 데모 패키징
- [x] 루트 `README.md` 실행 순서 1페이지 작성
- [x] 주장-증거-반증 3슬라이드 요약 작성
- [x] 외부 시연용 최소 데이터/결과셋 확정

## 운영 규칙 (지속 점검)
- 협업 실행 원칙: `docs/roadmap/COLLAB_EXECUTION_PROTOCOL.md`
- 작업 완료 시 체크박스 즉시 갱신
- 링크/결과 파일 점검 결과를 아래 로그에 날짜로 기록
- 체크 기준:
  - 문서: 파일 존재 + 필수 섹션 작성
  - 데이터: 매니페스트/출처/버전/접근일 기입
  - 분석: 재실행 시 동일 결과 재현

## Post-MVP 백로그 (우선순위 고정)
- [ ] 로그인/권한 체계 추가
- [ ] 관리자 페이지(수집 실패 소스 수/원인, 배치 상태, 수동 재실행) 추가
- [ ] 사용자 게시판(글쓰기/수정/삭제) 추가
- [ ] 댓글/신고/관리자 moderation 기능 추가
- [ ] DB를 SQLite에서 PostgreSQL로 단계적 전환
- [ ] 게시판 트래픽 기준 인덱스/성능 튜닝

## 점검 로그
- `2026-03-06`: 문서/이미지 이관 완료, 이미지 링크 missing=0 확인, 핵심 템플릿 5종 생성
- `2026-03-06`: P-002 템플릿 생성, 데이터 계약 문서(`docs/method/data_contract.md`) 추가, MVP JSON 샘플(`data/processed`) 생성
- `2026-03-06`: P-001/P-002 잠금 완료, LIGO/FERMI 매니페스트 생성, Next.js 콘솔 라우트(`/predictions`, `/datasets`, `/dashboard`, `/method`, `/roadmap`, `/book`) 구성 및 lint 통과
- `2026-03-06`: `web` 프로덕션 빌드 성공 (`npm run build`), 라우트 정적/동적 생성 확인
- `2026-03-06`: `docs/makegraph` 확인 후 `tools/makegraph`로 복사(실행용 코드 기준 37개 파일)
- `2026-03-06`: `.venv`에 `numpy`, `matplotlib` 설치 후 `tools/makegraph/run_all_graphs.py` 실행 성공(33 scripts, 출력 경로 `tools/graph`)
- `2026-03-06`: makegraph 출력 경로를 `docs/book/graph`로 변경, 기존 `tools/graph` 파일 이동 및 재실행(33 scripts) 검증 완료
- `2026-03-06`: 대시보드 필터(예측/데이터셋/플래그/이벤트 검색) 및 CSV/JSON 다운로드 구현, `npm run lint`/`npm run build` 통과
- `2026-03-06`: `sources.md` 실제 출처값 반영, manifests `source_url` 실URL로 갱신, `results_p2-hf-tail.json` 추가 및 웹 빌드 재검증 통과
- `2026-03-06`: 대시보드 기간(Date From/To) 필터 추가, `analysis/ligo/build_residual_report.py` 및 `analysis/fermi/build_residual_report.py`로 CSV/JSON 재생성 파이프라인 구성
- `2026-03-06`: 블라인드 숨김구간 규칙(70/30, 최신 30% holdout) 및 통계 임계값(`alpha=0.05`, `q<0.10`, `|d|>=0.20`) 고정, Day 13 템플릿(`blind_setup.md`, `blind_eval_YYYYMMDD.md`) 생성
- `2026-03-06`: 블라인드 실행 로그(`repro_run_20260306.txt`) 기록, 평가 리포트(`blind_eval_20260306.md`) 생성, 루트 `README.md`/3슬라이드 요약/데모 최소셋 문서 작성
- `2026-03-06`: 실시간 확장 문서(`SVC_REALTIME_VALIDATION_PLAN.md`) 및 DB 스키마(`realtime_db_schema.sql`) 추가, DB 부트스트랩 스크립트(`tools/realtime/build_realtime_db.py`)와 웹 실시간 검증 화면 골격 구현(현행: `Evidence/Events/Limits`)
- `2026-03-06`: DB 롤링 메트릭(`metric_windows`) 재계산 로직 추가, 라이브 스냅샷 생성 스크립트(`refresh_live_snapshot.py`) 및 API(`/api/live/snapshot`) 구현, 실시간 폴링 UI를 현행 페이지 구조(`Evidence/Events/Limits`)로 이관
- `2026-03-06`: 공개 이벤트 수집기(`collect_public_events.py`, GWOSC/GraceDB 1차) 추가, `events_raw/events_normalized` DB 적재 연동, 통합 실행 스크립트(`run_realtime_cycle.py`) 및 이벤트 테이블 반영(현행: `/events`)
- `2026-03-06`: 사이트 목적 전달 강화 개편 1차 적용(메뉴 단순화: Home/Evidence/Events/Method/Limits, 신규 `/evidence` `/events` `/limits` 페이지 추가, 홈 KPI 중심 재구성)
- `2026-03-06`: 3중 비교 준비 1차 완료(`actual_value`/오차 컬럼 DB 연동, 결과 JSON 확장, Evidence/Events/Limits에서 actual 기반 판정 fallback 적용)
- `2026-03-06`: Evidence 페이지 차트형 개편(필터, Actual/Standard/SALT 3중 라인 비교, 이벤트별 절대오차 막대 비교) 적용
- `2026-03-06`: 공개 수집기 2차 확장(`collect_public_events.py`)으로 `GCN/ZTF/HEASARC` 소스 슬롯 추가(환경변수 URL 기반), 실패 허용형 멀티소스 수집 구조로 전환
- `2026-03-06`: 자동 배치 경로 추가(`tools/realtime/install_cron_cycle.sh`, 10분 주기), `README.md`에 설치/해제 절차 반영
- `2026-03-06`: 계획안 재정렬(현재 MVP 범위를 5페이지+API 기준으로 갱신, 진행률/남은 핵심 작업/GitHub Actions+Vercel 운영 단계 명시)
- `2026-03-06`: GitHub Actions 자동 갱신 워크플로우 추가(`.github/workflows/realtime-update.yml`, 30분 주기 + 수동실행, 결과 산출물 자동 커밋/푸시)
- `2026-03-06`: MVP 범위 조정: 관리자 페이지/운영 상세 지표(실패 소스 수·원인) 노출은 Post-MVP로 이관
