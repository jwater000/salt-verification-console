# Five-Nav Implementation Workboard

기준일: `2026-04-06`

이 문서는 [FIVE_NAV_STORY_REENGINEERING_MASTER_PLAN.md](/home/jwater/Development/salt-verification-console/docs/roadmap/current/FIVE_NAV_STORY_REENGINEERING_MASTER_PLAN.md)과 [FIVE_NAV_STORY_WIREFRAMES.md](/home/jwater/Development/salt-verification-console/docs/roadmap/current/FIVE_NAV_STORY_WIREFRAMES.md)을 실제 구현 작업 단위로 쪼갠 실행 보드다.

운영 원칙:

- 먼저 전면 노출 구조를 맞춘다.
- 그 다음 허브 페이지의 첫 화면을 바꾼다.
- 그 다음 세부 페이지와 커뮤니티를 연결한다.
- 마지막에 DB/Auth/운영 계층을 마무리한다.

## 1. 현재 우선순위

### P0. 독자 노출 구조 고정

- 상단 내비게이션
- 홈 hero
- Guide hero
- Core hero
- Reference hero
- Verification hero

### P1. 스토리 전개 정렬

- 각 허브의 `리드 -> 전개 -> 정리 -> 근거/다음 이동` 구조 정렬
- 기존 카드와 요약 블록 재배치
- CTA 우선순위 정리

### P2. 세부 허브 정렬

- Logic Map
- Book Map
- Verification results / pending / channels
- Audit 첫 화면

### P3. 커뮤니티 정렬

- 게시판 공개 읽기
- 페이지별 댓글 상태 가시화
- OAuth / Neon 연결
- moderation 연결

## 2. 작업 묶음

### Workstream A. 전역 내비게이션

목표:

- 내비만 봐도 `소개 -> 핵심 아이디어 -> 내용 검증 -> 참고자료 -> 게시판` 흐름이 보이게 한다.

대상 파일:

- [site-structure-map.tsx](/home/jwater/Development/salt-verification-console/web/src/components/site-structure-map.tsx)
- [page-map.ts](/home/jwater/Development/salt-verification-console/web/src/lib/page-map.ts)

작업:

- [x] 최상위 라벨을 새 5개 구조에 맞게 교체
- [ ] 드롭다운 내부 링크 설명을 와이어프레임 문장에 맞게 추가 정리
- [x] 모바일 내비에서 라벨 길이와 스캔 순서 재점검
- [x] `게시판`을 최상위 주 메뉴에 넣을지 별도 액션 링크로 둘지 최종 확정

완료 기준:

- 독자가 상단만 보고도 읽는 순서를 짐작할 수 있다

### Workstream B. 소개

목표:

- 홈과 Guide를 `소개` 축으로 묶어 처음 진입의 메시지를 단순화한다.

대상 파일:

- [page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/page.tsx)
- [guide/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/guide/page.tsx)

작업:

- [x] 홈 hero 문장을 입문형으로 재작성
- [x] Guide를 `/` 소개 축으로 통합하고 읽기 순서를 홈에서 설명하도록 정리
- [ ] 홈에서 과도한 결과 카드 비중 축소
- [ ] 홈의 첫 화면 CTA를 `핵심 아이디어` 우선으로 재정렬
- [ ] 소개 축의 목적별 경로 블록을 이야기형 설명에 더 가깝게 재배치

완료 기준:

- 첫 화면 10초 안에 SALT와 읽기 순서를 설명할 수 있다

### Workstream C. 핵심 아이디어

목표:

- Core를 장 인덱스보다 `중심 전개 허브`로 읽히게 만든다.

대상 파일:

- [core/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/core/page.tsx)
- [core/logic-map/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/core/logic-map/page.tsx)
- [core/chapters/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/core/chapters/page.tsx)
- [core/chapters/[chapter]/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/core/chapters/[chapter]/page.tsx)
- [engineering/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/engineering/page.tsx)

작업:

- [x] Core hero를 스토리 전개형으로 재작성
- [x] Logic Map hero와 본문 순서를 와이어프레임에 맞게 재정렬
- [ ] 장별 인덱스를 후반 참고 블록처럼 읽히게 조정
- [x] Engineering을 `왜 중요한가` 보조 축으로 재카피
- [ ] `Problem -> Clue -> Concept -> Solution -> Bridge` 시각 흐름을 더 명시화

완료 기준:

- Core 첫 화면에서 장 번호보다 문제의식과 전환점이 먼저 보인다

### Workstream D. 참고자료

목표:

- Reference를 자료실이 아니라 이해 보조 계층으로 보이게 한다.

대상 파일:

- [reference/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/reference/page.tsx)
- [reference/book-map/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/reference/book-map/page.tsx)
- [reference/faq/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/reference/faq/page.tsx)
- [reference/glossary/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/reference/glossary/page.tsx)
- [reference/visual-atlas/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/reference/visual-atlas/page.tsx)

작업:

- [x] Reference hero를 이해 보조 계층으로 재작성
- [x] Book Map 첫 블록을 `책-웹 대응의 이유` 설명형으로 변경
- [x] FAQ를 오해 정리 순서 중심으로 재배치
- [x] Glossary를 용어 사전보다 `읽기 보조` 문맥으로 조정
- [x] Visual Atlas를 그림 목록보다 `어떤 장면을 먼저 보면 좋은가` 기준으로 정리

완료 기준:

- Reference가 새 주장 허브가 아니라 이해 안정화 허브로 읽힌다

### Workstream E. 내용 검증

목표:

- Verification과 Audit을 `확인 단계`로 읽히게 만들되, 결과와 감사의 경계를 유지한다.

대상 파일:

- [verification/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/verification/page.tsx)
- [verification/results/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/verification/results/page.tsx)
- [verification/pending/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/verification/pending/page.tsx)
- [verification/channels/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/verification/channels/page.tsx)
- [verification/channels/[channel]/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/verification/channels/[channel]/page.tsx)
- [audit/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/audit/page.tsx)
- `audit/*`, `/runs*`, `/snapshots*`

작업:

- [x] Verification hero를 확인 단계 문장으로 재작성
- [x] 결과/대기/감사 3층 구조를 Verification 첫 화면에서 더 분명히 드러내기
- [x] Results 페이지의 첫 문단을 `무엇을 비교했고 왜 읽어야 하는가` 중심으로 재작성
- [x] Pending 페이지를 단순 목록보다 `아직 잠기지 않은 이유` 중심으로 재작성
- [x] Audit 첫 화면을 `고급 확인 자료` 성격으로 조정
- [x] Runs / Snapshots 진입 카피를 provenance 설명형으로 정리

완료 기준:

- 내용 검증 섹션이 설명을 방해하지 않고 뒤에서 받쳐주는 구조가 된다

### Workstream F. 게시판과 댓글

목표:

- 페이지별 댓글과 주제형 게시판을 명확히 구분하고, 운영 상태를 눈에 보이게 만든다.

대상 파일:

- [discussion/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/discussion/page.tsx)
- [comments-panel.tsx](/home/jwater/Development/salt-verification-console/web/src/components/comments-panel.tsx)
- [comments-section.tsx](/home/jwater/Development/salt-verification-console/web/src/components/comments-section.tsx)
- [audit/comments/page.tsx](/home/jwater/Development/salt-verification-console/web/src/app/audit/comments/page.tsx)
- [community.ts](/home/jwater/Development/salt-verification-console/web/src/lib/community.ts)
- `api/comments/*`

작업:

- [x] 공개 게시판 읽기 페이지 추가
- [x] 댓글 UI에 runtime 상태 표시 추가
- [x] moderation 화면에 runtime 상태 추가
- [x] 게시판 상세 페이지 추가
- [x] 게시판 글 작성 API 및 UI 추가
- [ ] 페이지 댓글과 게시판 CTA 관계 정리
- [x] 게시판 내비 노출 위치 최종 확정

완료 기준:

- 독자가 댓글과 게시판의 차이를 바로 이해한다

### Workstream G. Auth / Neon / Prisma

목표:

- 준비된 스키마와 코드를 실제 운영 상태로 연결한다.

대상 파일:

- [schema.prisma](/home/jwater/Development/salt-verification-console/web/prisma/schema.prisma)
- [auth/options.ts](/home/jwater/Development/salt-verification-console/web/src/lib/auth/options.ts)
- [READMEforweb.md](/home/jwater/Development/salt-verification-console/web/READMEforweb.md)
- [community_auth_neon_schema.sql](/home/jwater/Development/salt-verification-console/docs/method/community_auth_neon_schema.sql)
- `.env.local` 또는 배포 환경변수

작업:

- [x] `DATABASE_URL` 설정
- [x] `AUTH_SECRET` 설정
- [x] Google 또는 GitHub OAuth env 설정
- [x] `npm run prisma:migrate:deploy` 실행
- [x] 첫 OAuth 로그인으로 `users` 생성 확인
- [x] `grant-role`로 moderator/admin 계정 확인
- [x] Neon DB에 `board_posts` 운영 작성 플로우 연결 확인

완료 기준:

- 게시판과 댓글이 실제 DB와 인증을 기준으로 동작한다

현재 상태 메모:

- `.env.local` 기준으로 DB/Auth/OAuth 설정과 Prisma migration은 확인 완료
- 첫 OAuth 로그인, 관리자 권한 부여, 첫 게시글 작성까지 확인 완료
- 페이지 댓글, 신고, 숨김/삭제, `/audit/comments` moderation까지 포함한 운영 시나리오 검증도 완료
- 남은 것은 CTA 관계와 일부 시각 흐름, 홈 첫 화면 우선순위 같은 UI 미세조정이다

## 3. 작업 순서

실행 순서는 아래처럼 고정한다.

1. Workstream A
2. Workstream B
3. Workstream C
4. Workstream D
5. Workstream E
6. Workstream F
7. Workstream G

이 순서를 지키는 이유:

- 먼저 독자가 보는 구조를 고정해야
- 세부 페이지 카피와 블록 순서를 안정적으로 고칠 수 있고
- 커뮤니티와 DB 연결도 어디에 붙는지 흔들리지 않는다

## 4. 각 단계 산출물

### Step 1 산출물

- 최종 상단 내비
- 업데이트된 page map story metadata

### Step 2 산출물

- 홈/Guide 새 카피
- 소개 축 CTA 재정렬

### Step 3 산출물

- Core / Logic Map / Engineering의 스토리 우선 첫 화면

### Step 4 산출물

- Reference / Book Map / FAQ / Glossary / Visual Atlas의 보조 계층 정렬

### Step 5 산출물

- Verification / Results / Pending / Audit의 확인 단계 정렬

### Step 6 산출물

- 공개 게시판
- 댓글 상태 가시화
- moderation 연결

### Step 7 산출물

- 실제 Neon/Auth 연결
- 운영 가능한 게시판/댓글

## 5. 현재 상태 체크

이미 반영된 것:

- [x] 상단 내비 5개 축의 스토리형 라벨 반영
- [x] 홈 hero 1차 스토리형 카피 반영
- [x] Guide 통합 소개 축 반영
- [x] Core hero 1차 카피 반영
- [x] Reference hero 1차 카피 반영
- [x] Verification hero 1차 카피 반영
- [x] 공개 게시판 읽기용 `/discussion` 추가
- [x] 게시판 상세/작성 플로우 반영
- [x] 실제 Neon/Auth env 연결 및 migration 확인
- [x] 첫 OAuth 로그인, admin role grant, 운영 게시글 생성 확인
- [x] 댓글/운영 화면에 community runtime 상태 표시

아직 남은 것:

- [ ] 드롭다운 내부 설명과 CTA 미세정리
- [ ] 홈 결과 카드 비중과 첫 CTA 우선순위 미세조정
- [ ] 장별 인덱스의 후반 참고 블록화
- [ ] `Problem -> Clue -> Concept -> Solution -> Bridge` 시각 흐름 보강
- [x] 페이지 댓글, 신고, 숨김/삭제, moderation 운영 검증

## 6. 완료 기준

이 작업보드의 완료 기준은 아래다.

- 상단 내비가 5개 구조로 고정된다
- 각 허브 첫 화면이 이야기 리드 중심으로 읽힌다
- 요약과 근거는 후반에 배치된다
- Audit는 후면 고급 계층으로 유지된다
- 게시판과 댓글이 명확히 구분된다
- Neon/Auth/Prisma가 실제 운영 상태로 연결되고 moderation까지 검증된다
