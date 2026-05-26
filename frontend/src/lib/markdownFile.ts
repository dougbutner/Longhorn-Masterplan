import type { PlanNode } from "../types";

/** Browser-safe frontmatter (gray-matter uses Node Buffer and breaks in Vite). */
function yamlLine(key: string, value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return `${pad}${key}: null`;
  if (typeof value === "number" || typeof value === "boolean") return `${pad}${key}: ${value}`;
  if (typeof value === "string") {
    if (/[:#"'[\]{}]/.test(value) || value.includes("\n")) {
      return `${pad}${key}: "${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${pad}${key}: ${value}`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}${key}: []`;
    return `${pad}${key}:\n${value.map((v) => `${pad}  - ${v}`).join("\n")}`;
  }
  if (typeof value === "object") {
    const inner = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => yamlLine(k, v, indent + 1))
      .join("\n");
    return `${pad}${key}:\n${inner}`;
  }
  return `${pad}${key}: ${String(value)}`;
}

export function stringifyFrontmatter(data: Record<string, unknown>): string {
  const body = Object.keys(data)
    .map((k) => yamlLine(k, data[k]))
    .join("\n");
  return `---\n${body}\n---`;
}

/** Rebuild masterplan/*.md from frontmatter + edited body (no mirror sections). */
export function buildMarkdownFile(node: PlanNode, editedBody: string): string {
  return `${stringifyFrontmatter(node.frontmatter)}\n\n${editedBody.trim()}\n`;
}

export function downloadMarkdownFile(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.split("/").pop() ?? "masterplan.md";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
