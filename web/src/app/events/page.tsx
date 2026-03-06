import { loadAllResults } from "@/lib/data";

function winnerFromRow(row: {
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

export default async function EventsPage() {
  const rows = await loadAllResults();
  const sorted = [...rows].sort((a, b) => {
    const ta = a.event_time_utc ?? "";
    const tb = b.event_time_utc ?? "";
    return ta < tb ? 1 : -1;
  });

  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Events</p>
        <h1 className="mt-2 text-2xl font-semibold">이벤트별 판정 상세</h1>
        <p className="mt-2 text-sm text-slate-300">
          각 이벤트에서 SALT/표준우주론(ΛCDM) 중 어느 쪽이 우세한지 개별 레코드 단위로 확인합니다.
        </p>
      </header>

      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">event_time_utc</th>
              <th className="py-2">event_id</th>
              <th className="py-2">prediction_id</th>
              <th className="py-2">actual_value</th>
              <th className="py-2">standard_fit</th>
              <th className="py-2">salt_fit</th>
              <th className="py-2">std_error</th>
              <th className="py-2">salt_error</th>
              <th className="py-2">winner</th>
              <th className="py-2">flag</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const winner = winnerFromRow(r);
              return (
                <tr key={`${r.prediction_id}-${r.event_id}`} className="border-t border-slate-800">
                  <td className="py-2">{r.event_time_utc ?? "-"}</td>
                  <td className="py-2">{r.event_id}</td>
                  <td className="py-2">{r.prediction_id}</td>
                  <td className="py-2">{r.actual_value != null ? r.actual_value.toFixed(4) : "-"}</td>
                  <td className="py-2">{r.standard_fit.toFixed(4)}</td>
                  <td className="py-2">{r.salt_fit.toFixed(4)}</td>
                  <td className="py-2">
                    {r.standard_error != null ? r.standard_error.toFixed(4) : "-"}
                  </td>
                  <td className="py-2">
                    {r.salt_error != null ? r.salt_error.toFixed(4) : "-"}
                  </td>
                  <td className="py-2">
                    <span
                      className={
                        winner === "SALT"
                          ? "badge"
                          : winner === "STANDARD"
                            ? "rounded-full border border-rose-800 bg-rose-950 px-2 py-0.5 text-xs text-rose-300"
                            : "rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300"
                      }
                    >
                      {winner === "STANDARD" ? "ΛCDM" : winner}
                    </span>
                  </td>
                  <td className="py-2">{r.flag}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
