import { branchName, createBranchWithFile, GitHubApiError } from "./github";

interface Env {
  ASSETS: Fetcher;
  GITHUB_TOKEN?: string;
}

interface SuggestPrBody {
  actor: string;
  nodeId: string;
  filePath: string;
  content: string;
  prTitle: string;
  prBody: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname === "/api/suggest-pr") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === "/api/suggest-pr" && request.method === "POST") {
      return handleSuggestPr(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleSuggestPr(request: Request, env: Env): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json", ...CORS },
    });

  if (!env.GITHUB_TOKEN) {
    return json({ ok: false, configured: false, error: "GITHUB_TOKEN not configured" }, 503);
  }

  let body: SuggestPrBody;
  try {
    body = (await request.json()) as SuggestPrBody;
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const { actor, nodeId, filePath, content, prTitle, prBody } = body;
  if (!actor || !nodeId || !filePath || !content || !prTitle) {
    return json({ ok: false, error: "Missing required fields" }, 400);
  }

  const branch = branchName(actor, nodeId);
  const commitMessage = `${prTitle}\n\nCo-authored-by: ${actor} <${actor}@users.noreply.github.com>`;

  try {
    const { branch: head, editUrl, compareUrl } = await createBranchWithFile({
      token: env.GITHUB_TOKEN,
      branch,
      filePath,
      content,
      commitMessage,
      prTitle,
      prBody: prBody ?? "",
    });
    return json({ ok: true, configured: true, branch: head, editUrl, compareUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const detail = e instanceof GitHubApiError ? e.detail : undefined;
    return json({ ok: false, configured: true, error: message, detail }, 502);
  }
}
