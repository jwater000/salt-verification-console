# Evaluation/Monitoring 역할 분리 검수 리포트 (2026-03-08)

## 범위
- 웹 라우트: `/evaluation`, `/monitoring/*`, `/api/live/snapshot`, `/audit/*`
- 데이터 로더: `web/src/lib/data.ts`
- 문서 기준: `docs/roadmap/SVC_MVP_PLAN.md`

## 검수 근거
1. Evaluation 페이지는 frozen 입력만 사용
- 코드: `web/src/app/evaluation/page.tsx`
- 로더 호출: `loadFrozenManifest()`, `loadMicroSnapshot()`
- 목적 문구: "버전 고정된 입력" 명시

2. Monitoring 페이지는 live 입력만 사용
- 코드: `web/src/app/monitoring/page.tsx`
- 로더 호출: `loadLiveSnapshot()`
- 목적 문구: "최종 비교 판정은 Evaluation" 명시

3. 데이터 로더 분리
- 코드: `web/src/lib/data.ts`
- live 계열: `loadLiveSnapshot()` -> `data/processed/live_snapshot.json`
- frozen 계열: `loadFrozenManifest()` / `loadMicroSnapshot()` -> `data/frozen/current/*`

4. 라우트 빌드 검증
- 명령: `npm run build` (workdir=`web`)
- 결과: 성공
- 포함 라우트: `/evaluation`, `/monitoring`, `/monitoring/live`, `/monitoring/followup`, `/monitoring/ingest-health`, `/api/live/snapshot`

## 판정
- TODO `395` (Evaluation/Monitoring 역할 분리 검수): **PASS**
- TODO `396` (도메인 링크/리디렉션/SSL/문서 링크 종합 점검): **PARTIAL**
  - 로컬 확인 가능 항목(문서/라우트/내부 링크)은 점검 가능
  - 외부 확인 필요 항목(도메인 DNS, 리디렉션, SSL 인증서)은 로컬 환경에서 검증 불가

## 후속 필요 작업(외부 환경)
- Vercel 프로젝트 도메인 연결 상태 확인
- DNS 레코드(CNAME/A) 전파 확인
- `https://salt.numverse.org` 및 `www/non-www` 리디렉션 정책 검증
- SSL 인증서 발급/유효기간 확인
