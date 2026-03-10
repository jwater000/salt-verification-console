import { loadRouteMarkdownHtml } from "@/lib/route-markdown";

export default async function CosmicChannelDetail({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  const html = await loadRouteMarkdownHtml("cosmic__channels__[channel].md");
  return (
    <section className="space-y-4">
      <header className="panel p-5 text-sm text-slate-300">
        <h1 className="text-2xl font-semibold text-slate-100">Cosmic Channel: {channel}</h1>
      </header>
      <article className="panel markdown-body p-6 text-slate-300" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
