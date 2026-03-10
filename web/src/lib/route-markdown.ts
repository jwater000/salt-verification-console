import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { markdownToHtml } from "@/lib/markdown";

const routesRoot = path.resolve(process.cwd(), "content", "routes");

export const loadRouteMarkdownHtml = cache(async (fileName: string): Promise<string> => {
  const full = path.join(routesRoot, fileName);
  const md = await fs.readFile(full, "utf8");
  return markdownToHtml(md);
});

