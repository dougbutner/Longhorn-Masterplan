import matter from "gray-matter";
import type { PlanNode } from "../types";

/** Rebuild masterplan/*.md from frontmatter + edited body (no mirror sections). */
export function buildMarkdownFile(node: PlanNode, editedBody: string): string {
  const file = matter.stringify(editedBody.trim(), node.frontmatter);
  return file.endsWith("\n") ? file : `${file}\n`;
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
