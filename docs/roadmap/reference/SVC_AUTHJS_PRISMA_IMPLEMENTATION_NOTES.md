# SVC Auth.js + Prisma 구현 메모

최종 업데이트: `2026-04-03`

## 1. 결정

현재 회원제 커뮤니티 스택은 아래처럼 고정한다.

- 인증: `Auth.js`
- DB: `Neon Postgres`
- 스키마/쿼리 계층: `Prisma`
- 권한 보호: `Postgres RLS`
- 세션 전략: `JWT session + app users table`

## 2. 왜 `JWT session + app users table`인가

초기 범위에서는 Auth.js adapter 테이블을 전면 도입하지 않고, JWT 세션을 사용한다.

이유:

- 커뮤니티 권한 모델의 source of truth를 앱 DB `users`, `user_roles`에 둘 수 있다.
- DB 스키마를 Auth.js 기본 테이블에 과도하게 맞출 필요가 없다.
- OAuth 로그인 성공 후 `auth_subject`를 기준으로 앱 사용자 레코드를 upsert 하는 흐름이 단순하다.

## 3. 요청 처리 규칙

커뮤니티 관련 쓰기/관리 요청은 아래 순서를 따른다.

1. Auth.js 세션 확인
2. 세션에서 앱 사용자 ID, role, status 확인
3. DB 트랜잭션 시작
4. 아래 GUC 값 주입
- `set local app.current_user_id = '<users.id>'`
- `set local app.current_user_role = 'member|moderator|admin'`
- `set local app.current_user_status = 'active|restricted|suspended|deleted'`
5. 이후 모든 쿼리는 RLS 적용 상태에서 실행

## 4. 구현 파일

- Prisma 스키마: [schema.prisma](/home/jwater/Development/salt-verification-console/web/prisma/schema.prisma)
- Neon/Postgres RLS 스키마: [community_auth_neon_schema.sql](/home/jwater/Development/salt-verification-console/docs/method/community_auth_neon_schema.sql)
- RLS 세션 주입 유틸: [session-context.ts](/home/jwater/Development/salt-verification-console/web/src/lib/auth/session-context.ts)
- env 예시: [.env.example](/home/jwater/Development/salt-verification-console/web/.env.example)

## 5. 다음 작업

1. `next-auth`와 `@prisma/client`, `prisma` 의존성 추가
2. `web/src/auth.ts` 생성
3. `app/api/auth/[...nextauth]/route.ts` 생성
4. 로그인 성공 시 `users` upsert callback 구현
5. Prisma client와 transaction helper 추가
6. 첫 커뮤니티 라우트와 관리자 라우트 구현
