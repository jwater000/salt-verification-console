import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

const contentRoot = path.resolve(process.cwd(), "content", "pages");
const codeBase =
  process.env.NEXT_PUBLIC_CODE_LINK_BASE ??
  "https://github.com/jwater000/salt-verification-console/blob/main";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rewriteUrl(url: string): string {
  const t = url.trim();
  const withSlash = t.startsWith("/") ? t : `/${t}`;
  const repoPrefixes = ["/tools/", "/web/", "/data/", "/analysis/", "/assets/"];
  if (repoPrefixes.some((p) => withSlash.startsWith(p))) {
    return `${codeBase}${withSlash}`;
  }
  return t;
}

function sanitizeUrl(url: string): string {
  const t = url.trim();
  if (t.startsWith("/") || t.startsWith("#") || t.startsWith("http://") || t.startsWith("https://")) {
    return t;
  }
  return "#";
}

function renderInline(raw: string): string {
  let s = escapeHtml(raw);
  s = s.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_m, alt, url) =>
      `<img src="${escapeHtml(sanitizeUrl(rewriteUrl(url)))}" alt="${escapeHtml(alt || "")}" loading="lazy" />`,
  );
  s = s.replace(/`([^`]+)`/g, (_m, g1) => `<code>${escapeHtml(g1)}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, text, url) => {
      const resolved = sanitizeUrl(rewriteUrl(url));
      const external = resolved.startsWith("http://") || resolved.startsWith("https://");
      return `<a href="${escapeHtml(resolved)}" target="${external ? "_blank" : "_self"}" rel="noreferrer">${text}</a>`;
    },
  );
  return s;
}

export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let paragraph: string[] = [];
  let listMode: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listMode) return;
    out.push(`</${listMode}>`);
    listMode = null;
  };

  const flushCode = () => {
    out.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      closeList();
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const depth = heading[1].length;
      out.push(`<h${depth}>${renderInline(heading[2])}</h${depth}>`);
      continue;
    }

    const ul = line.match(/^\-\s+(.+)$/);
    if (ul) {
      flushParagraph();
      if (listMode !== "ul") {
        closeList();
        out.push("<ul>");
        listMode = "ul";
      }
      out.push(`<li>${renderInline(ul[1])}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      flushParagraph();
      if (listMode !== "ol") {
        closeList();
        out.push("<ol>");
        listMode = "ol";
      }
      out.push(`<li>${renderInline(ol[1])}</li>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  if (inCode) flushCode();
  return out.join("\n");
}

export const loadPageMarkdown = cache(async (fileName: string): Promise<string> => {
  const full = path.join(contentRoot, fileName);
  return fs.readFile(full, "utf8");
});
