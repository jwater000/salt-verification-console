import { notFound } from "next/navigation";

const TITLES: Record<string, string> = {
  "shapiro-delay": "Shapiro Delay",
  "gravitational-redshift": "Gravitational Redshift",
  "lensing-delay": "Lensing Delay",
  "gnss-gps": "GNSS/GPS",
  "gw-em": "GW-EM Arrival",
};

export default async function CosmicChannelDetail({
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
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Cosmic Channel</p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <p>채널별 예측식/기준모델/통계판정 뷰를 이 경로에 연결합니다.</p>
      </article>
    </section>
  );
}
