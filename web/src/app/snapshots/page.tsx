import Link from "next/link";
import { loadSnapshots } from "@/lib/v2-data";

export default async function SnapshotsPage() {
  const snapshots = await loadSnapshots();
  const published = snapshots.find((snapshot) => snapshot.status === "published");

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">Snapshots</h1>
        <p className="mt-2 text-slate-300">
          이 페이지는 공개 결과가 어떤 dataset snapshot 기준으로 계산되었는지 버전 단위로 보여줍니다.
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
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">Snapshot List</h2>
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
