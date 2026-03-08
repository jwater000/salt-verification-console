import Link from "next/link";
import { loadAllResults, loadFrozenManifest, loadMicroSnapshot } from "@/lib/data";

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
  const [rows, manifest, micro] = await Promise.all([
    loadAllResults(),
    loadFrozenManifest(),
    loadMicroSnapshot(),
  ]);
  const cosmicTotal = rows.length;
  const cosmicSaltWins = rows.filter((r) => winner(r) === "SALT").length;
  const cosmicStandardWins = rows.filter((r) => winner(r) === "STANDARD").length;
  const cosmicTies = cosmicTotal - cosmicSaltWins - cosmicStandardWins;
  const cosmicSaltWinRate = cosmicTotal ? (cosmicSaltWins / cosmicTotal) * 100 : 0;

  const microTotal = micro.scores.length;
  const microSaltWins = micro.scores.filter((r) => r.winner === "SALT").length;
  const microStandardWins = micro.scores.filter((r) => r.winner === "SM").length;
  const microTies = micro.scores.filter((r) => r.winner === "TIE").length;
  const microSaltWinRate = microTotal ? (microSaltWins / microTotal) * 100 : 0;

  const total = cosmicTotal + microTotal;
  const saltWins = cosmicSaltWins + microSaltWins;
  const standardWins = cosmicStandardWins + microStandardWins;
  const ties = cosmicTies + microTies;
  const saltWinRate = total ? (saltWins / total) * 100 : 0;
  const stdPct = total ? (standardWins / total) * 100 : 0;
  const tiePct = total ? (ties / total) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">SALT Verification Goal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">
          SALT가 표준이론(거시: ΛCDM, 미시: SM)보다 예측력에서 밀리지 않음을 검증합니다.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          같은 데이터, 같은 판정 규칙으로 SALT와 표준이론의 오차를 비교합니다. 이 페이지는 결론, 출처 공개, 예측식,
          재현 방법을 한 번에 제공합니다.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/evaluation" className="badge">
            결론 보기
          </Link>
          <Link href="/evidence" className="badge">
            근거 보기
          </Link>
          <Link href="/audit/reproduce" className="badge">
            재현하기
          </Link>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          evaluation dataset: {manifest.dataset_version || "missing"} / created_at:{" "}
          {manifest.created_at_utc || "missing"}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Total Comparisons</h2>
          <p className="mt-2 text-3xl font-semibold">{total}</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">SALT Win Rate</h2>
          <p className="mt-2 text-3xl font-semibold text-cyan-300">{saltWinRate.toFixed(1)}%</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">SALT / Standard / Tie</h2>
          <p className="mt-2 text-sm text-slate-300">{saltWins} / {standardWins} / {ties}</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Data 공개</h2>
          <p className="mt-2 text-sm text-slate-300">출처/버전/식/해시 전부 공개</p>
          <Link href="/audit/sources" className="mt-2 inline-block text-xs text-cyan-300 underline">
            데이터 출처 보기
          </Link>
        </article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold text-slate-100">한눈에 보는 승/무/패</h2>
        <p className="mt-2 text-sm text-slate-300">
          SALT(청록) / 표준이론(분홍) / 동률(회색) 비중
        </p>
        <div className="mt-3 h-4 overflow-hidden rounded bg-slate-800">
          <div className="h-4 bg-cyan-400" style={{ width: `${saltWinRate}%`, float: "left" }} />
          <div className="h-4 bg-rose-400" style={{ width: `${stdPct}%`, float: "left" }} />
          <div className="h-4 bg-slate-500" style={{ width: `${tiePct}%`, float: "left" }} />
        </div>
        <div className="mt-2 grid gap-2 text-xs text-slate-300 md:grid-cols-3">
          <p>SALT: {saltWins} ({saltWinRate.toFixed(1)}%)</p>
          <p>Standard: {standardWins} ({stdPct.toFixed(1)}%)</p>
          <p>Tie: {ties} ({tiePct.toFixed(1)}%)</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-100">거시(Cosmic) 결과</h2>
          <p className="mt-2 text-sm text-slate-300">
            SALT {cosmicSaltWins} / ΛCDM {cosmicStandardWins} / Tie {cosmicTies}
          </p>
          <p className="mt-1 text-sm text-cyan-300">SALT win rate: {cosmicSaltWinRate.toFixed(1)}%</p>
          <Link href="/cosmic/overview" className="mt-3 inline-block text-xs text-cyan-300 underline">
            거시 상세 보기
          </Link>
        </article>
        <article className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-100">미시(Micro) 결과</h2>
          <p className="mt-2 text-sm text-slate-300">
            SALT {microSaltWins} / SM {microStandardWins} / Tie {microTies}
          </p>
          <p className="mt-1 text-sm text-cyan-300">SALT win rate: {microSaltWinRate.toFixed(1)}%</p>
          <Link href="/micro/overview" className="mt-3 inline-block text-xs text-cyan-300 underline">
            미시 상세 보기
          </Link>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">1) 데이터 출처 공개</h2>
          <p className="mt-2">거시: GraceDB/GCN/HEASARC, 미시: HEPData/PDG/NuFIT</p>
          <Link href="/audit/sources" className="mt-2 inline-block text-cyan-300 underline">
            출처/버전 확인
          </Link>
        </article>
        <article className="panel p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">2) 예측식 공개</h2>
          <p className="mt-2">SM/ΛCDM 식과 SALT 식을 공개하고 엔진 버전을 고정합니다.</p>
          <Link href="/audit/formulas" className="mt-2 inline-block text-cyan-300 underline">
            식/엔진 보기
          </Link>
        </article>
        <article className="panel p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">3) 동일 실험 재현</h2>
          <p className="mt-2">재실행 커맨드와 잠금 해시를 제공해 같은 판정을 재현합니다.</p>
          <Link href="/audit/reproduce" className="mt-2 inline-block text-cyan-300 underline">
            재현 절차 보기
          </Link>
        </article>
      </section>
    </div>
  );
}
