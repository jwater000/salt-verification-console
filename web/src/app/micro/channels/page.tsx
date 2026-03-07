import Link from "next/link";

const CHANNELS = [
  { slug: "muon-g2", label: "muon_g_minus_2" },
  { slug: "neutrino-oscillation", label: "neutrino_oscillation" },
  { slug: "collider-high-pt-tail", label: "collider_high_pt_tail" },
];

export default function MicroChannelsPage() {
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Channels</p>
        <h1 className="mt-2 text-2xl font-semibold">미시 채널 상세</h1>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {CHANNELS.map((channel) => (
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
