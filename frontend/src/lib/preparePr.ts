import type { ClaimsMap } from "./claims";
import { githubEditUrl } from "./constants";
import { copyToClipboard } from "./clipboard";
import { saveDraft } from "./drafts";
import { prNewUrl } from "./github";
import { buildMarkdownFile, downloadMarkdownFile } from "./markdownFile";
import { mergedOwners } from "./owners";
import type { PlanNode, SessionInfo } from "../types";

export interface SuggestPRResult {
  mode: "api" | "manual";
  prUrl?: string;
  editUrl: string;
  copied: boolean;
  downloaded: boolean;
  message: string;
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
    `- [ ] File on branch matches your edits`,
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
): Promise<string | undefined> {
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

  const data = (await res.json()) as { ok?: boolean; prUrl?: string; error?: string };
  if (!res.ok || !data.ok || !data.prUrl) {
    throw new Error(data.error ?? `Suggest PR failed (${res.status})`);
  }
  return data.prUrl;
}

async function manualGitHubFlow(
  node: PlanNode,
  markdown: string,
  title: string,
  body: string,
  basename: string,
): Promise<SuggestPRResult> {
  const editUrl = githubEditUrl(node.file);
  const copied = await copyToClipboard(markdown);
  downloadMarkdownFile(basename, markdown);

  const prFormUrl = prNewUrl(title, body);
  const editWin = window.open(editUrl, "_blank", "noopener,noreferrer");
  const prWin = window.open(prFormUrl, "_blank", "noopener,noreferrer");

  const copiedLine = copied
    ? "Your full file is on the clipboard."
    : "We could not copy automatically — use the downloaded .md file.";

  const popupNote =
    !editWin || !prWin
      ? "\n\nPop-ups were blocked — use the buttons below to open GitHub."
      : "\n\nTwo tabs opened on GitHub.";

  return {
    mode: "manual",
    editUrl,
    copied,
    downloaded: true,
    message: [
      copiedLine + popupNote,
      "1. In the GitHub editor: paste (⌘V / Ctrl+V) over the file, then commit (GitHub will fork if needed).",
      "2. In the PR form: submit after your commit is on your branch.",
      `Backup: ${basename} was downloaded.`,
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
  const editUrl = githubEditUrl(node.file);

  try {
    const prUrl = await tryApiSuggestPr(node, session, markdown, title, body);
    if (prUrl) {
      const opened = window.open(prUrl, "_blank", "noopener,noreferrer");
      return {
        mode: "api",
        prUrl,
        editUrl,
        copied: false,
        downloaded: false,
        message: opened
          ? "Pull request created on GitHub — review and merge there."
          : `Pull request created: ${prUrl}\n(Pop-up blocked — open this URL manually.)`,
      };
    }
  } catch (e) {
    console.warn("API suggest PR failed, using manual GitHub flow:", e);
  }

  return manualGitHubFlow(node, markdown, title, body, basename);
}
