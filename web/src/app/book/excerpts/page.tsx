import { loadPageMarkdown, markdownToHtml } from "@/lib/markdown";

export default async function BookExcerptsPage() {
  const md = await loadPageMarkdown("01_도서_발췌.md");
  const html = markdownToHtml(md);

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">도서 발췌</h1>
        <p className="mt-2 text-slate-300">
          책의 핵심 그림을 번호 순서대로 모았습니다. 먼저 아래 4단계 지도를 보고, 그다음 g00부터 내려가며 보시면 이해가 빠릅니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">00~06</p>
            <p className="mt-1 text-sm text-slate-100">문제의식/스케일</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">07~16</p>
            <p className="mt-1 text-sm text-slate-100">시간/양자/입자</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">17~24</p>
            <p className="mt-1 text-sm text-slate-100">응용/질문 정리</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">25~32</p>
            <p className="mt-1 text-sm text-slate-100">통합/검증/감사</p>
          </div>
        </div>
      </article>
      <article className="panel markdown-body p-6 text-slate-300" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
