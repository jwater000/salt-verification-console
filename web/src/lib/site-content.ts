export type CoreChapterSummary = {
  num: string;
  href: string;
  title: string;
  oneLiner: string;
  keyQuestions: string[];
  status: "theory-core" | "testable" | "engineering";
  statusLabel: string;
  stage: "Problem" | "Concept" | "Verify" | "Bridge";
};

export type LogicMapStage = {
  id: "P" | "C1" | "C2" | "S" | "V";
  title: string;
  question: string;
  summary: string;
  chapters: string[];
  links: Array<{ href: string; label: string }>;
};

export type VerificationChannelSummary = {
  slug: string;
  title: string;
  fullTitle: string;
  tag: string;
  status: "locked";
  what: string;
  baseline: string;
  saltPrediction: string;
  datasets: string[];
  parameter: string;
  falsification: string;
  href: string;
};

export type CandidateHypothesis = {
  title: string;
  body: string;
  status: "pending";
  nextStep: string;
  chapterRefs: string[];
};

export const CORE_CHAPTERS: CoreChapterSummary[] = [
  {
    num: "17",
    href: "/core/chapters/17",
    title: "이론의 토대",
    oneLiner: "공간 밀도 구조 ρ, θ, L의 정의와 표준 이론과의 접점",
    keyQuestions: [
      "공간이 왜 비어 있지 않은가",
      "상태변수 세 개가 어떻게 관측량으로 연결되는가",
      "표준 모형과 어디서 갈라지는가",
    ],
    status: "theory-core",
    statusLabel: "이론 핵심",
    stage: "Concept",
  },
  {
    num: "18",
    href: "/core/chapters/18",
    title: "검증 채널과 판정",
    oneLiner: "LIV · 강중력장 지연 · HF-GW 꼬리 — 3개 고정 채널의 판정 구조",
    keyQuestions: [
      "SALT는 무엇으로 시험되는가",
      "판정 규칙은 어떻게 사전에 잠기는가",
      "후보 가설과 고정 채널의 차이는 무엇인가",
    ],
    status: "testable",
    statusLabel: "검증 대상",
    stage: "Verify",
  },
  {
    num: "19",
    href: "/core/chapters/19",
    title: "공학적 함의",
    oneLiner: "중력 · 전자기 · 강력 · 약력 · 양자 — 기술 분야별 SALT 재해석",
    keyQuestions: [
      "기존 기술이 SALT 언어로 어떻게 다르게 읽히는가",
      "어느 분야가 해석 재정렬이고, 어느 분야가 장기 가설인가",
      "검증 장(18장)과 어떻게 구분되는가",
    ],
    status: "engineering",
    statusLabel: "공학 가설",
    stage: "Bridge",
  },
];

export const LOGIC_MAP_STAGES: LogicMapStage[] = [
  {
    id: "P",
    title: "Problem",
    question: "왜 기존 이론의 설명 축만으로는 공간, 질량, 상호작용을 한 번에 읽기 어려운가",
    summary:
      "SALT는 중력의 위치, 질량의 기원, 미시-거시 연결을 각각 따로 두지 않고 하나의 구조 문제로 다시 묶는다.",
    chapters: ["00", "01~11", "21"],
    links: [
      { href: "/", label: "Introduction" },
      { href: "/reference/book-map", label: "Book Map" },
    ],
  },
  {
    id: "C1",
    title: "Clue",
    question: "빈 공간이 아니라 구조화된 공간이라는 단서가 어디서 나오는가",
    summary:
      "Casimir 효과, 진공 요동, 경로 의존 시간 지연 같은 현상은 공간을 단순 배경이 아니라 상태를 가진 매질처럼 읽도록 유도한다.",
    chapters: ["05", "06", "10", "17"],
    links: [
      { href: "/core", label: "Core" },
      { href: "/reference/visual-atlas", label: "Visual Atlas" },
    ],
  },
  {
    id: "C2",
    title: "Concept",
    question: "그 구조를 어떤 언어로 기술하는가",
    summary:
      "SALT는 ρ, θ, L 세 상태변수로 공간 구조를 기술하고, 저에너지 극한에서 GR로 복귀하는 조건을 명시한다.",
    chapters: ["12", "17"],
    links: [
      { href: "/core/chapters/17", label: "17장" },
      { href: "/reference/glossary", label: "Glossary" },
    ],
  },
  {
    id: "S",
    title: "Solution",
    question: "통일장 문제를 어떤 방식으로 다시 푸는가",
    summary:
      "단일 새로운 힘을 추가하는 대신, 공간 구조의 밀도와 전이 스케일이 질량, 지연, 잔차 패턴을 함께 설명할 수 있다는 해석으로 재구성한다.",
    chapters: ["17", "19", "21"],
    links: [
      { href: "/core/chapters", label: "Chapters" },
      { href: "/engineering", label: "Engineering" },
    ],
  },
  {
    id: "V",
    title: "Bridge to Verification",
    question: "이 해석이 단순 선언이 아니라 시험 가능한 구조임을 어떻게 보이는가",
    summary:
      "18장은 관측량, 비교식, 기각 조건을 먼저 잠그고 LIV, 강중력장 추가 지연, HF-GW 꼬리 세 채널에서 SALT와 기준선을 정량 비교한다.",
    chapters: ["18", "26", "27"],
    links: [
      { href: "/verification/channels", label: "Verification Channels" },
      { href: "/audit/reproduce", label: "Audit Trail" },
    ],
  },
];

export const VERIFICATION_CHANNELS: VerificationChannelSummary[] = [
  {
    slug: "liv",
    title: "LIV",
    fullTitle: "Lorentz Invariance Violation",
    tag: "고정 채널 1",
    status: "locked",
    what: "빛의 속도가 에너지에 따라 달라지는가",
    baseline: "Lorentz 불변 — 빛 속도는 에너지 무관",
    saltPrediction: "고밀도 경로를 지난 고에너지 광자가 저에너지 광자보다 미세하게 늦게 도달",
    datasets: ["GRB 시간 구조 데이터", "IceCube 고에너지 중성미자"],
    parameter: "ξ (LIV 파라미터)",
    falsification: "ξ ≤ 0 (에너지 무관 도달) → SALT LIV 항 기각",
    href: "/verification/channels/liv",
  },
  {
    slug: "gravity-delay",
    title: "강중력장 추가 지연",
    fullTitle: "Gravitational Path Delay Residual",
    tag: "고정 채널 2",
    status: "locked",
    what: "강중력장을 통과한 신호에 표준 기준선 이상의 지연 잔차가 있는가",
    baseline: "Shapiro 지연 — GR 기준 예측값",
    saltPrediction: "고밀도 구간의 ρ 구조가 GR 예측 외 추가 지연을 만든다",
    datasets: ["강중력장 통과 GW 이벤트", "중력렌즈 시간 지연"],
    parameter: "Δτ_SALT (추가 지연 잔차)",
    falsification: "SALT 오차 ≥ GR 기준 오차 → 추가 지연 기각",
    href: "/verification/channels/gravity-delay",
  },
  {
    slug: "hf-gw",
    title: "초고주파 GW 꼬리",
    fullTitle: "High-Frequency Gravitational Wave Tail",
    tag: "고정 채널 3",
    status: "locked",
    what: "병합 이후 잔차에 GR 예측 외 고주파 구조가 있는가",
    baseline: "GR 수치 상대론 — 병합 후 ringdown",
    saltPrediction: "병합 후 매질 복원 과정이 GR 예측 외 고주파 꼬리를 남긴다",
    datasets: ["LIGO/Virgo 병합 이벤트 ringdown 구간"],
    parameter: "f_tail (초고주파 잔차 강도)",
    falsification: "고주파 꼬리 구조 부재 → SALT 매질 복원 항 기각",
    href: "/verification/channels/hf-gw",
  },
];

export const CANDIDATE_HYPOTHESES: CandidateHypothesis[] = [
  {
    title: "중성미자 질량 구조",
    body: "세대별 질량 격차가 SALT 상태 전환 에너지와 대응하는가",
    status: "pending",
    nextStep: "관측량 정의와 자유 파라미터 잠금",
    chapterRefs: ["20", "26"],
  },
  {
    title: "암흑 물질 밀도 프로파일",
    body: "은하 회전 곡선 잔차가 ρ 구조 없이 설명되는가",
    status: "pending",
    nextStep: "은하 회전 곡선 데이터 기준선 정렬",
    chapterRefs: ["20", "27"],
  },
  {
    title: "허블 긴장 (H₀)",
    body: "근거리/원거리 H₀ 측정 차이에 경로 의존 보정이 기여하는가",
    status: "pending",
    nextStep: "근거리/원거리 샘플 분리와 보정식 고정",
    chapterRefs: ["20", "21"],
  },
  {
    title: "중력-강력 연결",
    body: "핵밀도 구간의 강력 결합 상수가 SALT ρ 보정을 요구하는가",
    status: "pending",
    nextStep: "핵밀도 구간 파라미터화와 비교식 작성",
    chapterRefs: ["19", "20"],
  },
  {
    title: "세대 문제",
    body: "3세대 쿼크/렙톤 구조가 상태 고착 계층과 대응하는가",
    status: "pending",
    nextStep: "세대별 질량비와 상태 전이 모델 연결",
    chapterRefs: ["16", "20"],
  },
];
