# Master Execution and Structure Plan

기준일: `2026-04-06`

현재 상태: `legacy master plan; public IA has since shifted to five-nav`

이 문서는 기존 실행의 기준 문서다.

- 현재 공개면 구조 판단은 `FIVE_NAV_*` 문서를 우선 본다.
- 이 저장소에서 `지금 무엇을 기준으로 읽고 작업해야 하는지`를 한 번에 정리한 문서다.
- `docs/roadmap/reference/*`는 주제별 배경 문서다.
- `docs/roadmap/archive/*`는 과거 판단과 이력 보존용 문서다.
- 실행 순서가 필요하면 항상 이 문서로 돌아온다.

이 문서에서 함께 확인할 수 있는 내용은 아래다.

- 현재 구조 판단
- 남은 작업
- 단계별 우선순위
- 바로 다음 실행 순서

상태 메모:

- 원래 상위 구조는 `Home / Guide / Core / Verification / Engineering / Reference / Audit` 기준으로 정리돼 있다.
- 현재 공개 웹의 실제 노출 구조는 `소개 / 핵심 아이디어 / 내용 검증 / 참고자료 / 게시판` 5축으로 상당 부분 이동했다.
- 따라서 이 문서는 배경 판단과 이전 구조를 읽는 용도로는 유효하지만, 현재 공개면 구현 상태를 판정할 때는 최신 기준 문서가 아니다.

문서를 읽는 기본 순서는 아래처럼 본다.

1. `docs/roadmap/current/FIVE_NAV_IMPLEMENTATION_WORKBOARD.md`
2. `docs/roadmap/current/FIVE_NAV_STORY_REENGINEERING_MASTER_PLAN.md`
3. `docs/roadmap/current/FIVE_NAV_STORY_WIREFRAMES.md`
4. 이 문서
5. 필요한 경우에만 `docs/roadmap/reference/*`
6. 과거 판단이 필요할 때만 `docs/roadmap/archive/*`

이 문서는 아래 두 문서를 작업 순서에 맞춰 통합한 마스터 계획안이다.

- `docs/roadmap/archive/EXECUTION_PLAN_20260331_20260401.md`
- `docs/roadmap/archive/WEB_STRUCTURE_OPTIMIZATION_PLAN_20260401.md`

관련 참조 문서:

- `docs/roadmap/reference/SVC_SITE_SIMPLIFICATION_REENGINEERING_PLAN.md`

목적은 두 가지다.

- `무엇을 했고 무엇이 남았는지`를 한 문서에서 확인한다.
- `어떤 구조 원칙으로 남은 작업을 처리할지`를 한 문서에서 확인한다.

## 1. 문제 정의

현재 웹사이트는 과학 대중서 `물리학에 시공간은 없다`의 대문이자 안내 페이지이며, 동시에 검증 자료, 재현 자료, 공학적 함의, 참여형 토론 가능성을 함께 정리하는 레퍼런스 사이트다.

최종 목적은 단순한 자료 보관이 아니다.

- 도서를 처음 접한 방문자에게 `SALT`의 문제의식, 책의 읽기 흐름, 사이트의 사용 목적을 빠르게 안내한다.
- `SALT`가 기존 물리학의 설명 공백을 묶어 읽으려는 새로운 통일장적 아이디어라는 점을 명확히 제시한다.
- 그 주장이 단순한 선언이 아니라 `논리 구조`, `핵심 개념`, `검증 가능성`, `재현 가능성`을 함께 갖춘다는 점을 보여준다.
- 검증 결과와 분리된 `공학적 함의`와 `응용 가능성`을 구조적으로 제시해, 이론의 해석 확장 범위를 보여준다.
- 관심 있는 독자, 검토자, 기술 파트너가 질문, 의견, 토론에 참여할 수 있는 상호작용 계층을 점진적으로 갖춘다.
- 따라서 이 사이트는 `입문 안내`, `이론 제시`, `검증/재현/감사`, `공학적 해석`, `참여와 토론`을 함께 가지되, 최종적으로는 `SALT의 이론적 위상`과 `검토 가능성`을 분명히 드러내야 한다.

따라서 웹 구조는 아래를 동시에 만족해야 한다.

- 도서를 처음 접한 방문자가 전체 맥락을 잃지 않을 것
- 검증 결과와 재현 경로를 찾는 방문자가 빠르게 도달할 것
- 공학적 함의와 응용 가능성을 보려는 방문자가 검증 결과와 혼동 없이 이동할 것
- 질문, 피드백, 토론이 페이지 문맥에 맞게 축적될 수 있을 것
- 기술적 해석과 검증 결과가 서로 섞이지 않을 것
- 책의 논리 구조와 웹 구조가 완전히 단절되지 않을 것
- 프론트 화면 구조와 내부 데이터 구조가 같은 논리를 따를 것
- `이론 제시 축`과 `검증/감사 축`의 우선순위가 뒤바뀌지 않을 것

## 2. 최적화 기준

이 사이트에서 말하는 구조 최적화는 단순한 미관 개선이 아니다. 아래 다섯 축을 함께 충족해야 한다.

### 2.1 기능적 효율성

- 방문자가 최소한의 클릭으로 `도서 소개`, `핵심 개념`, `검증 결과`, `참고 자료`, `재현 경로`에 도달할 수 있어야 한다.
- 운영자 입장에서는 라우트, 페이지 맵, 콘텐츠 모델이 중복 없이 유지되어야 한다.

### 2.2 가독성

- 한 페이지는 한 가지 역할을 가져야 한다.
- 개념, 검증 결과, 검증 대기 항목, 해석, 감사 자료가 한 화면에서 뒤섞이지 않아야 한다.

### 2.3 맥락 전달

- 방문자는 먼저 `이 사이트가 책의 어떤 부분을 어떻게 안내하는가`를 이해할 수 있어야 한다.
- 개별 항목보다 읽기 흐름이 먼저 보여야 한다.
- 특히 `왜 SALT가 통일장 문제에 새로운 해석을 제안하는가`가 검증 결과보다 앞서 이해되어야 한다.

### 2.4 방문자 관리

- 처음 온 독자
- 구매 의사가 있는 방문자
- 검증만 보려는 검토자
- 기술적 관심 방문자

이 네 부류의 경로가 자연스럽게 갈라져야 한다.

### 2.5 frontend-backend 조화

- 상단 내비, 드롭다운, 허브 페이지, 페이지 맵, 데이터 모델이 같은 구조 논리를 따라야 한다.
- 화면 구조와 코드 구조가 어긋나면 이후 유지보수와 확장이 어려워진다.

## 3. 현재까지 진행된 작업

### 3.1 완료된 축

- 공개 상단 내비를 `소개 / 핵심 아이디어 / 내용 검증 / 참고자료 / 게시판` 5축으로 재정렬
- 홈과 `/guide`를 사실상 `소개` 축으로 통합
- 주요 허브와 세부 페이지의 메타성 설명을 걷어내고 독자용 설명 카피로 재작성
- `Verification`, `Audit`, `Runs`, `Snapshots`를 `내용 검증` 후면 계층으로 재정렬
- `Reference` 하위 페이지를 `이해 보조` 성격으로 정리
- 공개 게시판 `/discussion` 목록/상세/UI/API 추가
- Prisma/Neon/Auth 연결 코드와 운영 체크 스크립트 정비

### 3.2 부분 완료된 축

- `Core`에서 `Problem -> Clue -> Concept -> Solution -> Bridge` 흐름은 반영됐지만 시각적 강조는 아직 약함
- 장별 압축 페이지는 여전히 `17/18/19장` 중심 구현에 머물러 있음
- `Engineering`은 보조 허브로 정리됐지만 상위 5축 바깥의 잔여 구조 흔적이 남아 있음
- `Book Map`과 전체 읽기 동선 연결은 좋아졌지만 완전히 닫히지는 않았음
- 게시판과 페이지 댓글의 CTA 관계는 아직 더 다듬을 여지가 있음

### 3.3 미완료 축

- 실제 운영 검증 완료
- 게시판/댓글의 실사용 moderation 검증
- `page-map.ts`와 roadmap 문서의 최종 정합화
- 페이지 내부 상수 데이터의 공통 모델 분리
- `MASTER_EXECUTION_STRUCTURE_PLAN.md` 본문 전체를 최신 5축 기준으로 완전 재작성할지 여부 결정
- 기존 라우트 호환 정책 최종 검증

### 3.4 코드 기준 추가 확인 사항

- `page-map.ts`는 현재 5축 story metadata를 반영하지만 문서 설명과 완전히 일치하도록 마지막 점검이 더 필요하다.
- 검증 채널 인덱스와 상세는 모두 존재한다.
- 댓글/Auth/게시판 영역은 Prisma 스키마, API, UI, moderation, rate limit까지 구현됐고 남은 것은 실제 운영 검증이다.
- `runs` / `snapshots` 계열은 별도 provenance 데이터 계층으로 유지하는 편이 맞다.

## 4. 현재 구조 평가

### 4.1 잘 작동하는 부분

- 방문자용 상위 구조는 비교적 명확하다.
- 검증 결과와 기술적 해석이 분리되어 있다.
- 참고 자료와 감사 자료가 별도 섹션으로 나뉘어 있다.
- 도서 소개 사이트로서의 톤과 첫 진입 흐름은 이전보다 안정적이다.

### 4.2 아직 부족한 부분

- ERD의 `Problem -> Clue -> Concept -> Solution -> Verify` 흐름이 웹 구조에서 명시적으로 드러나지 않는다.
- `Core`가 ERD 기반 논리 허브보다 `17/18/19장 압축 허브`에 가깝다.
- `page-map.ts`가 실제 현재 구조를 충분히 반영하지 못한다.
- 개별 페이지 설명 데이터가 컴포넌트 내부 상수에 흩어져 있다.
- `Book Map`과 전체 네비게이션이 충분히 연결되어 있지 않다.

## 5. 핵심 판단

현재 구조는 `완전히 잘못된 구조`는 아니다. 오히려 방문자용 정보구조로는 이미 상당히 안정적이다.

다만 아직 최적 구조라고 보려면 아래 두 조건이 더 필요하다.

- ERD 논리 구조가 `Core`와 `Book Map`을 통해 더 명시적으로 드러날 것
- 페이지 맵과 콘텐츠 데이터 구조가 실제 화면 구조와 완전히 일치할 것
- `Core/Logic Map`이 이론 설득의 중심축이 되고, `Verification/Audit`이 이를 뒷받침하는 증거축으로 읽힐 것

따라서 다음 단계는 `전면 재설계`보다 `논리 중간층 보강 + 데이터 구조 정렬`이 맞다.

## 6. 원인 진단 원칙

앞으로 구조 문제가 보일 때는 항상 아래 세 가지 가능성을 분리해 본다.

### 6.1 책 내용 구조 문제

- 책 자체의 논리 흐름이 충분히 단계화되어 있지 않은 경우
- 장 간 경계나 위계가 불명확한 경우
- 웹으로 옮기기 전에 책 내부 구조를 먼저 다듬어야 하는 경우

### 6.2 책 구조를 웹 구조로 번역하는 문제

- 책의 논리 순서는 좋지만 방문자 동선으로 바꾸는 과정이 미흡한 경우
- 장 구조를 그대로 메뉴로 옮겨 웹에서 오히려 읽기 어려워지는 경우
- `논리 원형`과 `방문자용 번역` 사이의 중간층 설계가 부족한 경우

### 6.3 웹 아키텍처 문제

- 라우트 구조, 페이지 맵, 드롭다운, 데이터 모델이 서로 어긋나는 경우
- 콘텐츠는 충분하지만 화면과 코드 구조가 비효율적인 경우
- 정보구조 자체보다 구현 구조가 문제인 경우

## 7. 목표 구조

### 7.1 현재 공개 최상위 구조

- `소개`
- `핵심 아이디어`
- `내용 검증`
- `참고자료`
- `게시판`

현재 공개 웹에서 독자가 직접 보는 최상위 구조는 위 5축이다.

내부 라우트 계층은 여전히 `Home / Guide / Core / Verification / Engineering / Reference / Audit`를 포함하지만,
이들은 독자 노출 기준의 최상위 IA가 아니라 구현상 하위 축 또는 세부 허브로 해석한다.

역할의 무게중심은 아래처럼 읽는다.

- `소개`, `핵심 아이디어`는 `SALT의 문제의식과 이론적 위상`을 먼저 제시하는 전면 축이다.
- `내용 검증`은 결과, 대기 항목, 감사 자료를 묶는 후면 증거 축이다.
- `참고자료`는 독자가 앞선 설명을 안정적으로 이해하도록 돕는 보조 축이다.
- `게시판`은 질문과 해석을 공개적으로 축적하는 참여 축이다.

### 7.1.1 최상위 섹션 역할/경계/포함 페이지 표

| 섹션 | 역할 | 포함 페이지 | 제외 페이지 | 대표 데이터 |
| --- | --- | --- | --- | --- |
| `소개` | 사이트 첫 진입 허브. SALT의 한 줄 정의와 읽기 순서를 제시한다. | `/`, `/guide` | 세부 검증 채널, 감사 로그, 장별 상세 페이지 | `site_section`, 주요 CTA 링크, 핵심 요약 |
| `핵심 아이디어` | SALT의 문제의식과 개념 전환을 설명하는 중심 허브다. | `/core`, `/core/logic-map`, `/core/chapters`, `/core/chapters/[chapter]`, `/engineering` | 검증 원표, 감사용 provenance, 운영 기능 | `erd_stage`, `book_chapter_summary`, `site_section` |
| `내용 검증` | 결과, 대기 항목, 재현/감사 경로를 묶는 검증 허브다. | `/verification`, `/verification/results`, `/verification/pending`, `/verification/channels`, `/verification/channels/[channel]`, `/verification/candidate-hypotheses`, `/audit`, `/audit/*`, `/runs*`, `/snapshots*` | 전면 이론 설명, 참고용 glossary/FAQ, 공개 게시판 운영 설명 | `verification_channel`, `frozen_manifest`, `model_eval_manifest`, provenance 데이터 |
| `참고자료` | 이해를 안정화하는 보조 허브다. | `/reference`, `/reference/book-map`, `/reference/faq`, `/reference/glossary`, `/reference/visual-atlas` | 검증 판정 원표, moderation 기능 | `reference_asset`, `book_chapter_summary`, 용어/FAQ 데이터 |
| `게시판` | 질문과 해석을 공개적으로 축적하는 커뮤니티 허브다. | `/discussion`, `/discussion/[slug]`, 페이지 하단 댓글, `/audit/comments` 운영층 | 핵심 이론 허브를 대체하는 설명, 검증 결과의 공식 판정 기능 | `board_posts`, `post_comments`, `user_roles`, moderation 데이터 |

최상위 섹션 경계는 아래처럼 해석한다.

- `소개`는 요약과 읽기 순서만 담당하고 세부 허브 역할을 대신하지 않는다.
- `핵심 아이디어`는 이론과 논리 구조를 담당하고 검증 원표의 주 설명자가 되지 않는다.
- `내용 검증`은 비교 결과와 provenance를 담당하고 이론 전개의 주 설명자가 되지 않는다.
- `참고자료`는 대응과 보조 설명을 담당하고 판정/운영 허브가 되지 않는다.
- `게시판`은 질문과 토론을 담당하고 이론 또는 검증의 공식 허브를 대체하지 않는다.

또한 구조의 우선순위는 아래 순서를 따른다.

1. `SALT가 무엇을 새롭게 제안하는가`
2. `왜 이것이 통일장 문제에 의미 있는가`
3. `어떻게 검증 가능한가`
4. `어떻게 재현하고 감사할 수 있는가`

이 순서가 `소개`, `핵심 아이디어`, `내용 검증`, `참고자료`, `게시판` 전반에 유지되어야 한다.

### 7.2 보강할 중간층

`Core` 내부에 아래 축을 명시적으로 드러내는 구조를 보강한다.

- `Problem`
- `Clue`
- `Concept`
- `Solution`
- `Bridge to Verification`

이 역할은 `/core/logic-map`에서 수행하는 것이 가장 적절하다.

`/core/logic-map`은 단순 보조 페이지가 아니라, 최종적으로 `SALT의 통일장적 위상`을 가장 압축적으로 보여주는 대표 설명 페이지가 되어야 한다.

### 7.3 정리할 데이터 계층

아래 공통 모델이 필요하다.

- `site_section`
- `book_chapter_summary`
- `erd_stage`
- `verification_channel`
- `reference_asset`

또한 현재 코드 기준으로는 데이터 계층을 두 갈래로 분리해서 보는 편이 정확하다.

- `콘텐츠 메타 계층`
  - `site_section`
  - `book_chapter_summary`
  - `erd_stage`
  - `verification_channel`
  - `reference_asset`
- `감사 / provenance 계층`
  - `run summary`
  - `run detail`
  - `snapshot summary`
  - `snapshot detail`
  - `frozen_manifest`
  - `model_eval_manifest`

운영 원칙은 아래를 따른다.

- `콘텐츠 메타 계층`은 `소개 / 핵심 아이디어 / 내용 검증 / 참고자료 / 게시판`의 안내/설명 구조를 정렬하는 데 쓴다.
- `감사 / provenance 계층`은 `Audit / Runs / Snapshots`의 실행 근거와 재현 경로를 정렬하는 데 쓴다.
- 두 계층은 링크될 수 있지만 같은 파일 구조나 같은 타입 집합으로 무리하게 합치지 않는다.

### 7.3.1 장 반영 원칙

`00~28장` 전체를 웹에 그대로 복사하지 않는다. 웹은 원고의 사본이 아니라 `독자 탐색용 번역 계층`이다.

- 홈과 소개 축에는 첫 진입에 필요한 문제의식과 전체 그림만 남긴다.
- 핵심 아이디어 축에는 장 전체보다 `핵심 질문`, `핵심 문장`, `핵심 도해`를 압축 반영한다.
- 내용 검증 축에는 검증과 직접 연결되는 주장만 남기고, 긴 배경 서술은 원고에 둔다.
- 참고자료 축에는 FAQ, glossary, book map, visual atlas처럼 독자가 중간에 다시 찾을 자산만 배치한다.
- 감사와 provenance 정보는 설명 콘텐츠와 분리해 `Audit / Runs / Snapshots`에 둔다.

현재 운영상 가장 직접적인 장 연결축은 아래처럼 본다.

- `17장`: 핵심 논리와 구조 허브
- `18장`: 검증 가능성과 채널 해석
- `19장`: 공학적 함의와 확장 읽기
- `20~28장`: 질문, 대응, 감사, 참고자료로 재배치되는 보조 자원

### 7.3.2 시각 자산 활용 원칙

시각 자산은 현재 아래 두 계층으로 구분한다.

- `graph`
  - 장, 논리, 검증 구조를 직접 설명하는 도해 자산
  - `Visual Atlas`, 장 요약, 검증 채널 상세에 실제 연결되는 기본 설명 자산
- `public`
  - 홍보성 또는 독립 이미지 자산
  - 현재 공개 라우트의 기본 정보구조는 이 계층에 의존하지 않는다

운영 원칙은 단순하다.

- 논리 설명과 검증 설명은 `graph`를 우선 사용한다.
- `public` 자산은 별도 목적이 정의되기 전까지 상위 IA를 결정하는 기준으로 쓰지 않는다.

### 7.4 커뮤니티 기능 원칙

커뮤니티 기능은 현재 `읽기 공개, 쓰기 인증, 운영 분리` 원칙으로 정리한다.

- 게시판 글과 댓글 읽기는 공개 허용
- 게시판 글과 댓글 쓰기는 인증 회원만 허용
- 인증 공급자는 `Google`, `GitHub`를 우선 사용
- 관리자 권한은 일반 회원과 분리하고, 운영 조치는 감사 가능한 로그를 남긴다

현재 코드/운영 기준 핵심 객체는 아래와 같다.

- `users`
- `user_roles`
- `board_posts`
- `post_comments`
- `content_reports`
- `moderation_actions`
- `activity_log`

운영 전환 관점에서는 `Neon Postgres + Prisma + Auth.js` 조합이 기본안이며, 로컬 미설정 환경에서는 `file_fallback`이 보조 동작을 맡는다.

## 8. 현재 실행 상태

### 8.1 이미 완료된 것

- 공개 상단 IA를 `소개 / 핵심 아이디어 / 내용 검증 / 참고자료 / 게시판` 5축으로 재정렬
- `/`와 `/guide`를 사실상 하나의 소개 축으로 통합
- 주요 허브와 상세 페이지의 메타/운영자 설명을 걷어내고 독자용 설명 카피로 재작성
- `/core/logic-map`, `/core/chapters`, `/verification/channels` 등 핵심 허브와 인덱스 반영
- `Reference`, `Verification`, `Audit`, `Runs`, `Snapshots`의 역할 분리 강화
- `/discussion` 목록/상세/작성 흐름 구현
- Neon/Postgres, Prisma migration, Auth 설정, 관리자 권한 부여까지 로컬 운영 경로 확인
- dev 모드 계측 버그 우회와 한글 slug 상세 라우트 문제 수정

### 8.2 부분 완료된 것

- `page-map.ts`와 설명 문서의 마지막 정합화
- 페이지 내부 상수와 lib 데이터의 공통 모델화
- `Core` 안에서 `Problem -> Clue -> Concept -> Solution -> Bridge to Verification`의 시각 강조
- 게시판과 페이지 댓글, `/audit/comments` 사이의 운영 동선 정리
- 기존 구형 라우트/별칭의 최종 호환 정책 문서화

### 8.3 아직 남은 것

- 게시판 글 작성, 댓글 작성, 신고, 숨김, 삭제를 실제 운영 경로로 한 바퀴 끝까지 검증
- `/audit/comments`에서 관리자 moderation을 실제 데이터 기준으로 점검
- `web/OPERATIONS_CHECKLIST.md`와 roadmap 문서 체크 상태를 운영 결과에 맞게 최종 업데이트
- 필요 시 `page-map.ts`와 공통 콘텐츠 타입 정리

## 9. 현재 실행 보드

| 작업 묶음 | 상태 | 현재 상태 | 다음 액션 |
| --- | --- | --- | --- |
| `5축 정보구조` | `mostly_done` | 공개면 기준 구조와 주요 허브는 반영 완료 | 세부 CTA와 잔여 구형 문구만 점검 |
| `독자용 카피 정리` | `mostly_done` | 주요 허브와 상세 카피는 대부분 독자용 톤으로 전환 | 남은 문서형 콘텐츠와 잔여 라벨 정리 |
| `page-map / 문서 동기화` | `in_progress` | 코드와 문서가 대체로 맞지만 마지막 불일치 가능성 존재 | `page-map.ts`, roadmap 문서, 운영 체크리스트 교차 점검 |
| `콘텐츠 모델 정리` | `in_progress` | 데이터가 여러 파일에 흩어져 있음 | 공통 타입과 상수 위치를 축별로 정리 |
| `게시판 / 댓글` | `in_progress` | DB/Auth/관리자 부여까지 준비됨. 기본 글 작성 흐름도 동작 | 댓글, 신고, moderation까지 운영 시나리오 전체 검증 |
| `운영 하네스` | `in_progress` | `lint`, `build`, `runtime:check`는 확보됨 | smoke test와 운영 재발 방지 규칙 보강 |

## 10. 바로 다음 실행 순서

이 문서 기준에서 지금 바로 이어야 할 순서는 아래다.

1. `/discussion`에서 로그인 사용자 글 작성과 목록 반영을 실제 운영 기준으로 재확인
2. 페이지 댓글 작성과 읽기/쓰기 권한을 실제 세션 기준으로 검증
3. 신고, 숨김, 삭제, 관리자 moderation을 `/audit/comments` 포함 경로에서 한 바퀴 점검
4. `web/OPERATIONS_CHECKLIST.md`를 실제 운영 검증 결과로 갱신
5. `FIVE_NAV_IMPLEMENTATION_WORKBOARD.md`, `FIVE_NAV_STORY_REENGINEERING_MASTER_PLAN.md`, `FIVE_NAV_STORY_WIREFRAMES.md`의 체크 상태를 현재 코드 기준으로 닫기
6. 마지막으로 `page-map.ts`와 이 문서의 문장 기준이 어긋나지 않는지 정리

## 11. 이 문서의 역할

이 문서는 이제 `현재 공개면의 최종 설계 명세`라기보다 아래 역할을 맡는다.

- 왜 구조가 5축으로 이동했는지 설명하는 배경 문서
- 무엇이 이미 완료됐고 무엇이 운영 검증만 남았는지 요약하는 상태 문서
- `FIVE_NAV_*` 문서를 읽기 전에 큰 그림을 잡는 보조 문서

현재 공개면의 실제 구현 판단과 세부 체크는 아래 문서를 우선한다.

- [FIVE_NAV_IMPLEMENTATION_WORKBOARD.md](/home/jwater/Development/salt-verification-console/docs/roadmap/current/FIVE_NAV_IMPLEMENTATION_WORKBOARD.md)
- [FIVE_NAV_STORY_REENGINEERING_MASTER_PLAN.md](/home/jwater/Development/salt-verification-console/docs/roadmap/current/FIVE_NAV_STORY_REENGINEERING_MASTER_PLAN.md)
- [FIVE_NAV_STORY_WIREFRAMES.md](/home/jwater/Development/salt-verification-console/docs/roadmap/current/FIVE_NAV_STORY_WIREFRAMES.md)

기존 문서는 기록용으로 유지한다.

- [EXECUTION_PLAN_20260331_20260401.md](/home/jwater/Development/salt-verification-console/docs/roadmap/archive/EXECUTION_PLAN_20260331_20260401.md)
- [WEB_STRUCTURE_OPTIMIZATION_PLAN_20260401.md](/home/jwater/Development/salt-verification-console/docs/roadmap/archive/WEB_STRUCTURE_OPTIMIZATION_PLAN_20260401.md)
