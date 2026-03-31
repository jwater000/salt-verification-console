import Link from "next/link";

type Term = {
  term: string;
  symbol?: string;
  category: string;
  standard: string;
  salt: string;
  note?: string;
};

const TERMS: Term[] = [
  {
    term: "공간 밀도",
    symbol: "ρ",
    category: "상태변수",
    standard: "진공 = 에너지 0의 빈 공간 (기본 상태)",
    salt: "공간의 국소 에너지 밀도. ρ > 0 인 구간에서 신호 전파 조건이 달라진다.",
    note: "SALT의 모든 예측 차이는 ρ가 실재한다는 가정에서 출발한다.",
  },
  {
    term: "장력각",
    symbol: "θ",
    category: "상태변수",
    standard: "해당 없음",
    salt: "밀도 경계의 방향성. 렌즈 잔차, 편광 방향 오프셋에 흔적을 남긴다.",
  },
  {
    term: "특성 길이",
    symbol: "L",
    category: "상태변수",
    standard: "해당 없음",
    salt: "구조 전환의 공간 스케일. HF-GW 꼬리 주파수 범위를 결정한다.",
  },
  {
    term: "유효 광속",
    symbol: "c_eff",
    category: "파생 변수",
    standard: "c — 에너지·매질 무관 상수 (진공)",
    salt: "c_eff(ρ) = c / n(ρ). ρ→0 에서 c_eff→c 로 복귀. GR 정합 보장.",
  },
  {
    term: "LIV 파라미터",
    symbol: "ξ",
    category: "검증 파라미터",
    standard: "0 — Lorentz 불변 (에너지 의존 지연 없음)",
    salt: "ξ > 0 이면 에너지 의존 지연 존재. 현재 GRB 데이터로 시험 중.",
    note: "ξ ≤ 0 → LIV 항 기각",
  },
  {
    term: "추가 지연 잔차",
    symbol: "Δτ_SALT",
    category: "검증 파라미터",
    standard: "0 — Shapiro 지연이 전부",
    salt: "GR Shapiro 지연 외 추가 지연. 강중력장 통과 경로에서 측정.",
    note: "Δτ_SALT ≤ 0 → 추가 지연 기각",
  },
  {
    term: "HF-GW 꼬리",
    symbol: "f_tail",
    category: "검증 파라미터",
    standard: "0 — ringdown이 GR quasi-normal mode로 완결",
    salt: "병합 후 매질 복원이 만드는 고주파 잔차. L 스케일로 주파수 범위가 결정된다.",
    note: "노이즈 수준과 구분 불가 → 매질 복원 항 기각",
  },
  {
    term: "보셀",
    symbol: undefined,
    category: "SALT 전용 개념",
    standard: "해당 없음",
    salt: "공간 밀도 구조의 기본 격자 단위. 유한 격자 가정의 기본 요소.",
  },
  {
    term: "고정 검증 채널",
    symbol: undefined,
    category: "방법론",
    standard: "해당 없음",
    salt: "데이터를 보기 전에 관측량·비교식·기각 조건이 모두 잠긴 시험 경로. 현재 3개.",
    note: "후보 가설(검증 대기)과 구분해야 한다.",
  },
  {
    term: "frozen 데이터셋",
    symbol: undefined,
    category: "방법론",
    standard: "해당 없음",
    salt: "판정에 사용되는 고정 버전 데이터셋. hash로 무결성이 잠긴다. 업데이트 시 새 버전으로 분리.",
  },
  {
    term: "Shapiro 지연",
    symbol: undefined,
    category: "표준 이론 용어",
    standard: "중력장 내에서 빛이 겪는 시간 지연. GR에서 유도. 거리에 따른 적분.",
    salt: "SALT 채널 2의 기준 모델. Δτ_SALT는 이것을 뺀 잔차다.",
  },
  {
    term: "ADM 분해",
    symbol: undefined,
    category: "수학 / 방법론",
    standard: "Arnowitt-Deser-Misner. 시공간을 공간 슬라이스 + 시간 발전으로 분해하는 방법.",
    salt: "26장에서 SALT 방정식의 독립 자유도와 ghost 제거 확인에 사용된다.",
  },
  {
    term: "해석 재정렬",
    symbol: undefined,
    category: "19장 개념",
    standard: "해당 없음",
    salt: "기존 기술의 공식·결과는 유지하면서 물리적 의미를 SALT 언어로 다시 읽는 단계. 반도체, GPS 보정이 예시.",
  },
  {
    term: "설계 가설",
    symbol: undefined,
    category: "19장 개념",
    standard: "해당 없음",
    salt: "해석 재정렬에서 나온 직관이 새로운 설계 방향을 제안하는 단계. 검증 경로 미확정.",
  },
];

const CATEGORIES = Array.from(new Set(TERMS.map((t) => t.category)));

const CAT_COLOR: Record<string, string> = {
  "상태변수": "bg-violet-500/10 text-violet-300",
  "파생 변수": "bg-sky-500/10 text-sky-300",
  "검증 파라미터": "bg-cyan-500/10 text-cyan-300",
  "SALT 전용 개념": "bg-emerald-500/10 text-emerald-300",
  "방법론": "bg-amber-500/10 text-amber-300",
  "표준 이론 용어": "bg-slate-700 text-slate-300",
  "수학 / 방법론": "bg-slate-700 text-slate-300",
  "19장 개념": "bg-rose-500/10 text-rose-300",
};

export default function GlossaryPage() {
  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="panel px-8 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Reference · Glossary
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">용어 사전</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300">
          SALT 핵심 용어와 표준 이론 용어의 정의 및 대응 관계.
          각 항목은 표준 이론에서의 의미와 SALT에서의 재해석을 나란히 보여준다.
        </p>
        {/* Category filter index */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat}`}
              className={`rounded-full px-3 py-0.5 text-xs font-medium ${CAT_COLOR[cat] ?? "bg-slate-800 text-slate-400"}`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Terms by category */}
      {CATEGORIES.map((cat) => {
        const items = TERMS.filter((t) => t.category === cat);
        return (
          <div key={cat} id={`cat-${cat}`}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CAT_COLOR[cat] ?? "bg-slate-800 text-slate-400"}`}>
                {cat}
              </span>
              <span className="text-xs text-slate-600">{items.length}개</span>
            </div>
            <div className="space-y-2">
              {items.map((term) => (
                <div
                  key={term.term}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-4"
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-white">{term.term}</p>
                      {term.symbol && (
                        <code className="rounded bg-slate-800 px-2 py-0.5 text-sm font-bold text-cyan-300">
                          {term.symbol}
                        </code>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                        표준 이론
                      </p>
                      <p className="text-sm leading-relaxed text-slate-400">{term.standard}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        SALT
                      </p>
                      <p className="text-sm leading-relaxed text-slate-200">{term.salt}</p>
                    </div>
                  </div>
                  {term.note && (
                    <p className="mt-3 rounded-lg border border-amber-500/15 bg-amber-950/10 px-3 py-2 text-xs text-amber-200/80">
                      {term.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Back link */}
      <div className="border-t border-slate-800 pt-4">
        <Link href="/reference" className="text-sm text-slate-400 hover:text-white">
          ← Reference 허브
        </Link>
      </div>
    </section>
  );
}
