# SVC 보안 포함 회원관리 아키텍처

최종 업데이트: `2026-04-03`

## 1. 목적

이 문서는 `salt-verification-console`에 회원제 게시판과 댓글 기능을 도입할 때 필요한 인증, 권한, 데이터 최소화, 관리자 통제, 사고 대응 원칙을 정리한 보안 아키텍처 문서다.

목표는 두 가지다.

- `Google`, `GitHub` OAuth 기반 회원제 쓰기 기능을 안전하게 운영한다.
- 회원정보 유출 가능성을 줄이기 위해 인증 경계와 앱 DB 저장 범위를 보수적으로 설계한다.

## 2. 기본 원칙

1. 인증은 외부 검증 계층에 맡기고, 애플리케이션은 최소 프로필과 권한만 가진다.
2. 읽기는 공개, 쓰기는 인증 회원만 허용한다.
3. 앱 DB는 공개 프로필과 운영 로그만 저장하고, 민감정보는 직접 보관하지 않는다.
4. 관리자 권한은 최소 인원에게만 부여하고, 모든 관리자 조치는 감사 가능해야 한다.
5. DB 접근, 백업 접근, 운영자 조회 권한은 role 기반으로 최소화한다.

## 3. 권장 스택

- 인증: `Auth.js`
- OAuth provider: `Google`, `GitHub`
- 주 DB: `Neon Postgres`
- 권한 제어: `Postgres RLS + request-scoped session variable`
- 서버 계층: `Next.js App Router` server action / route handler
- ORM/쿼리 계층: `Prisma` 또는 `Drizzle` 중 택1
- 비밀 관리: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `DATABASE_URL` 분리

직접 비밀번호 로그인은 초기 범위에서 제외한다.

이유:

- 비밀번호 저장, 재설정, 잠금, 탈취 대응 책임이 크게 늘어난다.
- 현재 요구사항은 커뮤니티 쓰기 권한과 관리자 통제이지, 독립 계정 시스템 구축이 아니다.

## 4. 신뢰 경계

### 4.1 인증 경계

- 로그인과 세션 발급은 `Auth.js`가 담당한다.
- 애플리케이션은 OAuth provider의 subject를 `users.auth_subject`에 매핑해 회원을 식별한다.
- OAuth access token, refresh token, provider secret은 앱 DB에 저장하지 않는다.
- 요청 처리 시 서버는 DB 세션에 `app.current_user_id`, `app.current_user_role`, `app.current_user_status`를 주입하고, RLS는 이 값을 기준으로 동작한다.

### 4.2 애플리케이션 경계

- 앱은 `users`, `user_roles`, `board_posts`, `post_comments` 등 운영에 필요한 최소 데이터만 저장한다.
- 관리자 UI는 서버 전용 경로에서만 접근한다.
- 관리자 조회는 서버에서 role 검사 후 필요한 최소 필드만 반환한다.

### 4.3 운영 경계

- OAuth secret과 DB admin credential은 브라우저에 절대 노출하지 않는다.
- DB 백업 접근 권한은 인프라 운영자 또는 지정 관리자만 가진다.
- 운영자가 회원 정보를 대량 추출할 수 있는 기능은 기본 제공하지 않는다.

## 5. 데이터 최소화 원칙

### 5.1 앱 DB에 저장하는 정보

`users`에는 공개 프로필과 운영 식별에 필요한 최소 컬럼만 둔다.

- `id`
- `auth_subject`
- `display_name`
- `avatar_url`
- `status`
- `created_at`
- `updated_at`

선택 저장:

- `primary_provider`
- `last_seen_at`

### 5.2 저장하지 않는 정보

- 로컬 비밀번호 해시
- OAuth access token / refresh token
- 전화번호
- 생년월일
- 상세 주소
- 주민등록번호 또는 이에 준하는 식별값

### 5.3 이메일 취급

- 가능하면 앱 테이블에 이메일 원문을 중복 저장하지 않는다.
- 운영상 필요하면 Auth.js adapter 계층 또는 제한된 관리자 전용 view를 통해 조회한다.
- 공개 프로필, 게시글, 댓글 응답에는 이메일을 절대 노출하지 않는다.

## 6. 권한 모델

### 6.1 역할

- `member`
  - 게시글 작성
  - 댓글 작성
  - 본인 글/댓글 수정 및 soft delete
- `moderator`
  - 신고 검토
  - 글/댓글 숨김
  - 제한 조치 제안 또는 실행
- `admin`
  - 회원 상태 변경
  - 게시물 삭제/복구
  - moderator 권한 부여/회수
  - 운영 로그 조회

### 6.2 상태

- `active`
- `restricted`
- `suspended`
- `deleted`

상태 변경은 모두 `moderation_actions`와 `activity_log`에 남긴다.

## 7. 관리자 통제 원칙

관리자는 DB 기준으로 아래 항목을 조회할 수 있어야 한다.

- 회원 기본 상태
- 회원별 게시글/댓글 작성 이력
- 신고 접수 이력
- 제재 이력
- 관리자 조치 이력

다만 조회 범위는 역할에 따라 제한한다.

- `moderator`는 moderation에 필요한 필드만 본다.
- `admin`만 회원 상태 변경과 전체 운영 로그 조회 권한을 가진다.
- raw auth 메타데이터, 백업 파일, 서비스 키는 앱 관리자 화면에서 접근할 수 없다.

## 8. RLS 원칙

모든 커뮤니티 테이블은 기본적으로 `RLS enabled`를 전제로 한다.

전제:

- 애플리케이션 서버는 요청마다 DB 트랜잭션 시작 시 아래 값을 설정한다.
- `set local app.current_user_id = '<users.id>'`
- `set local app.current_user_role = 'member|moderator|admin'`
- `set local app.current_user_status = 'active|restricted|suspended|deleted'`

핵심 규칙:

- 비로그인 사용자는 공개 상태의 게시글/댓글만 읽을 수 있다.
- 로그인 사용자는 `active member`일 때만 쓰기 가능하다.
- 사용자는 본인 콘텐츠만 수정 가능하다.
- moderator/admin만 숨김, 제한, 상태 변경 가능하다.
- 관리자 로그는 관리자만 읽고, 일반 사용자는 읽지 못한다.

## 9. 운영 보안 원칙

### 9.1 abuse 방지

- IP + user 기준 rate limit
- 동일 사용자 짧은 시간 내 연속 작성 제한
- 링크 과다 포함 제한
- 신고 누적 기준으로 자동 검토 큐 이동

### 9.2 삭제 정책

- 기본은 `soft delete`
- 법적 또는 운영상 필요 시에만 hard delete
- soft delete 이유와 실행 주체는 반드시 로그로 남긴다

### 9.3 감사 로그

아래 이벤트는 모두 `activity_log` 또는 `moderation_actions`에 남긴다.

- 로그인 후 첫 프로필 생성
- 게시글 작성/수정/삭제
- 댓글 작성/수정/삭제
- 신고 접수
- 숨김/복구/제한/정지
- 관리자 role 변경

## 10. 사고 대응 원칙

회원정보 유출 또는 오남용 의심 시 최소 대응 절차는 아래와 같다.

1. 관리자 권한 계정 및 OAuth secret, DB admin credential 노출 여부 확인
2. 관련 세션 강제 만료
3. 의심 계정 상태를 `restricted` 또는 `suspended`로 전환
4. 영향 범위 로그 조회
5. 노출 컬럼, 접근 경로, 조회 주체 기록
6. 필요 시 provider 연동 재설정과 키 교체

## 11. 구현 순서

1. 인증 경계 확정
- `Auth.js`
- `Google`, `GitHub` provider 설정

2. 최소 사용자/권한 스키마 생성
- `users`
- `user_roles`

3. 커뮤니티 스키마 생성
- `board_posts`
- `post_comments`
- `content_reports`
- `moderation_actions`
- `activity_log`

4. RLS 정책 적용
- 공개 읽기
- 회원 쓰기
- 본인 수정
- 관리자 moderation
- request-scoped session variable 주입 방식 고정

5. 관리자 조회 화면 구현
- 회원별 활동내역
- 신고 큐
- 제재 이력

## 12. 함께 보는 문서

- [SVC_COMMENTS_AUTH_PLAN.md](/home/jwater/Development/salt-verification-console/docs/roadmap/SVC_COMMENTS_AUTH_PLAN.md)
- [SVC_AUTHJS_PRISMA_IMPLEMENTATION_NOTES.md](/home/jwater/Development/salt-verification-console/docs/roadmap/SVC_AUTHJS_PRISMA_IMPLEMENTATION_NOTES.md)
- [master_execution_structure_plan_20260402.md](/home/jwater/Development/salt-verification-console/results/reports/master_execution_structure_plan_20260402.md)
- [community_auth_neon_schema.sql](/home/jwater/Development/salt-verification-console/docs/method/community_auth_neon_schema.sql)
