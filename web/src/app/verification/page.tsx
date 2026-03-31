import Link from "next/link";
import { loadMicroSnapshot, loadAllResults, loadFrozenManifest } from "@/lib/data";

const CHANNELS = [
  {
    slug: "liv",
    title: "LIV",
    fullTitle: "Lorentz Invariance Violation",
    tag: "고정 채널 1",
    status: "locked" as const,
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
    status: "locked" as const,
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
    status: "locked" as const,
    what: "병합 이후 잔차에 GR 예측 외 고주파 구조가 있는가",
    baseline: "GR 수치 상대론 — 병합 후 ringdown",
    saltPrediction: "병합 후 매질 복원 과정이 GR 예측 외 고주파 꼬리를 남긴다",
    datasets: ["LIGO/Virgo 병합 이벤트 ringdown 구간"],
    parameter: "f_tail (초고주파 잔차 강도)",
    falsification: "고주파 꼬리 구조 부재 → SALT 매질 복원 항 기각",
    href: "/verification/channels/hf-gw",
  },
];

const CANDIDATE_HYPOTHESES = [
  {
    title: "중성미자 질량 구조",
    body: "세대별 질량 격차가 SALT 상태 전환 에너지와 대응하는가",
    status: "pending" as const,
  },
  {
    title: "암흑 물질 밀도 프로파일",
    body: "은하 회전 곡선 잔차가 ρ 구조 없이 설명되는가",
    status: "pending" as const,
  },
  {
    title: "허블 긴장 (H₀)",
    body: "근거리/원거리 H₀ 측정 차이에 경로 의존 보정이 기여하는가",
    status: "pending" as const,
  },
  {
    title: "중력-강력 연결",
    body: "핵밀도 구간의 강력 결합 상수가 SALT ρ 보정을 요구하는가",
    status: "pending" as const,
  },
  {
    title: "세대 문제",
    body: "3세대 쿼크/렙톤 구조가 상태 고착 계층과 대응하는가",
    status: "pending" as const,
  },
];

const STATE_VARIABLE_MAP = [
  {
    variable: "ρ",
    name: "밀도",
    desc: "공간의 국소 에너지 밀도",
    traces: ["시간 지연 잔차", "적색편이 패턴", "LIV 파라미터"],
    color: "cyan",
  },
  {
    variable: "θ",
    name: "장력각",
    desc: "밀도 경계의 방향성",
    traces: ["중력렌즈 잔차", "편광 방향 오프셋"],
    color: "sky",
  },
  {
    variable: "L",
    name: "특성 길이",
    desc: "구조 전환의 공간 스케일",
    traces: ["HF-GW 꼬리 주파수", "고에너지 잔차 구조"],
    color: "violet",
  },
];

export default async function VerificationPage() {
  const [micro, allResults, frozen] = await Promise.all([
    loadMicroSnapshot(),
    loadAllResults(),
    loadFrozenManifest(),
  ]);

  const microDecisive = micro.fit_runs.filter((r) =>
    (r.verdict || "").toLowerCase().includes("better")
  ).length;
  const cosmicSaltWins = allResults.filter((r) => {
    if (typeof r.actual_value !== "number") return false;
    return Math.abs(r.actual_value - r.salt_fit) < Math.abs(r.actual_value - r.standard_fit);
  }).length;

  return (
    <section className="space-y-10">
      {/* Chapter Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#031825] to-slate-950 px-8 py-10">
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-500/8 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          18장 · Verification
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          SALT는 무엇으로 시험되는가
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          직접 관측이 아니라 <strong className="text-slate-100">관측 흔적의 정량 비교</strong>.
          SALT는 3개의 고정된 검증 채널을 통해 시험된다. 판정 규칙과 기각 조건이 먼저 잠기고,
          데이터는 그 이후에 적용된다.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-slate-500">고정 채널</p>
            <p className="mt-0.5 text-2xl font-bold text-cyan-300">3</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">거시 SALT 우세</p>
            <p className="mt-0.5 text-2xl font-bold text-sky-300">{cosmicSaltWins}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">미시 decisive</p>
            <p className="mt-0.5 text-2xl font-bold text-emerald-300">{microDecisive}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">기준 데이터</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-slate-300">
              {frozen.dataset_version || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* State variable → trace map */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          상태변수 → 관측 흔적 매핑
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STATE_VARIABLE_MAP.map((sv) => {
            const borderMap: Record<string, string> = {
              cyan: "border-cyan-500/25",
              sky: "border-sky-500/25",
              violet: "border-violet-500/25",
            };
            const codeMap: Record<string, string> = {
              cyan: "bg-cyan-950/50 text-cyan-200",
              sky: "bg-sky-950/50 text-sky-200",
              violet: "bg-violet-950/50 text-violet-200",
            };
            const dotMap: Record<string, string> = {
              cyan: "bg-cyan-400",
              sky: "bg-sky-400",
              violet: "bg-violet-400",
            };
            return (
              <div key={sv.variable} className={`rounded-xl border bg-slate-950/50 p-5 ${borderMap[sv.color]}`}>
                <div className="flex items-center gap-3">
                  <code className={`rounded px-2.5 py-1 text-lg font-bold ${codeMap[sv.color]}`}>
                    {sv.variable}
                  </code>
                  <div>
                    <p className="text-sm font-bold text-white">{sv.name}</p>
                    <p className="text-xs text-slate-500">{sv.desc}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs text-slate-500">→ 관측 흔적</p>
                  <div className="space-y-1.5">
                    {sv.traces.map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotMap[sv.color]}`} />
                        <span className="text-xs text-slate-300">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed verification channels — 3 cards */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            고정 검증 채널 3종
          </h2>
          <span className="badge-verified">판정 규칙 고정</span>
        </div>
        <div className="space-y-4">
          {CHANNELS.map((ch) => (
            <div
              key={ch.slug}
              className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6 transition hover:border-cyan-500/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
                      {ch.tag}
                    </span>
                    <span className="badge-verified">LOCKED</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white">{ch.title}</h3>
                  <p className="text-sm text-slate-500">{ch.fullTitle}</p>
                </div>
                <Link
                  href={ch.href}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
                >
                  상세 보기 →
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">핵심 질문</p>
                  <p className="mt-1 text-sm text-slate-200">{ch.what}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">기준 모델</p>
                  <p className="mt-1 text-sm text-slate-300">{ch.baseline}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">SALT 예측</p>
                  <p className="mt-1 text-sm text-slate-300">{ch.saltPrediction}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    자유 파라미터
                  </p>
                  <code className="mt-1 block text-xs text-cyan-200">{ch.parameter}</code>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    기각 조건
                  </p>
                  <p className="mt-1 text-xs text-rose-300/90">{ch.falsification}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {ch.datasets.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-0.5 text-xs text-slate-400"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate hypotheses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            후보 가설 묶음
          </h2>
          <span className="badge-pending">검증 대기</span>
        </div>
        <div className="rounded-xl border border-amber-500/15 bg-amber-950/10 p-5">
          <p className="mb-4 text-xs text-amber-200/60">
            아래 항목은 고정 채널과 달리 아직 판정 규칙이 잠기지 않았다. 형식화 완료 또는 데이터
            집계 중인 검증 예정 가설이다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CANDIDATE_HYPOTHESES.map((h) => (
              <div
                key={h.title}
                className="rounded-lg border border-amber-500/15 bg-slate-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-amber-100">{h.title}</p>
                  <span className="badge-pending shrink-0">대기</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification flow timeline */}
      <div className="panel px-6 py-6">
        <h2 className="mb-5 text-sm font-bold text-white">검증 경로 — 4단계 절차</h2>
        <div className="flex flex-col gap-0 md:flex-row">
          {[
            { step: "01", label: "관측량 고정", desc: "무엇을 측정할지 데이터 기준 잠금" },
            { step: "02", label: "비교식 고정", desc: "SALT 예측식 vs 표준 기준식" },
            { step: "03", label: "판정 규칙 고정", desc: "기각 조건 사전 명시" },
            { step: "04", label: "감사 항목 기록", desc: "hash · provenance · 재현 명령" },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex flex-1 items-stretch">
              <div className="flex flex-1 flex-col items-center rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-center">
                <span className="text-2xl font-bold text-slate-600">{item.step}</span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{item.label}</p>
                <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="flex shrink-0 items-center px-1 text-slate-600">
                  <span className="hidden text-xs md:block">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          26장 프로토콜과 연결 →{" "}
          <Link href="/audit/reproduce" className="text-cyan-400 hover:underline">
            /audit/reproduce
          </Link>
        </p>
      </div>

      {/* Nav to sub-pages */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/verification/results"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15"
        >
          판정 결과 상세 →
        </Link>
        <Link
          href="/verification/pending"
          className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-500/15"
        >
          검증 대기 항목 →
        </Link>
      </div>
    </section>
  );
}
