import Link from "next/link";
import {
  loadAllResults,
  loadFrozenManifest,
  loadMicroSnapshot,
  loadModelEvalManifest,
} from "@/lib/frozen-data";
import NextSteps from "@/components/next-steps";

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

const SALT_PILLARS = [
  {
    title: "공간을 빈 배경이 아니라 상태를 가진 구조로 본다",
    body: "SALT에서 공간은 아무 일도 하지 않는 빈 상자가 아니다. 밀도와 전이 구조를 가진 살아 있는 장이며, 중력과 질량과 상호작용은 그 장의 상태가 남기는 서로 다른 흔적으로 읽힌다.",
  },
  {
    title: "세 상태변수로 현상을 함께 읽으려 한다",
    body: "ρ, θ, L은 단순한 기호가 아니라 SALT가 세계를 읽는 좌표다. 아주 작은 입자 실험에서 보이는 잔차와 우주 규모의 시간 지연을 같은 문법으로 읽어 보려는 것이 이 가설의 가장 큰 야심이다.",
  },
  {
    title: "설명에 머물지 않고 비교 가능한 예측으로 내려온다",
    body: "좋은 이야기는 멋있게 들리는 데서 끝나지 않는다. 공개된 검증 채널에서는 표준 기준선과 SALT를 같은 데이터와 같은 규칙 위에 올려놓고, 어느 쪽이 실제값에 더 가까운지 숫자로 비교한다.",
  },
] as const;

const CHANNELS = [
  {
    title: "빛의 도달 시간 지연",
    body: "고에너지 신호가 고밀도 경로를 지날 때 표준 기준선과 다른 미세 지연 패턴이 나타나는지 본다.",
    href: "/verification/channels/liv",
  },
  {
    title: "강중력장 경로 지연 잔차",
    body: "강한 중력장을 통과한 신호에서 GR 기준 예측을 넘는 추가 지연 구조가 있는지 비교한다.",
    href: "/verification/channels/gravity-delay",
  },
  {
    title: "병합 후 초고주파 꼬리",
    body: "중력파 병합 이후 잔차에서 표준 ringdown만으로 설명되지 않는 고주파 구조가 남는지 본다.",
    href: "/verification/channels/hf-gw",
  },
] as const;

const SECTION_GUIDE = [
  {
    href: "/core",
    title: "핵심 아이디어",
    body: "SALT가 기존 설명에서 무엇을 문제 삼고 어떤 개념으로 전환하는지 압축해서 본다.",
  },
  {
    href: "/reference",
    title: "참고자료",
    body: "용어, 도해, FAQ, 책-웹 대응표를 통해 개념 사이 관계를 더 촘촘하게 확인한다.",
  },
  {
    href: "/verification",
    title: "내용 검증",
    body: "공개된 채널에서 표준 기준선과 SALT를 어떻게 비교했고 현재 어떤 결과가 나왔는지 확인한다.",
  },
  {
    href: "/audit",
    title: "감사 자료",
    body: "고정 데이터셋, 실행 경로, 해시와 출처를 따라가며 결과가 어떤 절차로 만들어졌는지 점검한다.",
  },
] as const;

const CAUTIONS = [
  "현재 공개 결과는 일부 채널에서 SALT가 더 작은 오차를 보였다는 뜻이지, 모든 문제에서 이미 승리했다는 뜻은 아니다.",
  "공학적 상상력은 SALT를 더 멀리 생각하게 해 주지만, 검증이 끝난 사실과 같은 무게로 읽으면 안 된다.",
  "검증 대기 항목은 아직 시험대를 완성하는 중인 가설이다. 이미 채점이 끝난 결과와는 구분해서 보는 편이 정확하다.",
] as const;

export default async function HomePage() {
  const [allResults, micro, frozen, modelEval] = await Promise.all([
    loadAllResults(),
    loadMicroSnapshot(),
    loadFrozenManifest(),
    loadModelEvalManifest(),
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
  const cosmicRate = cosmic.total > 0 ? ((cosmic.salt / cosmic.total) * 100).toFixed(1) : "—";
  const microTotal = microCounts.salt + microCounts.standard + microCounts.tie;
  const microRate = microTotal > 0 ? ((microCounts.salt / microTotal) * 100).toFixed(1) : "—";
  const microProviders = Array.from(new Set(micro.sources.map((source) => source.provider).filter(Boolean)));

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),linear-gradient(135deg,#08121d_0%,#020617_55%,#071226_100%)] px-8 py-12 shadow-[0_30px_120px_rgba(2,132,199,0.12)]">
        <div className="pointer-events-none absolute -right-12 top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr,0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              SALT
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              공간을 다시 무대로 세우는 대신
              <br />
              하나의 살아 있는 구조로 읽는 가설
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              SALT는 중력의 자리, 질량의 기원, 미시와 거시의 연결을 따로 풀지 않는다. 공간 자체가 어떤
              상태를 가지며 어떻게 전이하는지를 중심에 두고, 서로 떨어져 보였던 물리 현상을 하나의 흐름으로
              다시 읽어 보려는 가설이다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">공간은 빈 배경이 아니다</span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">ρ · θ · L 상태변수</span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">미시와 거시를 같은 축에서 읽기</span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">공개 검증 채널 비교</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/core"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                핵심 아이디어 보기
              </Link>
              <Link
                href="/verification"
                className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-100 transition hover:border-violet-400/50"
              >
                검증 결과 보기
              </Link>
            </div>
          </div>

          <div className="grid gap-3 self-start sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-cyan-500/25 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">전체 공개 비교</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-cyan-300">{saltRate}%</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                현재 공개된 비교 항목 {totalCount}개 중 {totalSalt}개에서 SALT가 기준선보다 실제값에 더 가깝다.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                지금 공개된 채널에서 어디까지 설명력이 드러나는지 보여 주는 중간 성적표다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">거시 / 미시 비교</p>
              <p className="mt-2 text-sm text-slate-200">
                거시 비교: {cosmic.total}개 중 {cosmic.salt}개에서 SALT 우세 ({cosmicRate}%)
              </p>
              <p className="mt-1 text-sm text-slate-200">
                미시 비교: {microTotal}개 중 {microCounts.salt}개에서 SALT 우세 ({microRate}%)
              </p>
              <p className="mt-2 text-xs text-slate-500">
                두 영역은 자료 성격이 달라 비율을 따로 보는 편이 정확하다.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-500/25 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">현재 공개 기준 데이터</p>
              <p className="mt-2 font-mono text-sm font-semibold text-slate-200">
                {frozen.dataset_version || "—"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                공개 결과는 {modelEval.pipeline || "run_model_eval"} 파이프라인이{" "}
                {frozen.source_base || "data/processed"} 원자료를 고정해 만든 데이터 묶음을 기준으로 계산한다.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {frozen.files.length}개 파일의 해시와 함께 묶여 있으며, 미시 비교는 {microProviders.join(", ")} 등{" "}
                {microProviders.length}개 공개 출처를 바탕으로 한다.
              </p>
              <p className="mt-2 text-xs text-slate-500">{frozen.created_at_utc || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {SALT_PILLARS.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">SALT가 지금 공개적으로 시험되는 방식</h2>
          <Link href="/verification/channels" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
            채널 전체 보기 →
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {CHANNELS.map((channel) => (
            <Link
              key={channel.href}
              href={channel.href}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600 hover:bg-slate-900/60"
            >
              <p className="text-base font-semibold text-slate-100">{channel.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{channel.body}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">SALT를 더 깊게 따라가려면</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SECTION_GUIDE.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600 hover:bg-slate-900/60"
              >
                <p className="text-sm font-semibold text-slate-100">{section.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{section.body}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">읽을 때 구분해야 할 점</h2>
          <ul className="mt-5 space-y-3">
            {CAUTIONS.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <NextSteps
        steps={[
          {
            href: "/core",
            title: "Core",
            body: "SALT의 문제의식, 상태변수, 논리 전환점을 더 압축된 구조로 본다.",
          },
          {
            href: "/verification/results",
            title: "Verification Results",
            body: "현재 고정 채널 기준에서 어떤 비교 결과가 나왔는지 항목별로 확인한다.",
          },
          {
            href: "/reference/glossary",
            title: "Glossary",
            body: "ρ, θ, L과 주요 검증 용어를 표준 이론과의 관계 속에서 정리해 읽는다.",
          },
        ]}
      />
    </section>
  );
}
