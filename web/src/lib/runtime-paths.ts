import fs from "node:fs";
import path from "node:path";

function hasDir(base: string, relativePath: string): boolean {
  return fs.existsSync(path.join(base, relativePath));
}

function findRepoRoot(start: string): string {
  let current = path.resolve(start);

  while (true) {
    if (hasDir(current, "data") && hasDir(current, "web")) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return start;
    }
    current = parent;
  }
}

const repoRoot = findRepoRoot(process.cwd());
const webRoot = hasDir(repoRoot, "web/src") ? path.join(repoRoot, "web") : repoRoot;

export const runtimePaths = {
  repoRoot,
  webRoot,
  dataRoot: path.join(repoRoot, "data"),
  webContentRoot: path.join(webRoot, "content"),
  frozenCurrentDir: path.join(repoRoot, "data", "frozen", "current"),
  frozenRoot: path.join(repoRoot, "data", "frozen"),
} as const;
