# Web Setup

이 디렉터리는 `salt-verification-console`의 Next.js 웹 앱이다.

현재 포함된 운영 기능:

- 공개 읽기 페이지
- Google / GitHub OAuth 로그인
- 댓글 작성
- 댓글 신고
- moderator/admin 숨김 · 삭제
- 운영자용 댓글 관리 화면 `/audit/comments`

## 1. 필수 환경변수

`.env.example`을 기준으로 `.env.local` 또는 배포 환경변수를 채운다.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"

AUTH_GOOGLE_ID="replace-with-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-google-client-secret"

AUTH_GITHUB_ID="replace-with-github-client-id"
AUTH_GITHUB_SECRET="replace-with-github-client-secret"

AUTH_TRUST_HOST=true
```

운영 메모:

- `DATABASE_URL`이 없으면 댓글은 파일 fallback으로 내려가고, Prisma 기반 운영 기능은 제한된다.
- OAuth provider가 하나도 설정되지 않으면 상단에 `auth not configured`가 표시된다.

## 2. 개발 실행

```bash
cd web
npm install
npm run prisma:generate
npm run dev
```

## 3. DB 초기화

현재 baseline SQL은 [migration.sql](/home/jwater/Development/salt-verification-console/web/prisma/migrations/0001_initial/migration.sql)에 고정돼 있다.

배포 환경에서 Prisma migration을 적용할 때:

```bash
cd web
npm run prisma:generate
npm run prisma:migrate:deploy
```

상태 확인:

```bash
cd web
npm run prisma:migrate:status
```

## 4. 첫 관리자 계정 만들기

순서:

1. Google 또는 GitHub로 한 번 로그인한다.
2. 로그인 후 `users`와 기본 `member` 역할이 자동 생성된다.
3. 아래 스크립트로 `admin` 또는 `moderator` 역할을 부여한다.

`auth_subject` 기준:

```bash
cd web
DATABASE_URL=... npm run grant-role -- --auth-subject "google:1234567890" --role admin
```

`user_id` 기준:

```bash
cd web
DATABASE_URL=... npm run grant-role -- --user-id "uuid" --role moderator
```

가능한 역할:

- `member`
- `moderator`
- `admin`

## 5. 운영자 기능

운영자 전용 화면:

- `/audit/comments`

운영자 권한이 필요한 API:

- `POST /api/comments/[id]/hide`
- `POST /api/comments/[id]/delete`

로그인 사용자면 가능한 API:

- `POST /api/comments`
- `POST /api/comments/[id]/report`

## 6. 현재 1차 범위

완료:

- 공개 댓글 조회
- 인증 댓글 작성
- 작성 rate limit
- 댓글 신고
- moderator/admin 숨김 · 삭제
- 운영자 관리 페이지

아직 남은 것:

- dedicated moderation filters/search
- 신고 상태 변경 UI
- 관리자 일괄 처리 화면
- comment reactions / threads / notifications

## 7. 점검 명령

```bash
cd web
npm run lint
./node_modules/.bin/tsc --noEmit --pretty false
node --check scripts/grant-role.mjs
```
