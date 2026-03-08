import { loadAuditManifest, loadModelEvalManifest } from "@/lib/data";

export default async function AuditReproducePage() {
  const manifest = await loadAuditManifest();
  const evalManifest = await loadModelEvalManifest();
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Reproduce</h1>
        <p className="mt-2 text-sm text-slate-300">
          아래 순서대로 실행하면 동일 데이터셋 기준으로 동일 판정을 재현할 수 있습니다.
        </p>
      </header>
      <article className="panel p-5 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">3-Step Reproducible Experiment</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>예측 엔진 실행 + 평가 산출물 생성 (`run_model_eval.py`)</li>
          <li>frozen snapshot 고정 및 manifest 생성</li>
          <li>prediction lock / frozen manifest 무결성 검증</li>
        </ol>
        <pre className="mt-3 overflow-x-auto rounded border border-slate-700 bg-slate-950/60 p-3 text-xs">
{`.venv/bin/python tools/evaluation/run_model_eval.py
.venv/bin/python tools/evaluation/verify_prediction_lock.py
.venv/bin/python tools/evaluation/verify_frozen_manifest.py --manifest data/frozen/current/manifest.json`}
        </pre>
        <p className="mt-3 font-semibold text-slate-100">Cosmic Submission Mode</p>
        <pre className="mt-2 overflow-x-auto rounded border border-slate-700 bg-slate-950/60 p-3 text-xs">
{`.venv/bin/python tools/evaluation/cosmic_feature_sidecar.py --write
# fill redshift_z/luminosity_distance_mpc in data/processed/cosmic_observation_features.json
# optional auto-enrich from source endpoints:
.venv/bin/python tools/evaluation/enrich_cosmic_features.py
# or edit results/reports/cosmic_feature_fill_queue.csv then:
.venv/bin/python tools/evaluation/apply_cosmic_feature_queue.py
.venv/bin/python tools/evaluation/cosmic_feature_sidecar.py --check
COSMIC_SUBMISSION_MODE=1 MICRO_SUBMISSION_MODE=1 .venv/bin/python tools/evaluation/run_model_eval.py`}
        </pre>
      </article>
      <article className="panel p-5 text-sm text-slate-300">
        <p>rerun commands:</p>
        <ul className="mt-2 list-disc pl-5">
          {manifest.rerun_commands.map((cmd) => (
            <li key={cmd}>
              <code>{cmd}</code>
            </li>
          ))}
        </ul>
        <p className="mt-3">model_eval commands:</p>
        <ul className="mt-2 list-disc pl-5">
          {evalManifest.commands.map((cmd) => (
            <li key={cmd}>
              <code>{cmd}</code>
            </li>
          ))}
        </ul>
        <p className="mt-3">prediction lock hashes:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>micro_prediction_lock_sha256: <code>{evalManifest.prediction_locks.micro_prediction_lock_sha256 || "-"}</code></li>
          <li>micro_sm_prediction_sha256: <code>{evalManifest.prediction_locks.micro_sm_prediction_sha256 || "-"}</code></li>
          <li>micro_salt_prediction_sha256: <code>{evalManifest.prediction_locks.micro_salt_prediction_sha256 || "-"}</code></li>
          <li>frozen_manifest_sha256: <code>{evalManifest.frozen.manifest_sha256 || "-"}</code></li>
        </ul>
        <p className="mt-3 text-xs text-slate-400">
          위 해시가 일치하면 같은 입력/같은 식/같은 엔진으로 동일 실험이 재현된 것입니다.
        </p>
      </article>
    </section>
  );
}
