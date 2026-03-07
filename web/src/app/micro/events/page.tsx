import { loadMicroSnapshot } from "@/lib/data";

export default async function MicroEventsPage() {
  const snapshot = await loadMicroSnapshot();
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Events</p>
        <h1 className="mt-2 text-2xl font-semibold">관측치/스코어</h1>
      </header>
      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">channel</th>
              <th className="py-2">observable_id</th>
              <th className="py-2">dataset_id</th>
              <th className="py-2">x</th>
              <th className="py-2">measured</th>
              <th className="py-2">stat_err</th>
              <th className="py-2">sys_err</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.observations.map((r, idx) => (
              <tr key={`${r.observable_id}-${r.dataset_id}-${r.x_value ?? "na"}-${idx}`} className="border-t border-slate-800">
                <td className="py-2">{r.channel}</td>
                <td className="py-2">{r.observable_id}</td>
                <td className="py-2">{r.dataset_id}</td>
                <td className="py-2">{r.x_value ?? "-"}</td>
                <td className="py-2">{r.measured_value}</td>
                <td className="py-2">{r.stat_err ?? "-"}</td>
                <td className="py-2">{r.sys_err ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
