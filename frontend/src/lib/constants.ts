export const GITHUB_OWNER = "dougbutner";
export const GITHUB_REPO = "Longhorn-Masterplan";
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

export function githubBlobUrl(file: string): string {
  return `${GITHUB_REPO_URL}/blob/main/${file}`;
}

/** Opens GitHub’s web editor (forks automatically if the user has no write access). */
export function githubEditUrl(file: string, branch = "main"): string {
  return `${GITHUB_REPO_URL}/edit/${branch}/${file}`;
}
