// Build src/data/plan.json + src/data/contributors.json from the repo's MD + JSON.
// Run via `pnpm dev`/`pnpm build` (prebuild hook) or `pnpm build:plan`.
//
// For every masterplan/*.md whose frontmatter declares `source.path`, this
// script reads the real contract file and appends two sections to the rendered
// body so the website always mirrors the latest code:
//
//   ## Full code snippet
//   <fenced code from source.path>
//
//   ## Update with changes
//   [`<source.path>`](<source.url>)

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

type Status = "not_started" | "in_progress" | "review" | "done";

interface PlanSource {
  path: string;
  url?: string;
  exists: boolean;
  language: string;
}

interface PlanNode {
  id: string;
  title: string;
  parent: string | null;
  status: Status;
  progress: number;
  owners: string[];
  tags: string[];
  order: number;
  source?: PlanSource;
  /** Rendered body (includes mirrored contract sections when applicable). */
  body: string;
  /** Markdown body from the file only — safe to edit in the UI. */
  editableBody: string;
  /** Frontmatter fields for reconstructing masterplan/*.md on PR export. */
  frontmatter: Record<string, unknown>;
  file: string;
  depth: number;
  children: string[];
}

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const masterplanDir = join(repoRoot, "masterplan");
const dataDir = join(here, "..", "src", "data");
const REPO_BLOB_BASE = "https://github.com/dougbutner/Longhorn-Masterplan/blob/main";

const LANGS: Record<string, string> = {
  ".cpp": "cpp",
  ".hpp": "cpp",
  ".h": "cpp",
  ".c": "c",
  ".ts": "ts",
  ".tsx": "tsx",
  ".js": "js",
  ".jsx": "jsx",
  ".py": "python",
  ".rs": "rust",
  ".go": "go",
  ".sh": "bash",
  ".json": "json",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".md": "md",
};

function languageFor(path: string): string {
  return LANGS[extname(path).toLowerCase()] ?? "text";
}

function readSource(path: string): { contents: string; exists: boolean } {
  const abs = join(repoRoot, path);
  if (!existsSync(abs)) return { contents: "", exists: false };
  return { contents: readFileSync(abs, "utf8"), exists: true };
}

function appendMirrorSections(body: string, source: PlanSource | undefined): string {
  if (!source) return body;
  const { contents, exists } = readSource(source.path);
  const url = source.url ?? `${REPO_BLOB_BASE}/${source.path}`;
  if (!exists) {
    return (
      body +
      `\n\n## Full code snippet\n\n_Source not yet committed at \`${source.path}\`._\n\n` +
      `## Update with changes\n\nWill mirror [\`${source.path}\`](${url}) once the file lands.\n`
    );
  }
  return (
    body +
    `\n\n## Full code snippet\n\n\`\`\`${source.language}\n${contents}\n\`\`\`\n\n` +
    `## Update with changes\n\nMirrored from [\`${source.path}\`](${url}). Push to that file to update this snippet on the next build.\n`
  );
}

function parseNode(filePath: string): PlanNode | null {
  const raw = readFileSync(filePath, "utf8");
  const fm = matter(raw);
  const d = fm.data as Record<string, unknown>;
  if (typeof d.id !== "string" || typeof d.title !== "string") return null;

  let source: PlanSource | undefined;
  const srcRaw = d.source as { path?: unknown; url?: unknown } | undefined;
  if (srcRaw && typeof srcRaw.path === "string" && srcRaw.path.length > 0) {
    const path = srcRaw.path;
    const url = typeof srcRaw.url === "string" ? srcRaw.url : `${REPO_BLOB_BASE}/${path}`;
    const language = languageFor(path);
    const { exists } = readSource(path);
    source = { path, url, exists, language };
  }

  const parent = d.parent === null || d.parent === undefined ? null : String(d.parent);

  const editableBody = fm.content.trim();

  const node: PlanNode = {
    id: d.id,
    title: d.title,
    parent,
    status: (typeof d.status === "string" ? d.status : "not_started") as Status,
    progress: typeof d.progress === "number" ? d.progress : 0,
    owners: Array.isArray(d.owners) ? (d.owners as unknown[]).map(String) : [],
    tags: Array.isArray(d.tags) ? (d.tags as unknown[]).map(String) : [],
    order: typeof d.order === "number" ? d.order : 100,
    source,
    body: appendMirrorSections(editableBody, source),
    editableBody,
    frontmatter: { ...d },
    file: filePath.replace(repoRoot + "/", ""),
    depth: 0,
    children: [],
  };
  return node;
}

function buildPlan(): PlanNode[] {
  const entries = readdirSync(masterplanDir);
  const nodes: PlanNode[] = [];
  for (const name of entries) {
    if (!name.endsWith(".md") || name === "README.md") continue;
    const node = parseNode(join(masterplanDir, name));
    if (node) nodes.push(node);
  }

  const byId = new Map(nodes.map((n) => [n.id, n] as const));

  for (const n of nodes) {
    if (n.parent && byId.has(n.parent)) {
      byId.get(n.parent)!.children.push(n.id);
    } else if (n.parent && !byId.has(n.parent)) {
      console.warn(`build-plan: node "${n.id}" references missing parent "${n.parent}"`);
    }
  }

  for (const n of nodes) {
    n.children.sort((a, b) => {
      const A = byId.get(a)!;
      const B = byId.get(b)!;
      return A.order - B.order || A.title.localeCompare(B.title);
    });
  }

  function computeDepth(id: string, seen = new Set<string>()): number {
    if (seen.has(id)) return 0;
    seen.add(id);
    const n = byId.get(id);
    if (!n || !n.parent) return 0;
    return 1 + computeDepth(n.parent, seen);
  }
  for (const n of nodes) n.depth = computeDepth(n.id);

  const roots = nodes.filter((n) => n.parent === null);
  if (roots.length !== 1) {
    console.warn(`build-plan: expected exactly one root, found ${roots.length}: ${roots.map((r) => r.id).join(", ")}`);
  }

  nodes.sort((a, b) =>
    a.depth - b.depth ||
    (a.parent ?? "").localeCompare(b.parent ?? "") ||
    a.order - b.order ||
    a.title.localeCompare(b.title),
  );

  return nodes;
}

function buildContributors(): Record<string, { color: string; vaulta: string; github?: string; role?: string }> {
  const raw = readFileSync(join(repoRoot, "CONTRIBUTORS.json"), "utf8");
  const parsed = JSON.parse(raw);
  return parsed.contributors ?? {};
}

mkdirSync(dataDir, { recursive: true });
const plan = buildPlan();
const contributors = buildContributors();
writeFileSync(join(dataDir, "plan.json"), JSON.stringify(plan, null, 2));
writeFileSync(join(dataDir, "contributors.json"), JSON.stringify(contributors, null, 2));

const maxDepth = plan.reduce((m, n) => Math.max(m, n.depth), 0);
console.log(
  `build-plan: ${plan.length} nodes, max depth ${maxDepth}, ${Object.keys(contributors).length} contributors`,
);
