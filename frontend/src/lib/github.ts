import { GITHUB_OWNER, GITHUB_REPO } from "./constants";
import type { PendingPR } from "../types";

const VAULTA_TITLE = /^\[([a-zA-Z0-9_\-\.]+)\]/;

export function parseVaultaFromTitle(title: string): string | undefined {
  return title.match(VAULTA_TITLE)?.[1];
}

interface GhPull {
  number: number;
  title: string;
  html_url: string;
  updated_at: string;
  draft?: boolean;
}

export async function fetchOpenPRs(): Promise<PendingPR[]> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls?state=open&per_page=50&sort=updated&direction=desc`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const rows = (await res.json()) as GhPull[];
  return rows.map((pr) => ({
    number: pr.number,
    title: pr.title,
    vaulta: parseVaultaFromTitle(pr.title),
    url: pr.html_url,
    updatedAt: pr.updated_at,
    draft: Boolean(pr.draft),
  }));
}

/** Opens GitHub's new-PR form with prefilled title and body. */
export function prNewUrl(title: string, body: string): string {
  const params = new URLSearchParams({ title, body });
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/pull/new?${params.toString()}`;
}
