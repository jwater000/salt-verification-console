# SVC 도서 핵심 레퍼런스형 웹 리엔지니어링 실행 계획서

최종 업데이트: `2026-04-01`

## 1) 목적

이 문서는 현재 `salt-verification-console` 웹을 단순 발췌/나열형 구조에서, 책의 핵심 논리와 검증·공학 함의를 빠르게 이해할 수 있는 `도서 레퍼런스형 웹`으로 재설계하기 위한 실행 계획서다.

이번 계획의 목표는 3가지다.

- 책 전체를 다 읽지 않아도 독자가 `핵심 주장`, `검증 채널`, `기술적 함의`를 구조적으로 파악하게 만든다.
- 현재 업데이트된 본문과 이미지 자산을 웹에서 다시 압축·정렬해, 책을 읽는 중간 참고서 역할을 하게 만든다.
- 특히 18장, 19장의 강점을 살려 `검증 가능성`과 `공학적 상상력`을 시각적으로 부각한다.

## 2) 현재 상태 진단

### 2.1 구조 진단

현재 웹은 `web/src/app/page.tsx`에서 `/evaluation`로 즉시 리다이렉트된다. 즉 첫 진입점이 독자용 서문이 아니라 `검증 리포트`다.

또한 현재 상단 IA는 아래처럼 운영 보고서 중심이다.

- `검증 결과 보고`
- `예측`
- `Engineering`
- `도서 발췌`
- `재현 방법`

이 구조는 검증 콘솔로서는 맞지만, 책 독자가 핵심을 익히기에는 다음 한계가 있다.

- 책의 핵심 논리 흐름이 장별로 구조화되어 있지 않다.
- 본문 요약이 `핵심 질문 -> 요지 -> 그림 -> 관련 검증/기술 페이지`로 연결되지 않는다.
- `도서 발췌`가 사실상 `g00~g33 이미지 카탈로그`에 가깝다.
- `Engineering` 페이지도 19장의 일부를 압축한 마크다운 출력이어서, 기술 분야별 비교·시각 강조·실행 맥락이 약하다.
- 독자 입장에서 `무엇이 이미 판정된 것인지`, `무엇이 설명용 가설인지`, `무엇이 장기 공학 상상인지`를 빠르게 구분하기 어렵다.

### 2.2 콘텐츠 진단

현재 본문 반영 방식은 `한 장 전체를 마크다운으로 출력`하는 비중이 크다. 이 방식은 원문 보존에는 유리하지만 웹에서의 정보 전달 효율은 떨어진다.

대표 문제는 아래와 같다.

- 긴 문단이 많아 스캐닝 속도가 느리다.
- 표와 그림이 `설명 흐름 속에 묻혀` 핵심 메시지로 떠오르지 않는다.
- 책의 업데이트가 웹 구조에 자동 반영되지 않고, 사람이 따로 발췌해야 한다.
- 본문 핵심 문장을 `요약 카드`, `도해 캡션`, `판정 배지`, `비교표` 같은 웹 전용 단위로 재가공하는 계층이 없다.

### 2.3 18장/19장 관점의 진단

18장은 시각화에 유리한 요소가 매우 많다.

- 고정 검증 채널 3개
- 관측 흔적 유형 분류
- 기준 모델/자유 파라미터/기각 조건 표
- 판정 가능 채널과 설명용 가설의 구분
- `무엇을 직접 보고 무엇을 간접 시험하는가`라는 강한 질문 구조

19장 역시 시각화에 유리하다.

- 중력/전자기/강력/약력/통합기술의 섹션 분리
- 기존 해석 vs SALT 해석의 반복 비교 구조
- 공학적 함의가 분야별 카드로 잘 쪼개질 수 있음
- 양자컴퓨터, 홀로그래피, 메모리, 항법 등 독자의 주목을 끌기 쉬운 사례가 많음

반면 현재 웹은 이 장점들을 `시각적 모듈`로 승격하지 못하고 있다.

## 3) 리엔지니어링 방향

### 3.1 웹의 역할 재정의

개편 후 웹은 다음 세 역할을 동시에 수행해야 한다.

1. `검증 콘솔`
2. `도서 핵심 레퍼런스`
3. `시각적 개념 안내서`

이때 검증 콘솔 기능을 버리는 것이 아니라, 독자용 진입 계층을 그 위에 하나 더 올리는 방식으로 설계한다.

### 3.2 핵심 UX 원칙

- 첫 화면에서 `책이 무엇을 말하는지`가 먼저 보여야 한다.
- 각 페이지는 긴 본문보다 `핵심 질문`, `핵심 답변`, `근거 그림`, `관련 장`, `관련 검증 링크` 순서로 읽혀야 한다.
- `확정된 검증`, `검증 대기`, `설명용 가설`, `장기 공학 가설`은 색과 배지로 구분해야 한다.
- 책 전체를 그대로 옮기지 말고, `웹에서 필요한 최소 핵심`만 재구성해야 한다.
- 이미지 카탈로그는 보조 자료로 내리고, 의미 단위별 `큐레이션 갤러리`를 전면에 둔다.

## 4) 목표 정보구조(IA)

### 4.1 최상위 IA 제안

기존 상단 구조를 아래처럼 재정렬한다.

1. `Guide`
2. `Core Ideas`
3. `Verification`
4. `Engineering`
5. `Reference`
6. `Audit`

각 메뉴의 역할은 다음과 같다.

- `Guide`: 처음 온 독자를 위한 입문 허브
- `Core Ideas`: 책 핵심 논리, 개념 지도, 장별 압축
- `Verification`: 18장 중심의 검증 채널과 실제 판정/데이터 연결
- `Engineering`: 19장 중심의 기술 재해석과 장기 공학 가설
- `Reference`: 도해, 용어, 장별 요약, FAQ
- `Audit`: 재현성, 데이터셋, 공식, 실행 provenance

### 4.2 권장 라우트 트리

```text
/
├─ /guide
├─ /core
│  ├─ /core/logic-map
│  ├─ /core/chapters
│  ├─ /core/chapters/17
│  ├─ /core/chapters/18
│  └─ /core/chapters/19
├─ /verification
│  ├─ /verification/overview
│  ├─ /verification/channels
│  ├─ /verification/channels/liv
│  ├─ /verification/channels/gravity-delay
│  ├─ /verification/channels/hf-gw
│  └─ /verification/candidate-hypotheses
├─ /engineering
│  ├─ /engineering/overview
│  ├─ /engineering/gravity
│  ├─ /engineering/electromagnetism
│  ├─ /engineering/strong-force
│  ├─ /engineering/weak-force
│  └─ /engineering/quantum-holography
├─ /reference
│  ├─ /reference/visual-atlas
│  ├─ /reference/glossary
│  ├─ /reference/faq
│  └─ /reference/book-map
└─ /audit
```

### 4.3 라우트 정책

- 기존 `/evaluation`, `/predictions`, `/engineering`, `/book/excerpts`, `/audit/*`는 당장 제거하지 않고 호환 유지한다.
- 신규 상위 구조를 먼저 도입하고, 기존 라우트는 점진적으로 신규 페이지로 리다이렉트하거나 `legacy` 성격으로 축소한다.
- `/`는 더 이상 `/evaluation`로 즉시 넘기지 않고, `Guide` 또는 `Guide + 핵심 지표` 페이지로 전환한다.

## 5) 콘텐츠 모델 재설계

### 5.1 필요한 새 콘텐츠 단위

현재는 `route markdown`과 `page markdown` 중심이다. 여기에 아래 단위를 추가해야 한다.

- `chapter_summary`
- `concept_card`
- `visual_asset`
- `verification_channel`
- `engineering_domain`
- `status_badge`
- `related_links`

### 5.2 추천 데이터 스키마

웹 전용 콘텐츠를 JSON 또는 TS object로 분리해 아래 형식으로 관리하는 것이 좋다.

```ts
type ChapterSummary = {
  chapter: "17" | "18" | "19";
  title: string;
  one_liner: string;
  key_questions: string[];
  takeaways: string[];
  related_visual_ids: string[];
  status: "theory-core" | "testable" | "engineering";
};

type VisualAsset = {
  id: string;
  image_path: string;
  title: string;
  caption: string;
  chapter_refs: string[];
  themes: string[];
};

type VerificationChannel = {
  slug: "liv" | "gravity-delay" | "hf-gw";
  title: string;
  what_changes: string;
  baseline: string;
  dataset: string[];
  parameter: string[];
  falsification: string;
  status: "locked" | "candidate";
};

type EngineeringDomain = {
  slug: string;
  title: string;
  conventional_view: string;
  salt_view: string;
  implications: string[];
  maturity: "interpretive" | "speculative" | "long-term";
};
```

### 5.3 본문 연동 원칙

- 책 원문은 `정본`
- 웹 콘텐츠는 `압축된 안내층`
- 원문 수정이 있을 때 웹에서 영향받는 항목을 재생성할 수 있도록 `chapter -> summary blocks` 맵을 유지

즉 웹은 본문 복사본이 아니라, 본문에서 추출된 구조화 산출물이어야 한다.

## 6) 18장 특화 설계

### 6.1 페이지 목표

18장은 독자에게 다음 질문에 답해야 한다.

- SALT는 무엇으로 시험되는가
- 실제로 고정된 검증 채널은 몇 개인가
- 무엇이 확정 판정 대상이고 무엇이 아직 후보 가설인가
- 각 채널은 어떤 데이터와 어떤 반증 기준을 갖는가

### 6.2 권장 화면 모듈

18장 전용 페이지는 아래 모듈로 구성한다.

1. `Hero Question`
   - 제목: `SALT는 무엇으로 시험되는가`
   - 부제: `직접 관측이 아니라 관측 흔적의 정량 비교`

2. `상태변수 -> 관측 흔적 매핑 다이어그램`
   - `rho`, `theta`, `L`이 각각 어떤 관측 흔적으로 나타나는지 시각화
   - 화살표형 또는 Sankey 유사 구조 추천

3. `고정 검증 채널 3열 카드`
   - LIV
   - 강중력장 추가 지연/렌즈 잔차
   - 초고주파 중력파 꼬리
   - 각 카드에 `기준 모델`, `자유 파라미터`, `핵심 데이터`, `기각 조건` 요약

4. `판정 상태 보드`
   - `고정 기준 채널`
   - `설명용 가설`
   - `후속 형식화 필요`
   - 독자가 수준 차이를 한 번에 보게 해야 함

5. `검증 경로 타임라인`
   - `관측량 고정 -> 비교식 고정 -> 판정 규칙 고정 -> 감사 항목 기록`

6. `후보 가설 묶음`
   - 중성미자 질량
   - 암흑 물질
   - 허블 긴장
   - 중력-강력 연결
   - 세대 문제
   - 이 영역은 시각적으로 `검증 대기`가 분명해야 함

### 6.3 시각화 우선순위

18장에서 가장 먼저 구현해야 할 시각화는 아래 3개다.

- `검증 채널 3종 비교 매트릭스`
- `상태변수-관측흔적 관계도`
- `고정 채널 vs 후보 가설 분류 보드`

### 6.4 메시지 관리 원칙

18장 웹 카피는 반드시 아래 선을 지켜야 한다.

- 이미 판정 규칙이 잠긴 채널과 그렇지 않은 항목을 혼동시키지 않는다.
- `직접 관측`이라는 오해를 줄이고 `간접 흔적 정량 비교`라는 점을 반복 고정한다.
- 26장 프로토콜과의 연결을 시각적으로 명시한다.

## 7) 19장 특화 설계

### 7.1 페이지 목표

19장은 독자에게 다음을 전달해야 한다.

- SALT가 현재 기술을 어떻게 다르게 읽는가
- 어떤 분야가 해석 재정렬 단계인지, 어떤 분야가 장기 공학 가설인지
- 기술 사례들이 단순 공상인지, 아니면 기존 기술을 다시 해석하는 프레임인지

### 7.2 권장 화면 모듈

19장 전용 페이지는 아래 구조가 적합하다.

1. `Hero Grid`
   - 중력
   - 전자기력
   - 강력/핵력
   - 약력
   - 양자컴퓨터/홀로그래피

2. `기존 해석 vs SALT 해석` 비교 카드
   - 한 줄 비교가 아니라, 분야별 2열 매트릭스로 구성
   - 독자가 차이를 즉시 스캔할 수 있어야 함

3. `공학적 함의 수준 배지`
   - `현재 기술 재해석`
   - `설계 직관`
   - `장기 가설`

4. `대표 사례 하이라이트`
   - GPS/정밀시계
   - 플래시 메모리/DRAM/HBM
   - 양자컴퓨터
   - 홀로그래피
   - 핵반응 센서

5. `기술 계통도`
   - 힘/상호작용별로 기술이 어떻게 묶이는지 보여 주는 맵

### 7.3 시각화 우선순위

19장에서 가장 효과적인 시각화는 아래와 같다.

- `기술 분야 x 해석 수준` 히트맵
- `기존 해석 vs SALT 해석` 비교 테이블
- `실제 구현 중 / 해석 단계 / 장기 가설` 성숙도 배지 시스템

### 7.4 메시지 관리 원칙

- 19장의 내용은 `검증 완료 결과`가 아니라 `기술 재해석과 장기 설계 가설`임을 명확히 해야 한다.
- 과장된 미래 기술 톤보다, `현재 기술을 다시 읽는 프레임`을 먼저 강조해야 한다.
- 독자가 흥미를 느끼되, 검증 장과 혼동하지 않게 분리해야 한다.

## 8) 도해/이미지 전략

### 8.1 현재 문제

현재 `도서 발췌`는 도해를 번호순으로 길게 나열한다. 이는 아카이브로는 유효하지만 의미 단위 탐색에는 비효율적이다.

### 8.2 목표 상태

이미지는 번호순이 아니라 `의미 묶음`으로 재조직한다.

권장 묶음은 아래와 같다.

- `문제 제기`
- `개념 전환`
- `통합 구조`
- `검증 채널`
- `공학 함의`
- `감사/프로토콜`

### 8.3 실행 원칙

- 각 이미지에는 반드시 `무엇을 설명하는 그림인지` 한 줄 캡션이 붙어야 한다.
- 동일 이미지를 여러 장에서 참조할 수 있어야 한다.
- 18장, 19장 관련 이미지는 `chapter spotlight` 섹션에서 크게 재사용한다.
- `전체 카탈로그`는 `Reference > Visual Atlas`로 이동시키고, 메인 동선에서는 큐레이션된 이미지 세트만 노출한다.

## 9) 컴포넌트 리엔지니어링 범위

### 9.1 신규 컴포넌트

- `ChapterHero`
- `KeyQuestionList`
- `TakeawayCards`
- `StatusBadge`
- `ComparisonMatrix`
- `VisualSpotlight`
- `VerificationChannelCard`
- `MaturityBadge`
- `VisualAtlasGrid`
- `ChapterNavigator`

### 9.2 교체 대상

- 현재 `SiteStructureMap`은 운영 보고 구조를 강조하므로, 독자 모드 기준 상단 내비로 교체 또는 이중화해야 한다.
- `book/excerpts`는 긴 이미지 페이지 대신 `Reference` 하위로 축소 재편한다.
- `engineering/page.tsx`처럼 마크다운을 통째로 출력하는 방식은 19장 특화 페이지에서는 사용하지 않는다.

### 9.3 스타일 방향

- 지금의 어두운 검증 콘솔 톤은 유지하되, 독자 가이드를 위한 `명확한 계층 대비`를 강화한다.
- 카드, 배지, 선형 도식, 비교표 중심의 시각 언어를 사용한다.
- 18장은 `정밀/판정/프로토콜`, 19장은 `응용/영역/가능성`의 톤 차이를 색과 레이아웃으로 구분한다.

## 10) 구현 페이즈

### Phase 0. 정렬 및 원칙 확정

- 목적: 책 웹의 역할과 구분 기준 확정
- 작업:
  - `검증`, `후보 가설`, `기술 재해석`, `장기 가설` 표기 규칙 정의
  - 18장/19장 핵심 요약 문안 확정
  - 이미지-장-주제 매핑표 작성

### Phase 1. 정보구조 개편

- 목적: 독자용 진입 계층 추가
- 작업:
  - `/`를 `Guide` 중심 홈으로 전환
  - 상단 IA를 `Guide/Core/Verification/Engineering/Reference/Audit`로 재구성
  - 기존 라우트 호환 정책 적용

### Phase 2. 콘텐츠 모델 도입

- 목적: 본문을 웹 전용 요약 단위로 구조화
- 작업:
  - `chapter summaries` 데이터 파일 작성
  - `visual asset registry` 작성
  - 18장/19장 전용 structured content 파일 작성

### Phase 3. 18장 특화 페이지 구현

- 목적: 검증 장을 웹의 대표 해설 페이지로 승격
- 작업:
  - 검증 채널 카드
  - 상태변수-관측흔적 다이어그램
  - 고정 채널 vs 후보 가설 보드
  - 26장 프로토콜 연결

### Phase 4. 19장 특화 페이지 구현

- 목적: 공학 장을 시각적 하이라이트 페이지로 승격
- 작업:
  - 기술 분야별 모듈
  - 기존 해석 vs SALT 해석 비교 매트릭스
  - 성숙도/함의 배지
  - 사례 중심 시각 요약

### Phase 5. Reference 재편

- 목적: 기존 발췌/도해 페이지를 레퍼런스형으로 정리
- 작업:
  - `도서 발췌`를 `Book Map + Visual Atlas + Glossary + FAQ`로 분해
  - 전체 이미지 카탈로그는 보조 정보로 이동
  - 장별 추천 읽기 순서와 관련 링크 강화

### Phase 6. 검증 및 운영

- 목적: 개편 후 정보 전달 성능 검증
- 작업:
  - 독자 테스트
  - 주요 페이지 체류/이탈 확인
  - 본문 수정 시 웹 반영 체크리스트 운영

## 11) 우선순위

가장 먼저 해야 할 일은 아래 순서가 맞다.

1. 홈을 `/evaluation` 리다이렉트 구조에서 해제
2. 18장, 19장 전용 structured content 작성
3. 신규 IA 상단 내비 도입
4. 18장 특화 페이지 구현
5. 19장 특화 페이지 구현
6. `도서 발췌`를 `Reference` 구조로 축소 이관

즉 이번 개편의 핵심은 `페이지를 더 많이 만드는 것`이 아니라, `18장과 19장을 대표 진입 자산으로 세워 전체 웹의 성격을 바꾸는 것`이다.

## 12) 산출물 정의

이번 리엔지니어링에서 최소 산출물은 아래와 같다.

- 신규 IA 문서 1건
- 18장 structured content 파일 1건
- 19장 structured content 파일 1건
- 신규 홈/가이드 페이지 1건
- 18장 특화 페이지 1건
- 19장 특화 페이지 1건
- visual asset registry 1건
- reference 개편 페이지 세트 1식

## 13) 완료 기준(Definition of Done)

- 첫 방문자가 홈에서 15초 안에 `SALT 핵심`, `검증 가능성`, `기술 함의`를 구분할 수 있다.
- 18장 페이지에서 고정 검증 채널 3개와 후보 가설의 차이를 한 화면 안에서 이해할 수 있다.
- 19장 페이지에서 기술 사례가 `현재 재해석`인지 `장기 가설`인지 혼동 없이 구분된다.
- 이미지가 번호 나열이 아니라 의미 기반 큐레이션으로 읽힌다.
- 본문 업데이트가 생겨도 structured content만 갱신하면 웹 반영 범위를 관리할 수 있다.

## 14) 즉시 착수 권고

- [ ] `/` 리다이렉트 제거 및 `Guide` 홈 설계
- [ ] 18장 핵심 문단을 `질문/채널/판정/후보 가설` 단위로 재분해
- [ ] 19장 핵심 문단을 `분야/기존 해석/SALT 해석/함의 수준` 단위로 재분해
- [ ] 이미지 자산에 `chapter/theme/caption` 메타데이터 부여
- [ ] `book/excerpts`를 legacy 카탈로그로 재정의

## 15) 기존 문서와의 관계

이 문서는 아래 기존 문서를 대체하지 않고, `도서 핵심 레퍼런스형 개편` 관점에서 보완한다.

- [`SVC_SITE_REDESIGN_PROPOSAL.md`](/home/jwater/Development/salt-verification-console/docs/roadmap/SVC_SITE_REDESIGN_PROPOSAL.md)
- [`SVC_UI_IA_ROUTE_TREE.md`](/home/jwater/Development/salt-verification-console/docs/roadmap/SVC_UI_IA_ROUTE_TREE.md)
- [`SVC_V2_EXECUTION_SPEC.md`](/home/jwater/Development/salt-verification-console/docs/roadmap/SVC_V2_EXECUTION_SPEC.md)

차이는 명확하다.

- 기존 문서가 `검증 콘솔/증빙 구조`에 초점을 두었다면
- 이 문서는 `책의 알짜 내용을 독자 친화적으로 재구성하는 계층`에 초점을 둔다.
