import { loadPageMarkdown, markdownToHtml } from "@/lib/markdown";

const BLOCKS = [
  { label: "Intro", range: "00", description: "Orientation + conclusion cues" },
  { label: "Part 1 · Problem", range: "01~05", description: "Force crisis and scale framing" },
  { label: "Part 2 · Clue", range: "06~11", description: "Clues to axioms (time, density, quantum)" },
  { label: "Part 3 · Solution", range: "12~16", description: "Unified map + mode narratives" },
  { label: "Theory Core", range: "17", description: "Quantum/GR bridge before predictions" },
  { label: "Prediction & Closure", range: "18~20", description: "FAQ, predictions, closing synthesis" },
  { label: "Appendix", range: "21~28", description: "Defense, glossary, ADM audit" },
];

export default async function BookExcerptsPage() {
  const md = await loadPageMarkdown("01_도서_발췌.md");
  const html = markdownToHtml(md);

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">도서 발췌</h1>
        <p className="mt-2 text-slate-300">
          책의 구조를 `SALT Logic System ERD`가 정리한 7개 블록으로 나눈 뒤, 각 블록을 대표하는 도해를 먼저 보고 g00~g33 전체를 내려가며 몰입하는 방식으로 안내합니다.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BLOCKS.map((block) => (
            <div key={block.label} className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{block.range}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{block.label}</p>
              <p className="mt-1 text-xs text-slate-400">{block.description}</p>
            </div>
          ))}
        </div>
      </article>
      <article className="panel p-6 text-slate-300">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </section>
  );
}
