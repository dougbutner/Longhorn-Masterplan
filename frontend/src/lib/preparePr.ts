import type { ClaimsMap } from "./claims";
import { githubEditUrl } from "./constants";
import { copyToClipboard } from "./clipboard";
import { saveDraft } from "./drafts";
import { prNewUrl } from "./github";
import { buildMarkdownFile } from "./markdownFile";
import { mergedOwners } from "./owners";
import type { PlanNode, SessionInfo } from "../types";

export interface SuggestPRResult {
  mode: "api" | "manual";
  compareUrl?: string;
  editUrl: string;
  copied: boolean;
  message: string;
  /** Optional file the user can download on demand. */
  download?: { filename: string; content: string };
}

interface ApiSuggestResponse {
  ok?: boolean;
  branch?: string;
  editUrl?: string;
  compareUrl?: string;
  error?: string;
}

function buildPrMeta(
  node: PlanNode,
  session: SessionInfo,
  claims: ClaimsMap,
  editedBody: string,
) {
  const owners = mergedOwners(node, claims);
  const frontmatter = { ...node.frontmatter, owners };
  const markdown = buildMarkdownFile({ ...node, frontmatter }, editedBody);
  const basename = node.file.split("/").pop() ?? `${node.id}.md`;
  const title = `[${session.actor}] update ${node.id}`;
  const body = [
    "## Vaulta identity",
    "",
    `- vaulta name: \`${session.actor}\``,
    `- permission: \`${session.permission}\``,
    `- chain: \`${session.chain}\``,
    "",
    "## Masterplan nodes touched",
    "",
    `- ${node.id}`,
    "",
    "## Change summary",
    "",
    `Updated \`${node.file}\` via the masterplan editor.`,
    "",
    "## Checklist",
    "",
    "- [ ] PR title is `[<vaulta-name>] <summary>`",
    `- [ ] \`owners\` includes \`${session.actor}\``,
    "- [ ] Changes look correct in the diff",
    "- [ ] No unrelated edits",
  ].join("\n");

  return { markdown, basename, title, body, owners, frontmatter };
}

async function tryApiSuggestPr(
  node: PlanNode,
  session: SessionInfo,
  markdown: string,
  title: string,
  body: string,
): Promise<ApiSuggestResponse | undefined> {
  let res: Response;
  try {
    res = await fetch("/api/suggest-pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actor: session.actor,
        nodeId: node.id,
        filePath: node.file,
        content: markdown,
        prTitle: title,
        prBody: body,
      }),
    });
  } catch {
    return undefined;
  }

  if (res.status === 503) return undefined;

  const data = (await res.json()) as ApiSuggestResponse;
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? `Suggest PR failed (${res.status})`);
  }
  return data;
}

function openPopups(urls: { compare?: string; edit: string }): string {
  const editWin = window.open(urls.edit, "_blank", "noopener,noreferrer");
  const compareWin = urls.compare
    ? window.open(urls.compare, "_blank", "noopener,noreferrer")
    : null;
  if (!editWin && !compareWin) return "\n\nPop-ups blocked — use the buttons below.";
  if (!editWin || !compareWin) return "\n\nOne tab was blocked — use the buttons below for any missing page.";
  return "";
}

async function manualGitHubFlow(
  node: PlanNode,
  markdown: string,
  title: string,
  body: string,
  basename: string,
): Promise<SuggestPRResult> {
  const editUrl = githubEditUrl(node.file);
  const compareUrl = prNewUrl(title, body);
  const copied = await copyToClipboard(markdown);
  const popupNote = openPopups({ edit: editUrl, compare: compareUrl });

  const copiedLine = copied
    ? "Your edits are on the clipboard."
    : "Use Download .md below if you need the full file.";

  return {
    mode: "manual",
    editUrl,
    compareUrl,
    copied,
    download: { filename: basename, content: markdown },
    message: [
      copiedLine + popupNote,
      "GitHub cannot pre-fill the editor without server access.",
      "1. In the editor tab: paste (⌘V / Ctrl+V) over the file, then commit (fork if GitHub asks).",
      "2. Open the PR form tab and submit after your commit is on your branch.",
    ].join("\n"),
  };
}

/** Suggest a PR with edited markdown (Longhorn must already own the node). */
export async function suggestNodePR(
  node: PlanNode,
  session: SessionInfo,
  editedBody: string,
  claims: ClaimsMap,
): Promise<SuggestPRResult> {
  saveDraft(session.actor, node.id, editedBody);

  const { markdown, basename, title, body } = buildPrMeta(node, session, claims, editedBody);

  try {
    const api = await tryApiSuggestPr(node, session, markdown, title, body);
    if (api?.editUrl && api.compareUrl) {
      const popupNote = openPopups({ edit: api.editUrl, compare: api.compareUrl });
      return {
        mode: "api",
        editUrl: api.editUrl,
        compareUrl: api.compareUrl,
        copied: false,
        download: { filename: basename, content: markdown },
        message: [
          "Your changes are committed on a GitHub branch." + popupNote,
          "• Compare tab — review the diff, then click Create pull request.",
          "• Editor tab — file is already filled with your edits; commit or tweak, then open the PR from compare.",
          api.branch ? `Branch: ${api.branch}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    }
  } catch (e) {
    console.warn("API suggest PR failed, using manual GitHub flow:", e);
  }

  return manualGitHubFlow(node, markdown, title, body, basename);
}
