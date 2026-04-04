import Link from "next/link";

type NextStep = {
  href: string;
  title: string;
  body: string;
};

type NextStepsProps = {
  title?: string;
  steps: NextStep[];
};

export default function NextSteps({
  title = "다음 단계",
  steps,
}: NextStepsProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600 hover:bg-slate-900/60"
          >
            <p className="text-sm font-semibold text-slate-100">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
            <p className="mt-4 text-sm font-medium text-cyan-300">이동 →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
