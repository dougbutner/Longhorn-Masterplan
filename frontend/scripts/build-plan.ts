// Build src/data/plan.json + src/data/contributors.json from the repo's MD + JSON.
// Run via `pnpm dev`/`pnpm build` (prebuild hook) or `pnpm build:plan`.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

type Status = "not_started" | "in_progress" | "review" | "done";

interface PlanNode {
  id: string;
  title: string;
  status: Status;
  progress: number;
  owners: string[];
  depends_on: string[];
  tags: string[];
  body: string;
  file: string;
}

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const masterplanDir = join(repoRoot, "masterplan");
const dataDir = join(here, "..", "src", "data");

function parseNode(filePath: string): PlanNode | null {
  const raw = readFileSync(filePath, "utf8");
  const fm = matter(raw);
  const d = fm.data as Partial<PlanNode>;
  if (!d.id || !d.title) return null;
  return {
    id: String(d.id),
    title: String(d.title),
    status: (d.status as Status) ?? "not_started",
    progress: typeof d.progress === "number" ? d.progress : 0,
    owners: Array.isArray(d.owners) ? d.owners.map(String) : [],
    depends_on: Array.isArray(d.depends_on) ? d.depends_on.map(String) : [],
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    body: fm.content.trim(),
    file: filePath.replace(repoRoot + "/", ""),
  };
}

function buildPlan(): PlanNode[] {
  const entries = readdirSync(masterplanDir);
  const out: PlanNode[] = [];
  for (const name of entries) {
    if (!name.endsWith(".md") || name === "README.md") continue;
    const node = parseNode(join(masterplanDir, name));
    if (node) out.push(node);
  }
  out.sort((a, b) => a.id.localeCompare(b.id));
  return out;
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

console.log(`build-plan: ${plan.length} nodes, ${Object.keys(contributors).length} contributors`);
