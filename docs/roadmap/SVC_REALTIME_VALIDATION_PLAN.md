# SVC Realtime Validation Plan (v0.1)

최종 업데이트: `2026-03-06`

## 1) 목표
- 공개 영상(예: LIGO/Fermilab 관련 공식 스트림)과 공개 데이터 피드를 같은 화면에서 노출
- 동일 입력 기준으로 `Standard Baseline` vs `SALT`를 동시 계산
- 비교 결과를 DB에 누적하고 웹에서 실시간/준실시간 시각화
- 성공/실패 사례를 모두 공개하여 선택 편향을 방지

## 2) 핵심 원칙
- 사전 등록된 지표만 사용 (중간 변경 금지)
- 데이터 수집 시각, 소스 URL, 버전/해시를 기록
- 결론 문구 자동화 금지: 지표 수치와 판정 규칙만 자동 표시
- 라이선스/이용약관 위반 가능 소스는 제외

## 3) 시스템 아키텍처
- `Collector`: 소스별 수집기 (영상 메타데이터, 이벤트 피드, 관측 데이터 파일)
- `Normalizer`: 단위/시간축/결측/품질 플래그 정규화
- `Scoring`: Standard/SALT 동시 실행 및 오차 계산
- `Store`: SQLite(Postgres 전환 가능)로 원본/정규화/평가 분리 저장
- `API`: 웹 대시보드용 조회 API (`/api/live/*`)
- `Web`: 라이브 스트림 + 이벤트 타임라인 + 모델 비교 차트

## 4) 데이터 소스 계층 (MVP)
- 영상:
  - LIGO/Fermilab 공식 채널 임베드 URL
  - 상태값(`online/offline/unknown`)과 마지막 확인 시각 저장
- 데이터:
  - 현재 저장소의 `data/manifests/*.csv`, `data/processed/results_*.json` 우선 사용
  - 이후 소스별 자동 수집기로 확장

## 5) DB 설계 요약
- `stream_sources`: 스트림 정의/상태
- `stream_status_log`: 상태 변경 이력
- `events_raw`: 원본 이벤트
- `events_normalized`: 정규화 이벤트
- `model_scores`: Standard/SALT 비교 점수
- `metric_windows`: 시간창(5m/1h/1d) 집계 메트릭

세부 SQL: `docs/method/realtime_db_schema.sql`

## 6) 평가 지표 (고정)
- `MAE`, `RMSE`: 예측 오차
- `DeltaFit = mean(salt_fit - standard_fit)`: 평균 우위 방향
- `HitRate@threshold`: 임계치 이상 이벤트 포착률
- `Coverage`: 유효 샘플 비율

## 7) 웹 화면 구성
- `/live`:
  - 상단: 공식 스트림 2~4개 임베드 + 소스/상태/갱신 시각
  - 중단: 최근 이벤트 타임라인
  - 하단: Standard vs SALT 롤링 성능(1h/24h/7d)
- `/dashboard`:
  - 기존 필터 유지 + `window`, `source`, `quality_flag` 추가

## 8) 구현 단계 (2주)
1. Day 1-2: DB 스키마 고정, 수집 스크립트 골격 추가
2. Day 3-4: 기존 JSON/CSV를 DB로 적재하는 배치 구현
3. Day 5-6: `/live` 페이지(스트림+기초 요약) 구현
4. Day 7-8: 롤링 집계 및 비교 API 구현
5. Day 9-10: 대시보드 차트 연동 및 필터 확장
6. Day 11-12: 재현성 테스트/리포트 자동 생성
7. Day 13-14: 데모 시나리오 확정, 주장-근거-한계 문구 고정

## 9) 리스크와 완화
- 스트림 오프라인: 다중 소스 + 상태 명시
- 데이터 지연: `observed_at` vs `ingested_at` 분리 저장
- 과장 해석: 자동 결론 금지, 실패 구간 동시 노출
- 라이선스 문제: 소스별 이용조건 체크리스트 의무화

## 10) 즉시 실행 항목
- [x] 설계 문서 작성
- [x] DB 스키마 초안 작성
- [x] DB 초기 적재 스크립트 추가
- [x] `/live` 페이지 골격 추가
- [x] API 실시간 수집기 연동 (GWOSC/GraceDB 1차)
- [x] 롤링 메트릭 자동 배치 (cron 설치 스크립트 제공)

## 11) Post-MVP 확장 계획
- 원칙: MVP 검증(데이터 수집/비교/시각화) 완료 전에는 커뮤니티 기능을 붙이지 않음

### Phase A (MVP 고도화)
- 공개 데이터 소스 자동 수집기 안정화 (`GWOSC`, `GraceDB`, `GCN`, `ZTF(IRSA)`, `HEASARC`)
- 실제값(actual) vs 표준모형 예측 vs SALT 예측 3중 비교 차트 완성
- 이벤트별 검증 리포트 자동 생성

### Phase B (사용자 기능)
- 로그인/권한 모델 도입 (운영자, 일반 사용자)
- 게시판(글쓰기/수정/삭제), 댓글, 신고 기능 추가
- 기본 감사 로그(작성자, 작성시각, 수정이력) 적용

### Phase C (DB 개편)
- SQLite -> PostgreSQL 전환
- 마이그레이션 스크립트 및 백업/복구 절차 작성
- 게시판 트래픽 기준 인덱스/쿼리 튜닝
