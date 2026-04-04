import Link from "next/link";
import { loadSnapshots } from "@/lib/v2-data";
import { loadFrozenManifest, loadMicroSnapshot, loadModelEvalManifest } from "@/lib/frozen-data";

export default async function SnapshotsPage() {
  const [snapshots, frozen, micro, modelEval] = await Promise.all([
    loadSnapshots(),
    loadFrozenManifest(),
    loadMicroSnapshot(),
    loadModelEvalManifest(),
  ]);
  const published = snapshots.find((snapshot) => snapshot.status === "published");
  const microProviders = Array.from(new Set(micro.sources.map((source) => source.provider).filter(Boolean)));

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">Dataset Snapshots</h1>
        <p className="mt-2 text-slate-300">
          이 페이지는 공개 결과가 어떤 dataset snapshot 기준으로 계산되었는지, 그 snapshot이 어떤
          파일 묶음과 파이프라인으로 만들어졌는지를 버전 단위로 보여줍니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
            <p className="text-xs text-cyan-200/80">Published</p>
            <p className="mt-1 text-sm text-cyan-100">{published?.dataset_version || "-"}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 p-4">
            <p className="text-xs text-emerald-200/80">Snapshot Count</p>
            <p className="mt-1 text-sm text-emerald-100">{snapshots.length}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Companion</p>
            <Link href="/runs" className="mt-1 block text-sm text-cyan-300 underline underline-offset-4">
              run provenance 보기
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">현재 묶음 설명</p>
            <p className="mt-1 text-sm text-slate-100">
              {frozen.source_base || "data/processed"}의 공개 원자료를{" "}
              {modelEval.pipeline || "run_model_eval"} 파이프라인으로 고정한 버전
            </p>
            <p className="mt-2 text-xs text-slate-400">
              포함 파일 {frozen.files.length}개, 공개 명령 {modelEval.commands.length}개
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">미시 공개 출처</p>
            <p className="mt-1 text-sm text-slate-100">{microProviders.length}개 기관/프로젝트 기반</p>
            <p className="mt-2 text-xs text-slate-400">
              {microProviders.join(", ")}
            </p>
          </div>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">Snapshot List</h2>
        <p className="mt-2 text-sm text-slate-400">
          각 snapshot에서 dataset version, manifest hash, 연결 run 수를 함께 확인할 수 있습니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-slate-100">
                <th className="px-3 py-2">Dataset Version</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Run Count</th>
                <th className="px-3 py-2">Manifest SHA</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot) => (
                <tr key={snapshot.snapshot_id} className="border-b border-slate-800">
                  <td className="px-3 py-3">
                    <Link
                      href={`/snapshots/${encodeURIComponent(snapshot.snapshot_id)}`}
                      className="text-cyan-300 underline underline-offset-4"
                    >
                      {snapshot.dataset_version}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{snapshot.status}</td>
                  <td className="px-3 py-3">{snapshot.created_at_utc || "-"}</td>
                  <td className="px-3 py-3">{snapshot.run_count}</td>
                  <td className="px-3 py-3 break-all font-mono text-xs">{snapshot.manifest_sha256 || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
