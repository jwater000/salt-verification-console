import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import type { FrozenManifest, ModelEvalManifest, MicroSnapshot, ResultRow } from "@/lib/data";

export type SnapshotStatus = "draft" | "candidate" | "published" | "archived";
export type RunStatus = "running" | "passed" | "failed";
export type RunType = "predict" | "score" | "fit" | "verify" | "publish";
export type RunDomain = "cosmic" | "micro" | "shared";

export type RunSummary = {
  run_id: string;
  snapshot_id: string;
  dataset_version: string;
  domain: RunDomain;
  run_type: RunType;
  status: RunStatus;
  verdict?: string | null;
  verdict_reason?: string | null;
  completed_at_utc?: string | null;
  artifact_count: number;
};

export type RunArtifact = {
  artifact_id: string;
  artifact_type: string;
  path: string;
  sha256?: string | null;
  created_at_utc: string;
};

export type RunDetail = RunSummary & {
  command: string;
  code_ref?: string | null;
  started_at_utc?: string | null;
  manifest_sha256?: string | null;
  artifacts: RunArtifact[];
};

export type SnapshotSummary = {
  snapshot_id: string;
  dataset_version: string;
  status: SnapshotStatus;
  created_at_utc: string;
  manifest_sha256?: string | null;
  run_count: number;
};

export type SnapshotDetail = SnapshotSummary & {
  notes?: string | null;
  formula_versions: string[];
  decision_rule_versions: string[];
  runs: RunSummary[];
  result_summary?: {
    salt: number;
    baseline: number;
    tie: number;
  };
};

const root = path.resolve(process.cwd(), "..");
const frozenRoot = path.join(root, "data", "frozen");

async function readJson<T>(fullPath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function fileSha256(fullPath: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(fullPath);
    return createHash("sha256").update(raw).digest("hex");
  } catch {
    return null;
  }
}

function normalizeSnapshotId(datasetVersion: string): string {
  return datasetVersion.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

async function listFrozenDirs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(frozenRoot, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function loadSnapshotInputs() {
  const dirs = await listFrozenDirs();
  const manifests = await Promise.all(
    dirs.map(async (dir) => {
      const manifestPath = path.join(frozenRoot, dir, "manifest.json");
      const manifest = await readJson<FrozenManifest | null>(manifestPath, null);
      if (!manifest?.dataset_version) return null;
      return { dir, manifest, manifestPath };
    }),
  );
  return manifests.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

async function loadCurrentModelEvalManifest(): Promise<ModelEvalManifest> {
  return readJson<ModelEvalManifest>(path.join(root, "data", "frozen", "current", "model_eval_manifest.json"), {
    generated_at_utc: "",
    pipeline: "",
    commands: [],
    engine_versions: {},
    formula_versions: {},
    prediction_locks: {},
    frozen: {},
  });
}

async function loadCurrentMicroSnapshot(): Promise<MicroSnapshot> {
  return readJson<MicroSnapshot>(path.join(root, "data", "frozen", "current", "micro_snapshot.json"), {
    generated_at_utc: "",
    decision_rule_version: "",
    sources: [],
    observations: [],
    scores: [],
    fit_runs: [],
  });
}

async function loadCurrentResults(): Promise<ResultRow[]> {
  try {
    const files = await fs.readdir(path.join(root, "data", "frozen", "current"));
    const resultFiles = files.filter((file) => file.startsWith("results_") && file.endsWith(".json"));
    const groups = await Promise.all(
      resultFiles.map((file) => readJson<ResultRow[]>(path.join(root, "data", "frozen", "current", file), [])),
    );
    return groups.flat();
  } catch {
    return [];
  }
}

async function buildResultSummary(): Promise<{ salt: number; baseline: number; tie: number }> {
  const [micro, cosmic] = await Promise.all([loadCurrentMicroSnapshot(), loadCurrentResults()]);
  let salt = 0;
  let baseline = 0;
  let tie = 0;

  for (const row of micro.scores) {
    const winner = (row.winner || "").toUpperCase();
    if (winner === "SALT") salt += 1;
    else if (winner === "SM" || winner === "BASELINE") baseline += 1;
    else tie += 1;
  }

  for (const row of cosmic) {
    if (typeof row.actual_value !== "number") continue;
    const smErr = Math.abs(row.actual_value - row.standard_fit);
    const saltErr = Math.abs(row.actual_value - row.salt_fit);
    if (Math.abs(smErr - saltErr) <= 1e-12) tie += 1;
    else if (saltErr < smErr) salt += 1;
    else baseline += 1;
  }

  return { salt, baseline, tie };
}

function toArtifact(pathLabel: string, createdAt: string, sha256?: string | null): RunArtifact {
  return {
    artifact_id: pathLabel,
    artifact_type: path.extname(pathLabel).replace(".", "") || "file",
    path: pathLabel,
    sha256: sha256 ?? null,
    created_at_utc: createdAt,
  };
}

export async function loadSnapshots(): Promise<SnapshotSummary[]> {
  const inputs = await loadSnapshotInputs();
  const grouped = new Map<string, SnapshotSummary>();

  for (const entry of inputs) {
    const datasetVersion = entry.manifest.dataset_version;
    const snapshotId = normalizeSnapshotId(datasetVersion);
    const status: SnapshotStatus = entry.dir === "current" ? "published" : "archived";
    const existing = grouped.get(snapshotId);
    const summary: SnapshotSummary = {
      snapshot_id: snapshotId,
      dataset_version: datasetVersion,
      status,
      created_at_utc: entry.manifest.created_at_utc || "",
      manifest_sha256: await fileSha256(entry.manifestPath),
      run_count: status === "published" ? 3 : 0,
    };
    if (!existing || (existing.status !== "published" && status === "published")) {
      grouped.set(snapshotId, summary);
    }
  }

  return Array.from(grouped.values()).sort((a, b) => b.created_at_utc.localeCompare(a.created_at_utc));
}

export async function loadSnapshotDetail(snapshotId: string): Promise<SnapshotDetail | null> {
  const snapshots = await loadSnapshots();
  const summary = snapshots.find((snapshot) => snapshot.snapshot_id === snapshotId);
  if (!summary) return null;

  if (summary.status !== "published") {
    return {
      ...summary,
      notes: "보관된 snapshot입니다. 현재 웹 adapter는 published snapshot의 run provenance만 직접 노출합니다.",
      formula_versions: [],
      decision_rule_versions: [],
      runs: [],
    };
  }

  const [evalManifest, microSnapshot, runs, resultSummary] = await Promise.all([
    loadCurrentModelEvalManifest(),
    loadCurrentMicroSnapshot(),
    loadRuns(),
    buildResultSummary(),
  ]);

  const formulaVersions = Object.values(evalManifest.formula_versions).filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
  const decisionRuleVersions = [microSnapshot.decision_rule_version].filter(Boolean);

  return {
    ...summary,
    notes: "현재 published snapshot 기준 adapter 데이터입니다.",
    formula_versions: Array.from(new Set(formulaVersions)),
    decision_rule_versions: Array.from(new Set(decisionRuleVersions)),
    runs: runs.filter((run) => run.snapshot_id === snapshotId),
    result_summary: resultSummary,
  };
}

export async function loadRuns(): Promise<RunSummary[]> {
  const evalManifest = await loadCurrentModelEvalManifest();
  const datasetVersion = evalManifest.frozen.dataset_version || "current";
  const snapshotId = normalizeSnapshotId(datasetVersion);
  const completedAt = evalManifest.generated_at_utc || "";
  const status: RunStatus = completedAt ? "passed" : "failed";

  const pipelineArtifacts = [
    "data/frozen/current/model_eval_manifest.json",
    "data/frozen/current/micro_snapshot.json",
    "data/frozen/current/manifest.json",
  ];

  return [
    {
      run_id: `${snapshotId}__pipeline`,
      snapshot_id: snapshotId,
      dataset_version: datasetVersion,
      domain: "shared",
      run_type: "predict",
      status,
      verdict: status === "passed" ? "snapshot generated" : "missing manifest",
      verdict_reason: "run_model_eval pipeline adapter",
      completed_at_utc: completedAt,
      artifact_count: pipelineArtifacts.length,
    },
    {
      run_id: `${snapshotId}__verify_prediction_lock`,
      snapshot_id: snapshotId,
      dataset_version: datasetVersion,
      domain: "micro",
      run_type: "verify",
      status,
      verdict: status === "passed" ? "prediction lock available" : "prediction lock missing",
      verdict_reason: "micro prediction lock adapter",
      completed_at_utc: completedAt,
      artifact_count: 2,
    },
    {
      run_id: `${snapshotId}__verify_frozen_manifest`,
      snapshot_id: snapshotId,
      dataset_version: datasetVersion,
      domain: "shared",
      run_type: "verify",
      status,
      verdict: status === "passed" ? "frozen manifest available" : "manifest missing",
      verdict_reason: "frozen manifest adapter",
      completed_at_utc: completedAt,
      artifact_count: 2,
    },
  ];
}

export async function loadRunDetail(runId: string): Promise<RunDetail | null> {
  const runs = await loadRuns();
  const run = runs.find((entry) => entry.run_id === runId);
  if (!run) return null;

  const evalManifest = await loadCurrentModelEvalManifest();
  const createdAt = evalManifest.generated_at_utc || "";
  const manifestPath = path.join(root, "data", "frozen", "current", "manifest.json");
  const manifestSha = await fileSha256(manifestPath);

  if (run.run_id.endsWith("__pipeline")) {
    const artifacts = await Promise.all(
      [
        "data/frozen/current/model_eval_manifest.json",
        "data/frozen/current/micro_snapshot.json",
        "data/frozen/current/manifest.json",
      ].map(async (artifactPath) =>
        toArtifact(artifactPath, createdAt, await fileSha256(path.join(root, artifactPath))),
      ),
    );
    return {
      ...run,
      command: ".venv/bin/python tools/evaluation/run_model_eval.py",
      code_ref: "tools/evaluation/run_model_eval.py",
      started_at_utc: createdAt,
      manifest_sha256: manifestSha,
      artifacts,
    };
  }

  if (run.run_id.endsWith("__verify_prediction_lock")) {
    const artifacts = await Promise.all(
      ["data/frozen/current/micro_prediction_lock.json", "data/frozen/current/model_eval_manifest.json"].map(
        async (artifactPath) => toArtifact(artifactPath, createdAt, await fileSha256(path.join(root, artifactPath))),
      ),
    );
    return {
      ...run,
      command: ".venv/bin/python tools/evaluation/verify_prediction_lock.py",
      code_ref: "tools/evaluation/verify_prediction_lock.py",
      started_at_utc: createdAt,
      manifest_sha256: manifestSha,
      artifacts,
    };
  }

  const artifacts = await Promise.all(
    ["data/frozen/current/manifest.json", "data/frozen/current/model_eval_manifest.json"].map(async (artifactPath) =>
      toArtifact(artifactPath, createdAt, await fileSha256(path.join(root, artifactPath))),
    ),
  );
  return {
    ...run,
    command: ".venv/bin/python tools/evaluation/verify_frozen_manifest.py --manifest data/frozen/current/manifest.json",
    code_ref: "tools/evaluation/verify_frozen_manifest.py",
    started_at_utc: createdAt,
    manifest_sha256: manifestSha,
    artifacts,
  };
}
