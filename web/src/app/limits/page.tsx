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

export default async function LimitsPage() {
  const rows = await loadAllResults();
  const standardBetter = rows.filter((r) => winner(r) === "STANDARD");
  const saltBetter = rows.filter((r) => winner(r) === "SALT");
  const ties = rows.filter((r) => winner(r) === "TIE");
  const withActual = rows.filter((r) => r.actual_value != null).length;
  const total = rows.length || 1;
  const standardRate = (standardBetter.length / total) * 100;
  const tieRate = (ties.length / total) * 100;

  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Limits</p>
        <h1 className="mt-2 text-2xl font-semibold">한계와 실패 사례</h1>
        <p className="mt-2 text-sm text-slate-300">
          이 페이지는 SALT 우세 사례만이 아니라 표준우주론(ΛCDM)이 더 나은 구간과 동률 사례를 함께
          공개합니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs text-slate-400">표준이론 우세 이벤트</p>
          <p className="mt-2 text-2xl font-semibold text-rose-300">{standardBetter.length}</p>
          <p className="mt-1 text-xs text-slate-400">{standardRate.toFixed(1)}%</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">SALT 우세 이벤트</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-300">{saltBetter.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">동률 이벤트</p>
          <p className="mt-2 text-2xl font-semibold">{ties.length}</p>
          <p className="mt-1 text-xs text-slate-400">{tieRate.toFixed(1)}%</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">현재 데이터 한계</p>
          <p className="mt-2 text-sm text-slate-300">실측(actual) 연동 {withActual}/{rows.length}, 표본 수 제한</p>
        </article>
      </section>

      <section className="panel p-4">
        <h2 className="text-lg font-semibold">표준이론 우세 사례</h2>
        <p className="mb-3 mt-1 text-sm text-slate-300">
          아래 이벤트는 현재 데이터 기준으로 표준우주론(ΛCDM) 적합도가 SALT보다 높았습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">event_id</th>
                <th className="py-2">prediction_id</th>
                <th className="py-2">event_time_utc</th>
                <th className="py-2">actual_value</th>
                <th className="py-2">standard_fit</th>
                <th className="py-2">salt_fit</th>
                <th className="py-2">std_error</th>
                <th className="py-2">salt_error</th>
              </tr>
            </thead>
            <tbody>
              {standardBetter.map((r) => (
                <tr key={`${r.prediction_id}-${r.event_id}`} className="border-t border-slate-800">
                  <td className="py-2">{r.event_id}</td>
                  <td className="py-2">{r.prediction_id}</td>
                  <td className="py-2">{r.event_time_utc ?? "-"}</td>
                  <td className="py-2">{r.actual_value != null ? r.actual_value.toFixed(4) : "-"}</td>
                  <td className="py-2">{r.standard_fit.toFixed(4)}</td>
                  <td className="py-2">{r.salt_fit.toFixed(4)}</td>
                  <td className="py-2 text-rose-300">
                    {r.standard_error != null ? r.standard_error.toFixed(4) : "-"}
                  </td>
                  <td className="py-2">
                    {r.salt_error != null ? r.salt_error.toFixed(4) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4 text-sm text-slate-300">
        <h2 className="text-lg font-semibold">해석 주의사항</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>특정 기간/데이터셋에서는 표준우주론(ΛCDM)이 더 잘 맞을 수 있습니다.</li>
          <li>현재 잔차 비교는 적재된 이벤트 표본에 의존합니다.</li>
          <li>GCN/ZTF/HEASARC는 현재 URL 환경변수 기반으로 확장 준비 상태입니다.</li>
          <li>실측(actual)이 없는 레코드는 residual_score fallback 판정을 사용합니다.</li>
        </ul>
      </section>
    </section>
  );
}
