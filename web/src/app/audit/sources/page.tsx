import { loadMicroSnapshot } from "@/lib/data";

export default async function AuditSourcesPage() {
  const micro = await loadMicroSnapshot();
  return (
    <section className="space-y-6">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Sources</h1>
        <p className="mt-2 text-sm text-slate-300">
          평가(Evaluation)에 사용한 채택 데이터 소스를 공개합니다.
        </p>
      </header>
      <div className="panel overflow-x-auto p-4">
        <p className="mb-3 text-sm text-slate-300">Cosmic Source Channels (adopted)</p>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">source_id</th>
              <th className="py-2">provider</th>
              <th className="py-2">dataset_ref</th>
              <th className="py-2">source_url</th>
            </tr>
          </thead>
          <tbody>
            {[
              { source_id: "gracedb", provider: "LIGO-Virgo-KAGRA", dataset_ref: "public-events", source_url: "https://gracedb.ligo.org/" },
              { source_id: "gcn", provider: "NASA", dataset_ref: "gcn-notices", source_url: "https://gcn.nasa.gov/" },
              { source_id: "heasarc", provider: "NASA", dataset_ref: "fermi-gbm", source_url: "https://heasarc.gsfc.nasa.gov/" },
            ].map((source) => (
              <tr key={source.source_id} className="border-t border-slate-800">
                <td className="py-2">{source.source_id}</td>
                <td className="py-2">{source.provider}</td>
                <td className="py-2">{source.dataset_ref}</td>
                <td className="py-2">
                  <a href={source.source_url} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                    {source.source_url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel overflow-x-auto p-4">
        <p className="mb-3 text-sm text-slate-300">Micro Evaluation Sources (HEPData/PDG/NuFIT)</p>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">source_id</th>
              <th className="py-2">provider</th>
              <th className="py-2">dataset_ref</th>
              <th className="py-2">url</th>
              <th className="py-2">version</th>
            </tr>
          </thead>
          <tbody>
            {micro.sources.map((source) => (
              <tr key={source.source_id} className="border-t border-slate-800">
                <td className="py-2">{source.source_id}</td>
                <td className="py-2">{source.provider}</td>
                <td className="py-2">{source.dataset_ref}</td>
                <td className="py-2">
                  <a href={source.url} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                    {source.url}
                  </a>
                </td>
                <td className="py-2">{source.version_tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
