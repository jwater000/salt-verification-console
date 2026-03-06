import Link from "next/link";
import { loadAllResults } from "@/lib/data";

function winner(row: {
  residual_score: number;
  standard_error?: number | null;
  salt_error?: number | null;
}): "SALT" | "STANDARD" | "TIE" {
  if (row.standard_error != null && row.salt_error != null) {
    const s = Math.abs(row.standard_error);
    const t = Math.abs(row.salt_error);
    if (t < s) return "SALT";
    if (s < t) return "STANDARD";
    return "TIE";
  }
  if (row.residual_score > 0) return "SALT";
  if (row.residual_score < 0) return "STANDARD";
  return "TIE";
}

export default async function Home() {
  const rows = await loadAllResults();
  const total = rows.length;
  const saltWins = rows.filter((r) => winner(r) === "SALT").length;
  const standardWins = rows.filter((r) => winner(r) === "STANDARD").length;
  const ties = total - saltWins - standardWins;
  const saltWinRate = total ? (saltWins / total) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Evidence-first Verification</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">
          SALT가 표준이론 대비 어디서 더 낮은 오차를 보이는지 공개 데이터로 검증합니다.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          이 사이트의 핵심은 이론 소개가 아니라 비교 검증입니다. 동일 이벤트에서 표준우주론(ΛCDM)과 SALT를
          동시에 평가하고, 잔차 차이를 시각화합니다.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/evidence" className="badge">
            Evidence 바로 보기
          </Link>
          <Link href="/events" className="badge">
            이벤트 상세 보기
          </Link>
          <Link href="/limits" className="badge">
            한계/실패 사례 보기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Total Events</h2>
          <p className="mt-2 text-3xl font-semibold">{total}</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">SALT Win Rate</h2>
          <p className="mt-2 text-3xl font-semibold text-cyan-300">{saltWinRate.toFixed(1)}%</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Outcome Split</h2>
          <p className="mt-2 text-sm text-slate-300">
            SALT 우세 {saltWins} / 표준우주론(ΛCDM) 우세 {standardWins} / 동률 {ties}
          </p>
        </article>
      </section>

      <section className="panel p-5 text-sm text-slate-300">
        <p>핵심 해석: 이 조건에서 SALT 우세 비율은 {saltWinRate.toFixed(1)}%입니다.</p>
        <p className="mt-2 text-slate-400">
          주의: 이 수치는 현재 적재된 이벤트 기준이며, 데이터셋/기간 필터에 따라 달라질 수 있습니다.
        </p>
      </section>
    </div>
  );
}
