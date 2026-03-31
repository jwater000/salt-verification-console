# SVC 댓글 · 인증 · DB 확장 계획서

최종 업데이트: `2026-04-01`

## 1) 목적

이 문서는 `salt-verification-console`에 댓글 기능을 추가하기 위해 필요한 인증, DB, 운영 정책, UI 구현 범위를 정리한 실행 계획서다.

댓글 기능의 목표는 단순한 방명록이 아니다.

- 독자, 검토자, 잠재 고객이 페이지 단위로 질문과 피드백을 남길 수 있게 한다.
- 18장 `Verification`과 19장 `Engineering` 페이지에 대한 외부 반응을 구조적으로 수집한다.
- 무분별한 익명 입력이 아니라, 신뢰 가능한 사용자 식별과 moderation 체계를 전제로 운영한다.

## 2) 왜 지금 필요한가

현재 사이트는 `검증 · 설명 · 재현` 구조는 갖췄지만, 방문자와의 직접 상호작용 계층이 없다.

그 결과 다음 한계가 있다.

- 검토자가 질문을 남길 공식 창구가 없다.
- 특정 페이지의 설명이 부족한 지점을 데이터로 수집할 수 없다.
- 기술 파트너 또는 고객이 관심 영역을 남겨도 누적 맥락이 남지 않는다.
- 신뢰 형성 과정이 `읽기 전용`으로 끝난다.

따라서 다음 단계로는 `읽기 전용 콘솔`에서 `대화 가능한 설명 콘솔`로 확장할 필요가 있다.

## 3) 목표 원칙

댓글 기능은 아래 원칙을 따른다.

1. `읽기`는 공개, `쓰기`는 인증 사용자만 허용한다.
2. 댓글은 페이지 문맥에 묶인다. 처음에는 `페이지 단위`만 지원한다.
3. moderation 없는 자유 입력은 허용하지 않는다.
4. 구현 초기에는 기능을 작게 시작한다.

- 1차: 댓글 작성, 목록, 삭제/숨김
- 2차: 대댓글, 반응, 알림
- 3차: 섹션 단위 앵커 댓글, 관리자 응답 강조

## 4) 제품 요구사항

### 4.1 1차 범위

- 로그인 사용자만 댓글 작성 가능
- 비로그인 사용자는 댓글 읽기만 가능
- 댓글은 페이지 경로 기준으로 저장
- 최신순 또는 오래된순 정렬
- 작성자 표시
- 작성 시간 표시
- 관리자 숨김/삭제 가능

### 4.2 1차 제외

- 익명 댓글
- 대댓글
- 좋아요 / 리액션
- 실시간 알림
- 이미지 첨부
- Markdown 전체 허용

### 4.3 우선 적용 페이지

1. `/verification`
2. `/verification/results`
3. `/verification/pending`
4. `/engineering`
5. `/audit`
6. `/reference/faq`

이유:

- 18장, 19장 관련 페이지가 가장 질문과 피드백이 많이 발생할 가능성이 높다.
- FAQ와 Audit는 설명 보강 요청과 검증 질문이 모이기 쉽다.

## 5) 인증 정책

### 5.1 권장 방향

직접 비밀번호 인증을 구현하지 않고, 검증된 외부 인증 계층을 사용한다.

권장 후보:

1. `Supabase Auth`
2. `Auth.js / NextAuth + OAuth`
3. `Clerk`

현재 구조를 고려하면 가장 실용적인 선택지는 아래 둘 중 하나다.

- `Supabase Auth + Supabase Postgres`
- `Auth.js + Neon Postgres + Prisma`

### 5.2 1차 권장안

`Supabase Auth + Supabase Postgres`

이유:

- 인증과 DB를 한 번에 붙이기 쉽다.
- Next.js App Router와 잘 맞는다.
- 운영 초기의 구현 비용이 낮다.
- RLS(Row Level Security) 정책으로 기본 권한 제어가 가능하다.

## 6) 데이터 모델

### 6.1 핵심 테이블

#### `users`

- `id`
- `email`
- `display_name`
- `avatar_url`
- `role` (`user` | `admin` | `moderator`)
- `created_at`

#### `comments`

- `id`
- `page_path`
- `section_key` nullable
- `author_id`
- `body`
- `status` (`published` | `hidden` | `deleted`)
- `created_at`
- `updated_at`

#### `comment_reports`

- `id`
- `comment_id`
- `reporter_id`
- `reason`
- `created_at`

#### `comment_audit_log`

- `id`
- `comment_id`
- `actor_id`
- `action`
- `metadata`
- `created_at`

### 6.2 2차 확장 후보

- `comment_reactions`
- `comment_threads`
- `comment_mentions`
- `notifications`

## 7) UI / UX 설계

### 7.1 기본 구조

각 대상 페이지 하단에 아래 순서로 배치한다.

1. 댓글 섹션 제목
2. 현재 페이지 문맥 안내
3. 로그인 상태에 따른 작성 박스
4. 댓글 목록
5. 관리자 액션

### 7.2 상태별 UX

비로그인:

- 댓글 읽기 가능
- 작성 박스 대신 `로그인 후 댓글 작성` 버튼 노출

로그인:

- 텍스트 입력
- 작성 버튼
- 본인 댓글 수정/삭제 가능 여부는 2차에서 결정

관리자:

- 숨김
- 삭제
- 신고 목록 확인

### 7.3 카피 원칙

댓글 박스는 토론형 커뮤니티 톤이 아니라 `검증 질문 / 설명 보강 요청 / 기술 논의` 톤으로 유도한다.

예시:

- `이 페이지의 설명에서 모호한 점이나 검증 질문을 남겨 주세요.`
- `기술 함의에 대한 피드백도 환영하지만, 가능하면 구체적 문맥과 함께 남겨 주세요.`

## 8) 운영 정책

### 8.1 moderation

운영 초기에 반드시 필요한 기능:

- 관리자 숨김
- 관리자 삭제
- 신고 접수
- rate limit

### 8.2 스팸 방지

- 로그인 필수
- 동일 사용자 연속 작성 간 최소 시간 간격
- 분당/시간당 작성 수 제한
- 금칙어 또는 링크 과다 사용 차단

### 8.3 역할 정책

- `user`: 작성 / 본인 댓글 확인
- `moderator`: 숨김 / 신고 처리
- `admin`: 전체 삭제 / 운영 정책 변경

## 9) API 설계 초안

### 읽기

- `GET /api/comments?page_path=/verification/results`

### 작성

- `POST /api/comments`
- body:
  - `page_path`
  - `body`
  - optional `section_key`

### moderation

- `POST /api/comments/:id/hide`
- `POST /api/comments/:id/delete`
- `POST /api/comments/:id/report`

## 10) 구현 단계

### Phase 1

- 인증 솔루션 선택
- 환경변수 설계
- DB 연결 및 기본 스키마 생성

### Phase 2

- 댓글 읽기/작성 API 구현
- 페이지 하단 댓글 UI 1차 적용

### Phase 3

- moderation 및 rate limit 추가
- 운영자 권한 정책 반영

### Phase 4

- 우선 페이지에 댓글 섹션 배치
- UX 문구 및 empty state 정리

### Phase 5

- 대댓글, 반응, 섹션 앵커 댓글 검토

## 11) Definition of Done

- 인증 사용자만 댓글 작성 가능
- 주요 페이지에서 댓글 목록과 작성이 정상 동작
- 관리자 숨김/삭제 가능
- rate limit 동작
- 빌드 및 배포 환경에서 환경변수/DB 연결 확인 완료

## 12) 즉시 다음 액션

- [ ] 인증 방식 확정 (`Supabase` 우선 검토)
- [ ] DB 스키마 초안 작성
- [ ] 댓글 대상 페이지 목록 확정
- [ ] API 라우트와 UI 컴포넌트 골격 구현
