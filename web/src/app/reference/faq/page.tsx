import Link from "next/link";
import CommentsPanel from "@/components/comments-panel";

type FAQ = {
  q: string;
  a: string;
  category: string;
  links?: Array<{ href: string; label: string }>;
};

const FAQS: FAQ[] = [
  // 이론 관련
  {
    category: "이론",
    q: "SALT는 일반 상대론(GR)을 부정하는가?",
    a: "아니다. SALT는 GR을 포함하는 구조를 목표로 한다. ρ → 0 극한에서 SALT의 모든 식은 GR로 수렴하도록 설계됐다. GR이 맞는 조건(진공에 가까운 영역, 낮은 밀도)에서는 GR과 동일한 예측을 낸다. 예측 차이는 ρ가 유의하게 큰 강중력장, 초고에너지 채널, 병합 이벤트 직후 구간에서만 나타난다.",
    links: [{ href: "/core/chapters/17", label: "17장 — 저에너지 GR 정합" }],
  },
  {
    category: "이론",
    q: "SALT는 표준 모형을 대체하는가?",
    a: "현재 단계에서는 아니다. SALT는 표준 모형이 설명하는 현상을 다른 언어(공간 밀도 구조)로 재해석하는 데 중점을 둔다. 예측 차이가 나타나는 영역은 현재 3개 고정 채널(LIV, 강중력장 지연, HF-GW 꼬리)로 제한된다. 표준 모형이 잘 맞는 저에너지 영역에서는 SALT도 동일한 결과를 낸다.",
  },
  {
    category: "이론",
    q: "공간 밀도 ρ는 암흑 에너지와 같은 개념인가?",
    a: "직접 동일시하지 않는다. 암흑 에너지는 우주 팽창 가속을 설명하는 현상론적 항이고, SALT의 ρ는 국소 공간 구조를 기술하는 상태변수다. 개념적 유사성은 있으나, SALT는 ρ가 구체적인 관측 흔적(시간 지연, 잔차 구조)으로 시험 가능하다는 점을 강조한다.",
  },
  // 검증 관련
  {
    category: "검증",
    q: "현재 검증 결과만으로 SALT의 타당성이 확정되는가?",
    a: "아니다. 현재 결과는 고정된 3개 채널에서 SALT 오차가 표준 기준선 오차보다 작은 항목이 어떻게 나타나는지를 frozen 데이터 기준으로 집계한 것이다. 이는 일부 채널에서 관찰된 비교 결과이며, 이론 전체의 타당성을 단정하는 자료는 아니다. 일부 채널은 아직 insufficient_data 또는 inconclusive 상태다.",
    links: [
      { href: "/verification", label: "Verification — 판정 상태" },
      { href: "/verification/results", label: "판정 결과 상세" },
    ],
  },
  {
    category: "검증",
    q: "고정 검증 채널 3개는 왜 3개인가? 더 많아야 하지 않는가?",
    a: "27장이 정한 운영 기준에 따르면, 판정 규칙이 완전히 잠긴 채널만을 '고정 채널'로 분류한다. 나머지 후보 가설들(중성미자 질량, 암흑 물질 등)은 형식화는 됐으나 아직 관측량-비교식-기각 조건이 동시에 잠기지 않았다. 검증 경로가 확정될 때마다 채널 수가 늘어날 수 있다.",
  },
  {
    category: "검증",
    q: "데이터를 보기 전에 판정 규칙을 잠근다는 것이 왜 중요한가?",
    a: "데이터를 먼저 보고 기각 기준을 조정하면 결과 해석이 입력 데이터에 따라 흔들릴 수 있다. 이 사이트는 관측량 정의 → 비교식 고정 → 기각 조건 명시 → frozen 데이터 적용의 순서를 기준으로 삼는다. 이 절차가 지켜졌는지는 manifest hash와 재현 명령으로 다시 확인할 수 있다.",
    links: [{ href: "/audit/reproduce", label: "Audit — 재현 방법" }],
  },
  {
    category: "검증",
    q: "LIV 시험이 SALT만의 것인가? 다른 이론도 LIV를 시험하지 않는가?",
    a: "LIV 시험 자체는 Lorentz 불변성에 민감한 모든 대안 이론에서 사용한다. SALT의 차이는 LIV 파라미터 ξ가 구체적으로 공간 밀도 ρ 구조와 연결된다는 점이다. 따라서 다른 LIV 이론과 동일한 데이터를 사용하면서도, SALT는 ξ의 크기와 에너지 의존성에 대한 특정 예측을 낸다.",
  },
  // 공학 관련
  {
    category: "공학",
    q: "19장의 기술 응용 시나리오는 언제 실현되는가?",
    a: "19장은 현재 구현 가능한 기술 로드맵이 아니다. SALT 해석이 참일 경우 기존 기술이 어떻게 다르게 읽히는지(해석 재정렬), 그리고 어떤 새로운 설계 방향이 열릴 수 있는지(설계 가설)를 정리한 것이다. 장기 예측 항목은 검증 경로가 아직 명시되지 않은 공학적 상상이다.",
    links: [{ href: "/engineering", label: "Engineering — 분야별 상세" }],
  },
  {
    category: "공학",
    q: "GPS가 이미 SALT를 검증했다고 볼 수 있는가?",
    a: "아니다. GPS의 Shapiro 지연 보정은 GR 예측으로 설명된다. SALT는 그 보정을 ρ 경로 의존 지연으로 '재해석'할 수 있다고 말하지만, 이 재해석이 추가적인 예측 차이를 만들어야 SALT만의 검증이 된다. 그 추가 잔차가 강중력장 추가 지연 채널(Δτ_SALT)의 시험 대상이다.",
  },
  // 방법론 관련
  {
    category: "방법론",
    q: "frozen 데이터셋이란 무엇이고 왜 필요한가?",
    a: "공개 데이터는 지속적으로 업데이트된다. 새 데이터가 들어올 때마다 결과가 바뀌면 재현성이 없어진다. frozen 데이터셋은 특정 시점의 데이터를 SHA-256 hash로 잠가 동일 조건의 반복 계산을 보장한다. 새 데이터를 사용하려면 새 버전의 frozen 데이터셋을 별도로 생성한다.",
    links: [{ href: "/audit/datasets", label: "Audit — 데이터셋 목록" }],
  },
  {
    category: "방법론",
    q: "SALT가 불리할 때도 결과를 공개하는가?",
    a: "그렇다. 현재 검증 결과에는 SALT가 표준 기준선보다 좋은 항목뿐 아니라 동률(TIE) 및 기준선 우세 항목도 포함된다. insufficient_data나 inconclusive 판정도 함께 공개한다. 결과 해석의 폭을 줄이기 위해 집계 가능한 판정은 같은 기준으로 함께 제시한다.",
    links: [{ href: "/verification/results", label: "판정 결과 상세" }],
  },
];

const CATEGORIES = Array.from(new Set(FAQS.map((f) => f.category)));
const CAT_COLOR: Record<string, string> = {
  이론: "bg-violet-500/10 text-violet-300",
  검증: "bg-cyan-500/10 text-cyan-300",
  공학: "bg-emerald-500/10 text-emerald-300",
  방법론: "bg-amber-500/10 text-amber-300",
};

export default function FAQPage() {
  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="panel px-8 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Reference · FAQ
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">
          읽다가 가장 자주 걸리는 오해를
          <br />
          먼저 걷어내는 질문들
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
          SALT를 읽을 때 막히는 지점은 대체로 비슷하다. GR을 부정하는지, 검증 결과가 어디까지 말해 주는지,
          공학적 상상이 곧바로 기술 주장인지 같은 질문들이다. 이곳은 그런 오해를 미리 풀어 독해의 마찰을
          줄이는 페이지다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat}`}
              className={`rounded-full px-3 py-0.5 text-xs font-medium ${CAT_COLOR[cat]}`}
            >
              {cat} ({FAQS.filter((f) => f.category === cat).length})
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-violet-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">이론에서 자주 걸리는 질문</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            SALT가 GR이나 표준 모형을 부정하는지처럼 가장 먼저 생기는 오해를 푼다.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">검증에서 자주 생기는 착각</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            일부 결과가 전체 이론 확정을 뜻하는지, 왜 채널 수가 제한되는지 같은 질문을 정리한다.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">방법론에서 헷갈리는 부분</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            frozen 데이터셋, 판정 규칙 잠금, 공개 실패 사례 같은 운영 원칙을 해설한다.
          </p>
        </div>
      </div>

      {/* FAQs by category */}
      {CATEGORIES.map((cat) => {
        const items = FAQS.filter((f) => f.category === cat);
        return (
          <div key={cat} id={`cat-${cat}`} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CAT_COLOR[cat]}`}>
                {cat}
              </span>
            </div>
            {items.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/40 px-6 py-5">
                <p className="text-base font-bold text-white">{faq.q}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{faq.a}</p>
                {faq.links && faq.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {faq.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-cyan-400 transition hover:border-cyan-500/40 hover:text-white"
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Back */}
      <div className="border-t border-slate-800 pt-4">
        <Link href="/reference" className="text-sm text-slate-400 hover:text-white">
          ← Reference 허브
        </Link>
      </div>

      <CommentsPanel
        pagePath="/reference/faq"
        description="FAQ 답변 중 더 풀어 써야 할 부분이나 새로 추가해야 할 질문을 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
