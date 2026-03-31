import Link from "next/link";
import { loadAllResults, loadFrozenManifest, loadMicroSnapshot } from "@/lib/data";

type WinCounts = { salt: number; standard: number; tie: number; total: number };

function winnerCounts(
  rows: Array<{ actual_value?: number | null; standard_fit: number; salt_fit: number }>
): WinCounts {
  let salt = 0;
  let standard = 0;
  let tie = 0;
  for (const row of rows) {
    if (typeof row.actual_value !== "number") continue;
    const smErr = Math.abs(row.actual_value - row.standard_fit);
    const saltErr = Math.abs(row.actual_value - row.salt_fit);
    if (Math.abs(smErr - saltErr) <= 1e-12) tie++;
    else if (saltErr < smErr) salt++;
    else standard++;
  }
  return { salt, standard, tie, total: salt + standard + tie };
}

const VISITOR_LANES = [
  {
    href: "/guide",
    eyebrow: "For First-Time Visitors",
    title: "무엇을 주장하는지부터 이해",
    body: "책 전체를 읽지 않아도 된다. SALT의 핵심 주장, 검증 구조, 읽는 순서를 먼저 잡는다.",
    accent: "cyan",
  },
  {
    href: "/verification/results",
    eyebrow: "For Evaluators",
    title: "지금 판정된 결과부터 확인",
    body: "frozen 데이터 기준으로 SALT와 기준선 오차를 비교한 실제 결과판으로 바로 들어간다.",
    accent: "emerald",
  },
  {
    href: "/audit",
    eyebrow: "For Reviewers",
    title: "재현성과 신뢰 구조 점검",
    body: "어떤 데이터와 규칙으로 계산했는지, 누가 다시 돌려도 같은 결론이 나오는지 확인한다.",
    accent: "amber",
  },
] as const;

const CORE_AREAS = [
  {
    href: "/core",
    title: "Core",
    label: "이론 압축",
    body: "00~17장의 핵심 논리만 추려 공간 밀도, 상태변수, 관측 흔적의 관계를 설명한다.",
  },
  {
    href: "/verification",
    title: "Verification",
    label: "검증 엔진",
    body: "고정된 3개 채널과 판정 규칙, 결과판, 검증 대기 항목을 한 흐름으로 보여준다.",
  },
  {
    href: "/reference",
    title: "Reference",
    label: "시각 허브",
    body: "도해, 용어, FAQ, 책 구조도를 통해 텍스트보다 빠르게 이해하도록 돕는다.",
  },
  {
    href: "/engineering",
    title: "Engineering",
    label: "고객 대화",
    body: "기술적 함의를 현재 검증 결과와 분리해, 어디까지가 해석이고 어디부터가 가설인지 구분한다.",
  },
] as const;

const TRUST_POINTS = [
  "같은 데이터와 같은 규칙으로 SALT와 기준선을 비교한다",
  "검증 완료 항목과 검증 대기 항목을 분리해 보여준다",
  "결과뿐 아니라 snapshot, run, hash까지 함께 공개한다",
  "책 전체를 옮기지 않고 웹에 맞는 설명 구조로 다시 편집한다",
];

export default async function HomePage() {
  const [allResults, micro, frozen] = await Promise.all([
    loadAllResults(),
    loadMicroSnapshot(),
    loadFrozenManifest(),
  ]);

  const cosmic = winnerCounts(allResults);
  const microCounts = micro.scores.reduce(
    (acc, row) => {
      const winner = (row.winner || "").toUpperCase();
      if (winner === "SALT") acc.salt++;
      else if (winner === "SM") acc.standard++;
      else acc.tie++;
      return acc;
    },
    { salt: 0, standard: 0, tie: 0 }
  );

  const totalCount = cosmic.total + microCounts.salt + microCounts.standard + microCounts.tie;
  const totalSalt = cosmic.salt + microCounts.salt;
  const saltRate = totalCount > 0 ? ((totalSalt / totalCount) * 100).toFixed(1) : "—";

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),linear-gradient(135deg,#08121d_0%,#020617_55%,#071226_100%)] px-8 py-12 shadow-[0_30px_120px_rgba(2,132,199,0.12)]">
        <div className="pointer-events-none absolute -right-12 top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr,0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              SALT Verification Console
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              책을 그대로 옮기지 않고
              <br />
              핵심 주장과 검증 구조만 남긴다
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              이 사이트의 목적은 00~28장을 웹에 맞게 다시 구성하는 것이다. 방문자는 핵심 주장,
              실제 판정 결과, 재현 가능성, 기술적 함의를 각자 필요한 깊이로 탐색할 수 있다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                어디서 시작할지 보기
              </Link>
              <Link
                href="/verification/results"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-400"
              >
                실제 판정 결과
              </Link>
            </div>
          </div>

          <div className="grid gap-3 self-start sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-cyan-500/25 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Integrated Result</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-cyan-300">{saltRate}%</p>
              <p className="mt-1 text-sm text-slate-400">SALT wins {totalSalt} / {totalCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Frozen Dataset</p>
              <p className="mt-2 font-mono text-sm font-semibold text-slate-200">
                {frozen.dataset_version || "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">{frozen.created_at_utc || "—"}</p>
            </div>
            <div className="rounded-2xl border border-sky-500/25 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cosmic vs Micro</p>
              <p className="mt-2 text-sm text-slate-200">거시 SALT 우세 {cosmic.salt}</p>
              <p className="mt-1 text-sm text-slate-200">미시 SALT 우세 {microCounts.salt}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            방문자별 진입 경로
          </h2>
          <Link href="/guide" className="text-xs text-cyan-400 hover:underline">
            전체 입문 가이드 →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {VISITOR_LANES.map((lane) => {
            const accents: Record<string, string> = {
              cyan: "border-cyan-500/20 hover:border-cyan-400/40",
              emerald: "border-emerald-500/20 hover:border-emerald-400/40",
              amber: "border-amber-500/20 hover:border-amber-400/40",
            };
            const labels: Record<string, string> = {
              cyan: "text-cyan-300 bg-cyan-500/10",
              emerald: "text-emerald-300 bg-emerald-500/10",
              amber: "text-amber-300 bg-amber-500/10",
            };
            return (
              <Link
                key={lane.href}
                href={lane.href}
                className={`group rounded-2xl border bg-slate-950/45 p-6 transition ${accents[lane.accent]}`}
              >
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${labels[lane.accent]}`}>
                  {lane.eyebrow}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">{lane.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{lane.body}</p>
                <p className="mt-5 text-sm font-semibold text-slate-200 group-hover:text-white">
                  들어가기 →
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">이 사이트에서 할 수 있는 일</h2>
          <div className="mt-5 space-y-4">
            {[
              {
                step: "01",
                title: "주장을 빠르게 이해",
                body: "Core와 Reference에서 공간 밀도, 상태변수, 관측 흔적만 추려 본다.",
              },
              {
                step: "02",
                title: "결과와 대기를 분리해 확인",
                body: "Verification에서 지금 판정된 것과 아직 운영 잠금 전인 항목을 분리해서 본다.",
              },
              {
                step: "03",
                title: "신뢰 구조를 검증",
                body: "Audit에서 snapshot, run, manifest hash를 통해 재현 경로를 따라간다.",
              },
            ].map((item) => (
              <div key={item.step} className="grid gap-3 sm:grid-cols-[auto,1fr]">
                <span className="rounded-lg bg-slate-900 px-3 py-2 font-mono text-sm text-cyan-300">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">신뢰 확보 원칙</h2>
          <ul className="mt-5 space-y-3">
            {TRUST_POINTS.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          사이트 역할
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CORE_AREAS.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-600 hover:bg-slate-900/50"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {area.label}
              </p>
              <h3 className="mt-2 text-lg font-bold text-white">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{area.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
