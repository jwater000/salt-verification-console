export default function CosmicMethodPage() {
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Cosmic Method</p>
        <h1 className="mt-2 text-2xl font-semibold">거시 검증 규칙</h1>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <p>- Standard (Cosmic): ΛCDM</p>
        <p>- 비교 구조: actual_value / standard_fit / salt_fit</p>
        <p>- 판정식: winner = argmin(|standard_error|, |salt_error|)</p>
        <p>- 통계: MAE, RMSE, AIC/BIC, FDR(BH)</p>
      </article>
    </section>
  );
}
