# Operations Checklist

최종 점검일: `2026-04-03`

이 문서는 `운영 적용이 실제로 끝났는지`를 `YES/NO`로 판정하는 체크리스트다.
설정 방법과 설명은 [READMEforweb.md](/home/jwater/Development/salt-verification-console/web/READMEforweb.md)를 본다.

판정 원칙:

- 이 세션에서 직접 확인한 항목만 `YES`로 둔다.
- 직접 검증하지 못했거나 외부 운영 환경 의존 항목은 `NO`로 둔다.

## 운영 완료 체크

| 항목 | 현재 판정 | 비고 |
| --- | --- | --- |
| 배포 환경에 `DATABASE_URL`이 설정되어 있다 | `NO` | 현재 세션 환경에서 `DATABASE_URL=UNSET` 확인 |
| 배포 환경에 `AUTH_SECRET`이 설정되어 있다 | `NO` | 현재 세션 환경에서 `AUTH_SECRET=UNSET` 확인 |
| 배포 환경에 OAuth env가 최소 1세트 설정되어 있다 | `NO` | 현재 세션 환경에서 Google/GitHub OAuth env 모두 `UNSET` 확인 |
| `npm run prisma:generate`를 실제 실행했다 | `YES` | `2026-04-03` 세션에서 실행 성공 |
| `npm run prisma:migrate:deploy`를 실제 운영 DB에 실행했다 | `NO` | `DATABASE_URL` 부재로 명령 실패 확인 |
| 첫 OAuth 로그인 후 사용자 레코드가 실제 생성된다 | `NO` | 실제 provider 로그인 플로우 미검증 |
| 첫 admin 또는 moderator 역할 부여를 실제 실행했다 | `NO` | 스크립트 문법 확인만 했고 실제 role 부여는 미실행 |
| `/audit/comments` 페이지가 존재한다 | `YES` | 라우트 파일 존재, 로컬 GET 응답 확인 |
| admin 계정으로 `/audit/comments` 접근이 된다 | `NO` | 실제 admin 세션 접근 미검증 |
| 일반 사용자에게 `/audit/comments`가 제한된다 | `NO` | 실제 일반 사용자 세션 접근 미검증 |
| 로그인 사용자로 댓글 작성이 된다 | `NO` | 실제 로그인 기반 작성 테스트 미검증 |
| 비로그인 사용자가 댓글 작성 API에서 `401`을 받는다 | `YES` | 로컬 `POST /api/comments` 응답으로 확인 |
| 공개 댓글 GET API가 응답한다 | `YES` | 로컬 `GET /api/comments?page_path=/verification` 응답 확인 |
| 비로그인 상태에서 `/audit/comments` 접근 시 제한 안내가 렌더된다 | `YES` | 페이지 응답 본문에 제한 안내 문구 확인 |
| rate limit API가 코드에 연결되어 있다 | `YES` | `POST /api/comments`에 제한 로직 존재 |
| 신고 API가 코드에 연결되어 있다 | `YES` | `/api/comments/[id]/report` 라우트 존재 |
| moderator/admin 숨김 API가 코드에 연결되어 있다 | `YES` | `/api/comments/[id]/hide`, `/delete` 라우트 존재 |
| 운영자 관리 화면이 신고/댓글/액션 목록을 보여준다 | `NO` | moderator/admin 세션으로 실제 렌더는 아직 미검증 |

## 코드 준비 상태

| 항목 | 현재 판정 | 비고 |
| --- | --- | --- |
| baseline migration SQL이 있다 | `YES` | `prisma/migrations/0001_initial/migration.sql` 존재 |
| Prisma generate 스크립트가 있다 | `YES` | `package.json`에 `prisma:generate` 존재 |
| Prisma migrate deploy 스크립트가 있다 | `YES` | `package.json`에 `prisma:migrate:deploy` 존재 |
| role grant 스크립트가 있다 | `YES` | `scripts/grant-role.mjs` 존재 |
| role grant 스크립트 문법이 유효하다 | `YES` | `node --check scripts/grant-role.mjs` 통과 |
| TypeScript 타입 검사가 통과한다 | `YES` | `./node_modules/.bin/tsc --noEmit --pretty false` 통과 |
| 운영 가이드 문서가 있다 | `YES` | `READMEforweb.md` 존재 |

## 운영 완료 판정

아래 조건이 모두 충족되면 `운영까지 완료`로 본다.

- 위 `NO` 항목이 실제 검증을 통해 `YES`로 바뀐다.
- OAuth 로그인, 댓글 작성, 신고, 숨김/삭제를 최소 1회씩 실제로 검증한다.
- 첫 admin 계정으로 `/audit/comments` 접근을 확인한다.

현재 결론:

- `코드/문서 준비는 완료`
- `운영 적용 완료는 아직 NO`
