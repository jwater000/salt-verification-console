import { loadLiveSnapshot } from "@/lib/data";
import { loadMicroSnapshot } from "@/lib/data";

export default async function AuditSourcesPage() {
  const snapshot = await loadLiveSnapshot();
  const micro = await loadMicroSnapshot();
  return (
    <section className="space-y-6">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Sources</h1>
      </header>
      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">stream_id</th>
              <th className="py-2">provider</th>
              <th className="py-2">source_url</th>
              <th className="py-2">status</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.streams.map((stream) => (
              <tr key={stream.stream_id} className="border-t border-slate-800">
                <td className="py-2">{stream.stream_id}</td>
                <td className="py-2">{stream.provider}</td>
                <td className="py-2">{stream.source_url}</td>
                <td className="py-2">{stream.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel overflow-x-auto p-4">
        <p className="mb-3 text-sm text-slate-300">Micro Sources</p>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">source_id</th>
              <th className="py-2">provider</th>
              <th className="py-2">dataset_ref</th>
              <th className="py-2">version</th>
            </tr>
          </thead>
          <tbody>
            {micro.sources.map((source) => (
              <tr key={source.source_id} className="border-t border-slate-800">
                <td className="py-2">{source.source_id}</td>
                <td className="py-2">{source.provider}</td>
                <td className="py-2">{source.dataset_ref}</td>
                <td className="py-2">{source.version_tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
