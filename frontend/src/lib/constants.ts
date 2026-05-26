export const GITHUB_OWNER = "dougbutner";
export const GITHUB_REPO = "Longhorn-Masterplan";
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

export function githubBlobUrl(file: string): string {
  return `${GITHUB_REPO_URL}/blob/main/${file}`;
}

/** Opens GitHub’s web editor on a branch (file content = latest commit on that branch). */
export function githubEditUrl(file: string, branch = "main"): string {
  return `${GITHUB_REPO_URL}/edit/${branch}/${file}`;
}

/** Compare view with your branch’s changes visible — use to open the PR. */
export function githubCompareUrl(branch: string, title: string, body: string): string {
  const params = new URLSearchParams({ expand: "1", title, body });
  return `${GITHUB_REPO_URL}/compare/main...${branch}?${params.toString()}`;
}
