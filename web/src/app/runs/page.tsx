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
        <h1 className="text-2xl font-bold text-white">Runs</h1>
        <p className="mt-2 text-slate-300">
          이 페이지는 현재 공개 snapshot을 만든 실행 단위와 검증 단위를 provenance 관점에서 읽기 위한 목록입니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
            <p className="text-xs text-cyan-200/80">Latest Snapshot</p>
            <p className="mt-1 text-sm text-cyan-100">{latest?.dataset_version || "-"}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 p-4">
            <p className="text-xs text-emerald-200/80">Passed</p>
            <p className="mt-1 text-sm text-emerald-100">{passedCount}</p>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/25 p-4">
            <p className="text-xs text-rose-200/80">Failed</p>
            <p className="mt-1 text-sm text-rose-100">{failedCount}</p>
          </div>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Run List</h2>
            <p className="mt-1 text-sm text-slate-400">현재 adapter는 published snapshot 기준 최신 run provenance를 노출합니다.</p>
          </div>
          <Link href="/snapshots" className="text-sm text-cyan-300 underline underline-offset-4">
            snapshots 보기
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
