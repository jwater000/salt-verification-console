import { loadRouteMarkdownHtml } from "@/lib/route-markdown";

export default async function Page() {
  const html = await loadRouteMarkdownHtml("cosmic__limits.md");
  return <article className="panel markdown-body p-6 text-slate-300" dangerouslySetInnerHTML={{ __html: html }} />;
}
