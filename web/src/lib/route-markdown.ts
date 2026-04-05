import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { markdownToHtml } from "@/lib/markdown";
import { runtimePaths } from "@/lib/runtime-paths";

const routesRoot = path.join(runtimePaths.webContentRoot, "routes");

export const loadRouteMarkdownHtml = cache(async (fileName: string): Promise<string> => {
  const full = path.join(routesRoot, fileName);
  const md = await fs.readFile(full, "utf8");
  return markdownToHtml(md);
});
