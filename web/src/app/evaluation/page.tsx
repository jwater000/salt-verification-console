import Link from "next/link";

const SECTIONS = [
  { href: "/cosmic/overview", title: "Cosmic Evaluation", desc: "ΛCDM vs SALT (frozen dataset)" },
  { href: "/micro/overview", title: "Micro Evaluation", desc: "SM vs SALT (frozen dataset)" },
  { href: "/limits", title: "Evaluation Limits", desc: "채널별 유보/한계 사례" },
];

export default function EvaluationPage() {
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Evaluation</p>
        <h1 className="mt-2 text-2xl font-semibold">고정 데이터셋 기반 비교 평가</h1>
        <p className="mt-2 text-sm text-slate-300">
          이 영역은 실시간 피드를 섞지 않고, 버전 고정된 입력으로 SM/ΛCDM 대비 SALT의 비교 결과를 제공합니다.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="panel p-4 text-sm hover:border-cyan-700">
            <p className="font-semibold text-slate-100">{s.title}</p>
            <p className="mt-1 text-slate-400">{s.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
