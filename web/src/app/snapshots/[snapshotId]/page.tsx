import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSnapshotDetail } from "@/lib/v2-data";
import { loadFrozenManifest, loadMicroSnapshot, loadModelEvalManifest } from "@/lib/frozen-data";

export default async function SnapshotDetailPage({ params }: { params: Promise<{ snapshotId: string }> }) {
  const { snapshotId } = await params;
  const [snapshot, frozen, micro, modelEval] = await Promise.all([
    loadSnapshotDetail(snapshotId),
    loadFrozenManifest(),
    loadMicroSnapshot(),
    loadModelEvalManifest(),
  ]);
  if (!snapshot) notFound();
  const microProviders = Array.from(new Set(micro.sources.map((source) => source.provider).filter(Boolean)));

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{snapshot.dataset_version}</h1>
            <p className="mt-2 text-slate-300">이 스냅샷이 어떤 기준으로 잠겼고 어떤 실행들과 연결되는지 보여 준다.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/snapshots" className="text-cyan-300 underline underline-offset-4">
              스냅샷 목록
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

      {snapshot.status === "published" ? (
        <article className="panel p-6 text-slate-200">
          <h2 className="text-xl font-semibold text-white">이 스냅샷을 이루는 데이터와 출처</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-400">Source Base</p>
              <p className="mt-1 text-sm text-slate-100">{frozen.source_base || "-"}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-400">Pipeline</p>
              <p className="mt-1 text-sm text-slate-100">{modelEval.pipeline || "run_model_eval"}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-400">Public Sources</p>
              <p className="mt-1 text-sm text-slate-100">{microProviders.length}개 기관/프로젝트</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            이 스냅샷은 공개 원자료를 고정한 manifest와 평가 파이프라인 기록을 함께 보여 준다.
            미시 비교 출처는 {microProviders.join(", ")} 등을 포함한다.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 text-slate-100">
                  <th className="px-3 py-2">Frozen File</th>
                  <th className="px-3 py-2">Bytes</th>
                  <th className="px-3 py-2">SHA256</th>
                </tr>
              </thead>
              <tbody>
                {frozen.files.map((file) => (
                  <tr key={file.name} className="border-b border-slate-800">
                    <td className="px-3 py-3">{file.name}</td>
                    <td className="px-3 py-3">{file.bytes?.toLocaleString?.() ?? "-"}</td>
                    <td className="px-3 py-3 break-all font-mono text-xs">{file.sha256 || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ) : null}

      {snapshot.result_summary ? (
        <article className="panel p-6 text-slate-200">
          <h2 className="text-xl font-semibold text-white">이 스냅샷의 결과 요약</h2>
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
        <h2 className="text-xl font-semibold text-white">이 스냅샷에 잠긴 버전</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>formula_versions: <code>{snapshot.formula_versions.join(", ") || "-"}</code></li>
          <li>decision_rule_versions: <code>{snapshot.decision_rule_versions.join(", ") || "-"}</code></li>
          <li>notes: <code>{snapshot.notes || "-"}</code></li>
        </ul>
      </article>

      <article className="panel p-6 text-slate-200">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">연결된 실행</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/runs" className="text-cyan-300 underline underline-offset-4">
              실행 목록
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
          <p className="mt-4 text-sm text-slate-400">이 스냅샷은 archived adapter 항목이라 연결된 실행이 없다.</p>
        )}
      </article>
    </section>
  );
}
