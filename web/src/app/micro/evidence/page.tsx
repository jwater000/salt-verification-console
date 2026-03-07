import { loadMicroSnapshot } from "@/lib/data";

export default async function MicroEvidencePage() {
  const snapshot = await loadMicroSnapshot();
  const byChannel = new Map<string, { total: number; salt: number; sm: number; tie: number }>();
  for (const row of snapshot.scores) {
    if (!byChannel.has(row.channel)) {
      byChannel.set(row.channel, { total: 0, salt: 0, sm: 0, tie: 0 });
    }
    const s = byChannel.get(row.channel)!;
    s.total += 1;
    if (row.winner === "SALT") s.salt += 1;
    else if (row.winner === "SM") s.sm += 1;
    else s.tie += 1;
  }
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Evidence</p>
        <h1 className="mt-2 text-2xl font-semibold">SM vs SALT 정량 비교</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from(byChannel.entries()).map(([channel, s]) => (
          <article key={channel} className="panel p-4 text-sm text-slate-300">
            <p className="text-xs text-slate-400">{channel}</p>
            <p className="mt-2">n={s.total}</p>
            <p>SALT {s.salt} / SM {s.sm} / TIE {s.tie}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
