import Link from "next/link";

const CHANNELS = [
  { slug: "shapiro-delay", label: "Shapiro Delay" },
  { slug: "gravitational-redshift", label: "Gravitational Redshift" },
  { slug: "lensing-delay", label: "Lensing Delay" },
  { slug: "gnss-gps", label: "GNSS/GPS" },
  { slug: "gw-em", label: "GW-EM" },
];

export default function CosmicChannelsPage() {
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Cosmic Channels</p>
        <h1 className="mt-2 text-2xl font-semibold">거시 채널 상세</h1>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {CHANNELS.map((channel) => (
          <Link
            key={channel.slug}
            href={`/cosmic/channels/${channel.slug}`}
            className="panel p-4 text-sm hover:border-cyan-700"
          >
            {channel.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
