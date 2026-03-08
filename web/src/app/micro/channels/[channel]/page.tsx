import { notFound } from "next/navigation";

const TITLES: Record<string, string> = {
  "muon-g2": "muon_g_minus_2",
  "neutrino-oscillation": "neutrino_oscillation",
  "neutrino-reactor-disappearance": "neutrino_reactor_disappearance",
  "neutrino-accelerator-long-baseline": "neutrino_accelerator_long_baseline",
  "neutrino-atmospheric": "neutrino_atmospheric",
  "collider-high-pt-tail": "collider_high_pt_tail",
};

export default async function MicroChannelDetail({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;
  const title = TITLES[channel];
  if (!title) notFound();

  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Channel</p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <p>채널별 SM 기준식, SALT 보정식, 통계 판정 결과를 이 경로에 연결합니다.</p>
      </article>
    </section>
  );
}
