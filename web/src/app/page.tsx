import Link from "next/link";
import { loadAllResults, loadFrozenManifest, loadMicroSnapshot } from "@/lib/data";
import BookstoreLinks from "@/components/bookstore-links";

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
    title: "먼저 읽을 경로를 정리",
    body: "도서의 주요 주제와 사이트 구성, 권장 읽기 순서를 차분히 살펴볼 수 있다.",
    accent: "cyan",
  },
  {
    href: "/verification/results",
    eyebrow: "For Evaluators",
    title: "검증 결과부터 확인",
    body: "frozen 데이터 기준 집계와 항목별 판정 결과를 먼저 검토할 수 있다.",
    accent: "emerald",
  },
  {
    href: "/audit",
    eyebrow: "For Reviewers",
    title: "재현 경로 확인",
    body: "사용된 데이터, 규칙, 산출 경로를 따라가며 재현 가능성을 점검할 수 있다.",
    accent: "amber",
  },
] as const;

const CORE_AREAS = [
  {
    href: "/core",
    title: "Core",
    label: "이론 압축",
    body: "문제의식, 상태변수, 논리 구조를 다루는 이론 허브이며 결과 원표를 중심에 두지 않는다.",
  },
  {
    href: "/verification",
    title: "Verification",
    label: "검증 엔진",
    body: "검증 채널, 판정 규칙, 결과 집계, 검증 대기 항목을 정리하며 이론 전개 자체를 대신하지 않는다.",
  },
  {
    href: "/reference",
    title: "Reference",
    label: "시각 허브",
    body: "도해, 용어, FAQ, 책-웹 대응표를 모아 두는 참고 허브이며 판정 결과의 공식 허브는 아니다.",
  },
  {
    href: "/engineering",
    title: "Engineering",
    label: "기술 해석",
    body: "공학적 함의와 응용 가능성을 검증 결과와 구분해 정리하고, 해석과 가설의 범위를 나누어 소개한다.",
  },
] as const;

const TRUST_POINTS = [
  "같은 데이터와 같은 규칙으로 비교한 결과를 기준으로 정리한다",
  "검증 완료 항목과 검증 대기 항목을 구분해 표시한다",
  "결과와 함께 snapshot, run, hash 정보를 확인할 수 있다",
  "도서 본문과 별도로, 웹에서 참고하기 쉬운 형식으로 내용을 나누어 배치한다",
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
              Book Guide and Verification Reference
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              물리학에 시공간은 없다
              <br />
              안내와 참고를 위한 웹사이트
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              이 사이트에는 도서의 주요 개념, 검증 관련 자료, 참고 도해, 재현 절차가 역할별로
              나뉘어 정리되어 있다. Home은 전체 흐름만 짧게 안내하고, 세부 이론 설명은 Core,
              결과 판정은 Verification, 재현 자료는 Audit, 참고 자료는 Reference에서 따로 본다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Home = 첫 진입 요약</span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Core = 이론 구조</span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Verification = 판정 결과</span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Audit = 재현/감사</span>
            </div>
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
                title: "개요를 먼저 읽기",
                body: "Core와 Reference에서 주요 개념과 도해를 먼저 살펴본다.",
              },
              {
                step: "02",
                title: "검증 자료를 구분해 확인",
                body: "Verification에서 집계 결과와 검증 대기 항목을 나누어 확인한다.",
              },
              {
                step: "03",
                title: "재현 경로를 확인",
                body: "Audit에서 snapshot, run, manifest hash를 통해 산출 경로를 따라간다.",
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
          <h2 className="text-sm font-semibold text-white">정리 원칙</h2>
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
      <BookstoreLinks
        title="도서 구매처"
        description="도서를 바로 찾으려는 경우 아래 서점 페이지를 참고할 수 있다."
      />
      </div>
    </section>
  );
}
