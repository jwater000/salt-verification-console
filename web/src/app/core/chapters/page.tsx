import Link from "next/link";
import { CORE_CHAPTERS } from "@/lib/site-content";

export default function CoreChaptersIndexPage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-violet-500/20 bg-[linear-gradient(135deg,#14091f_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Core Chapters</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          핵심 장 세 개로 읽는
          <br />
          SALT의 뼈대
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 세 장만 따라가도 SALT의 큰 윤곽은 잡힌다. 17장은 공간과 상태변수의 언어를 세우고,
          18장은 그 언어가 실제 비교로 내려오는 방식을 보여 주며, 19장은 그 해석이 기술적 상상력으로
          어떻게 번져 가는지 보여 준다.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {CORE_CHAPTERS.map((chapter) => {
          const tagClass =
            chapter.status === "theory-core"
              ? "bg-violet-500/10 text-violet-300"
              : chapter.status === "testable"
              ? "bg-cyan-500/10 text-cyan-300"
              : "bg-emerald-500/10 text-emerald-300";
          return (
            <Link
              key={chapter.num}
              href={chapter.href}
              className="group rounded-2xl border border-slate-800 bg-slate-950/45 p-6 transition hover:border-slate-600"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${tagClass}`}>
                  {chapter.statusLabel}
                </span>
                <span className="text-xs text-slate-500">Ch.{chapter.num}</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">{chapter.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{chapter.oneLiner}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">역할</p>
              <p className="mt-1 text-sm text-slate-300">{chapter.stage}</p>
              <div className="mt-4 space-y-2">
                {chapter.keyQuestions.map((question) => (
                  <p key={question} className="text-sm text-slate-300">
                    - {question}
                  </p>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="panel px-6 py-6">
        <h2 className="mb-5 text-sm font-bold text-white">세 장을 따라가는 흐름</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { step: "01", title: "17장", body: "공간이 왜 빈 배경이 아니며 ρ, θ, L이 왜 필요한지 이해한다." },
            { step: "02", title: "18장", body: "그 개념이 실제 데이터 비교와 기각 조건으로 어떻게 변하는지 본다." },
            { step: "03", title: "19장", body: "이 해석이 기술과 실험을 어떻게 새롭게 바라보게 만드는지 본다." },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-2xl font-bold text-slate-600">{item.step}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
