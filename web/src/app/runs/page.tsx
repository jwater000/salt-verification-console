import Link from "next/link";
import { loadRuns } from "@/lib/v2-data";

export default async function RunsPage() {
  const runs = await loadRuns();
  const passedCount = runs.filter((run) => run.status === "passed").length;
  const failedCount = runs.filter((run) => run.status === "failed").length;
  const latest = runs[0];

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">실행 기록</h1>
        <p className="mt-2 text-slate-300">
          한 번의 결과는 한 번의 실행에서 나온다. 이 페이지는 공개 snapshot이 어떤 실행 단위들로 만들어졌고,
          각 실행이 통과했는지 실패했는지, 어떤 판정을 남겼는지를 시간 순서대로 보여 준다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
            <p className="text-xs text-cyan-200/80">최신 공개 스냅샷</p>
            <p className="mt-1 text-sm text-cyan-100">{latest?.dataset_version || "-"}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 p-4">
            <p className="text-xs text-emerald-200/80">통과</p>
            <p className="mt-1 text-sm text-emerald-100">{passedCount}</p>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/25 p-4">
            <p className="text-xs text-rose-200/80">실패</p>
            <p className="mt-1 text-sm text-rose-100">{failedCount}</p>
          </div>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">실행 목록</h2>
            <p className="mt-1 text-sm text-slate-400">각 행은 하나의 계산 또는 검증 실행을 뜻한다.</p>
          </div>
          <Link href="/snapshots" className="text-sm text-cyan-300 underline underline-offset-4">
            스냅샷 보기
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-slate-100">
                <th className="px-3 py-2">Run</th>
                <th className="px-3 py-2">Snapshot</th>
                <th className="px-3 py-2">Domain</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Verdict</th>
                <th className="px-3 py-2">Artifacts</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.run_id} className="border-b border-slate-800">
                  <td className="px-3 py-3">
                    <Link href={`/runs/${encodeURIComponent(run.run_id)}`} className="text-cyan-300 underline underline-offset-4">
                      {run.run_id}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/snapshots/${encodeURIComponent(run.snapshot_id)}`}
                      className="text-cyan-300 underline underline-offset-4"
                    >
                      {run.dataset_version}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{run.domain}</td>
                  <td className="px-3 py-3">{run.run_type}</td>
                  <td className="px-3 py-3">{run.status}</td>
                  <td className="px-3 py-3">{run.verdict || "-"}</td>
                  <td className="px-3 py-3">{run.artifact_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
