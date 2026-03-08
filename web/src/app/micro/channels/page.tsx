import Link from "next/link";
import { loadMicroSnapshot } from "@/lib/data";

const CHANNELS = [
  { slug: "muon-g2", label: "muon_g_minus_2", key: "muon_g_minus_2" },
  { slug: "neutrino-oscillation", label: "neutrino_oscillation", key: "neutrino_oscillation" },
  { slug: "neutrino-reactor-disappearance", label: "neutrino_reactor_disappearance", key: "neutrino_reactor_disappearance" },
  { slug: "neutrino-accelerator-long-baseline", label: "neutrino_accelerator_long_baseline", key: "neutrino_accelerator_long_baseline" },
  { slug: "neutrino-atmospheric", label: "neutrino_atmospheric", key: "neutrino_atmospheric" },
  { slug: "collider-high-pt-tail", label: "collider_high_pt_tail", key: "collider_high_pt_tail" },
];

export default async function MicroChannelsPage() {
  const snapshot = await loadMicroSnapshot();
  const presentChannels = new Set(snapshot.observations.map((o) => o.channel));
  const visibleChannels = CHANNELS.filter((c) => presentChannels.has(c.key));

  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Channels</p>
        <h1 className="mt-2 text-2xl font-semibold">미시 채널 상세</h1>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {visibleChannels.map((channel) => (
          <Link
            key={channel.slug}
            href={`/micro/channels/${channel.slug}`}
            className="panel p-4 text-sm hover:border-cyan-700"
          >
            {channel.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
