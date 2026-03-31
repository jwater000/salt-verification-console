import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSnapshotDetail } from "@/lib/v2-data";

export default async function SnapshotDetailPage({ params }: { params: Promise<{ snapshotId: string }> }) {
  const { snapshotId } = await params;
  const snapshot = await loadSnapshotDetail(snapshotId);
  if (!snapshot) notFound();

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{snapshot.dataset_version}</h1>
            <p className="mt-2 text-slate-300">snapshot 단위의 공개 기준, 연결 run, 요약 집계를 보여줍니다.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/snapshots" className="text-cyan-300 underline underline-offset-4">
              snapshot 목록
            </Link>
            <Link href="/verification/results" className="text-cyan-300 underline underline-offset-4">
              판정 결과
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Status</p>
            <p className="mt-1 text-sm text-slate-100">{snapshot.status}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Created</p>
            <p className="mt-1 text-sm text-slate-100">{snapshot.created_at_utc || "-"}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Runs</p>
            <p className="mt-1 text-sm text-slate-100">{snapshot.run_count}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Manifest SHA</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-100">{snapshot.manifest_sha256 || "-"}</p>
          </div>
        </div>
      </article>

      {snapshot.result_summary ? (
        <article className="panel p-6 text-slate-200">
          <h2 className="text-xl font-semibold text-white">Result Summary</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
              <p className="text-xs text-cyan-200/80">SALT</p>
              <p className="mt-1 text-sm text-cyan-100">{snapshot.result_summary.salt}</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-950/25 p-4">
              <p className="text-xs text-amber-200/80">Baseline</p>
              <p className="mt-1 text-sm text-amber-100">{snapshot.result_summary.baseline}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-400">Tie</p>
              <p className="mt-1 text-sm text-slate-100">{snapshot.result_summary.tie}</p>
            </div>
          </div>
        </article>
      ) : null}

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">Versions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>formula_versions: <code>{snapshot.formula_versions.join(", ") || "-"}</code></li>
          <li>decision_rule_versions: <code>{snapshot.decision_rule_versions.join(", ") || "-"}</code></li>
          <li>notes: <code>{snapshot.notes || "-"}</code></li>
        </ul>
      </article>

      <article className="panel p-6 text-slate-200">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Linked Runs</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/runs" className="text-cyan-300 underline underline-offset-4">
              run 목록
            </Link>
            <Link href="/audit/reproduce" className="text-cyan-300 underline underline-offset-4">
              재현 방법
            </Link>
          </div>
        </div>
        {snapshot.runs.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 text-slate-100">
                  <th className="px-3 py-2">Run</th>
                  <th className="px-3 py-2">Domain</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.runs.map((run) => (
                  <tr key={run.run_id} className="border-b border-slate-800">
                    <td className="px-3 py-3">
                      <Link href={`/runs/${encodeURIComponent(run.run_id)}`} className="text-cyan-300 underline underline-offset-4">
                        {run.run_id}
                      </Link>
                    </td>
                    <td className="px-3 py-3">{run.domain}</td>
                    <td className="px-3 py-3">{run.run_type}</td>
                    <td className="px-3 py-3">{run.status}</td>
                    <td className="px-3 py-3">{run.verdict || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">이 snapshot은 archived adapter 항목이라 linked run이 없습니다.</p>
        )}
      </article>
    </section>
  );
}
