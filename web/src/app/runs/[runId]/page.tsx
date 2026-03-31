import Link from "next/link";
import { notFound } from "next/navigation";
import { loadRunDetail } from "@/lib/v2-data";

export default async function RunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await loadRunDetail(runId);
  if (!run) notFound();

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{run.run_id}</h1>
            <p className="mt-2 text-slate-300">
              snapshot <code>{run.dataset_version}</code>에 연결된 실행 provenance 상세입니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/runs" className="text-cyan-300 underline underline-offset-4">
              run 목록
            </Link>
            <Link href="/audit/reproduce" className="text-cyan-300 underline underline-offset-4">
              재현 방법
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Domain</p>
            <p className="mt-1 text-sm text-slate-100">{run.domain}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Run Type</p>
            <p className="mt-1 text-sm text-slate-100">{run.run_type}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Status</p>
            <p className="mt-1 text-sm text-slate-100">{run.status}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Manifest SHA</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-100">{run.manifest_sha256 || "-"}</p>
          </div>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">Execution</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            command: <code>{run.command}</code>
          </li>
          <li>
            code_ref: <code>{run.code_ref || "-"}</code>
          </li>
          <li>
            completed_at_utc: <code>{run.completed_at_utc || "-"}</code>
          </li>
          <li>
            verdict: <code>{run.verdict || "-"}</code>
          </li>
          <li>
            verdict_reason: <code>{run.verdict_reason || "-"}</code>
          </li>
        </ul>
      </article>

      <article className="panel p-6 text-slate-200">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Artifacts</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={`/snapshots/${encodeURIComponent(run.snapshot_id)}`}
              className="text-cyan-300 underline underline-offset-4"
            >
              linked snapshot
            </Link>
            <Link href="/verification/results" className="text-cyan-300 underline underline-offset-4">
              판정 결과
            </Link>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-slate-100">
                <th className="px-3 py-2">Path</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">SHA256</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {run.artifacts.map((artifact) => (
                <tr key={artifact.artifact_id} className="border-b border-slate-800">
                  <td className="px-3 py-3 font-mono text-xs text-slate-200">{artifact.path}</td>
                  <td className="px-3 py-3">{artifact.artifact_type}</td>
                  <td className="px-3 py-3 break-all font-mono text-xs">{artifact.sha256 || "-"}</td>
                  <td className="px-3 py-3">{artifact.created_at_utc || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
