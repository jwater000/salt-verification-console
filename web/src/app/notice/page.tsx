import { loadRouteMarkdownHtml } from "@/lib/route-markdown";

export default async function NoticePage() {
  const html = await loadRouteMarkdownHtml("notice.md");
  return <article className="panel markdown-body p-6 text-slate-300" dangerouslySetInnerHTML={{ __html: html }} />;
}
