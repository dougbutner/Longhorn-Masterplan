const GITHUB_OWNER = "dougbutner";
const GITHUB_REPO = "Longhorn-Masterplan";
const API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

export class GitHubApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

async function gh<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "longhorn-masterplan-worker",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new GitHubApiError(`GitHub API ${res.status}`, res.status, text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function toBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function safeSegment(s: string, max = 48): string {
  return s.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, max) || "user";
}

export function branchName(actor: string, nodeId: string): string {
  const ts = Date.now().toString(36);
  return `lh/${safeSegment(actor)}/${safeSegment(nodeId)}-${ts}`;
}

function editUrl(branch: string, filePath: string): string {
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/edit/${branch}/${filePath}`;
}

function compareUrl(branch: string, prTitle: string, prBody: string): string {
  const params = new URLSearchParams({ expand: "1", title: prTitle, body: prBody });
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/compare/main...${branch}?${params.toString()}`;
}

interface RefResponse {
  object: { sha: string };
}

interface ContentResponse {
  sha: string;
}

/** Create a branch with the updated file; user finishes PR on GitHub compare / edit. */
export async function createBranchWithFile(opts: {
  token: string;
  branch: string;
  filePath: string;
  content: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
}): Promise<{ branch: string; editUrl: string; compareUrl: string }> {
  const { token, branch, filePath, content, commitMessage, prTitle, prBody } = opts;

  const mainRef = await gh<RefResponse>(token, "/git/ref/heads/main");
  const baseSha = mainRef.object.sha;

  await gh(token, "/git/refs", {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
  });

  let fileSha: string | undefined;
  try {
    const existing = await gh<ContentResponse>(
      token,
      `/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
    );
    fileSha = existing.sha;
  } catch (e) {
    if (!(e instanceof GitHubApiError) || e.status !== 404) throw e;
  }

  await gh(token, `/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: commitMessage,
      content: toBase64Utf8(content),
      branch,
      ...(fileSha ? { sha: fileSha } : {}),
    }),
  });

  return {
    branch,
    editUrl: editUrl(branch, filePath),
    compareUrl: compareUrl(branch, prTitle, prBody),
  };
}
