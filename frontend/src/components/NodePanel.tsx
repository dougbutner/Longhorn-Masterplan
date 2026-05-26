import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FullscreenEditor } from "./FullscreenEditor";
import { githubBlobUrl } from "../lib/constants";
import type { ClaimsMap } from "../lib/claims";
import { clearDraft, loadDraft, saveDraft } from "../lib/drafts";
import { mergedOwners } from "../lib/owners";
import type { Contributors, PlanNode, SessionInfo } from "../types";
import { colorForProgress, statusIcon } from "../theme";

interface Props {
  node: PlanNode | undefined;
  contributors: Contributors;
  claims: ClaimsMap;
  session: SessionInfo | undefined;
  suggestingPR?: boolean;
  onClose: () => void;
  onClaim: (node: PlanNode) => void;
  onSuggestPR: (node: PlanNode, editedBody: string) => void | Promise<void>;
}

function mirrorSuffix(node: PlanNode): string | undefined {
  const marker = "## Full code snippet";
  const idx = node.body.indexOf(marker);
  if (idx < 0) return undefined;
  return node.body.slice(idx);
}

export function NodePanel({
  node,
  contributors,
  claims,
  session,
  suggestingPR = false,
  onClose,
  onClaim,
  onSuggestPR,
}: Props) {
  const [body, setBody] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSyncKey, setEditorSyncKey] = useState("0");

  const actor = session?.actor;
  const owners = useMemo(
    () => (node ? mergedOwners(node, claims) : []),
    [node, claims],
  );

  useEffect(() => {
    if (!node) return;
    const draft = actor ? loadDraft(actor, node.id) : undefined;
    setBody(draft ?? node.editableBody);
    setEditorOpen(false);
    setEditorSyncKey(`${node.id}-${Date.now()}`);
  }, [node?.id, actor, node]);

  if (!node) {
    return (
      <aside className="w-[min(420px,42vw)] shrink-0 glass border-l p-6 hidden md:flex flex-col justify-center z-10">
        <p className="text-lh-ivory-muted text-sm leading-relaxed">
          Click any feature to view its user story, problem, solution, and mirrored contract code.
          Sign in with Vaulta to become a Longhorn on a node and improve the plan.
        </p>
      </aside>
    );
  }

  const swatch = colorForProgress(node.progress);
  const dirty = body !== node.editableBody;
  const hasDraft = Boolean(actor && loadDraft(actor, node.id));
  const claimActor = claims[node.id];
  const claimedByMe = Boolean(actor && claimActor === actor);
  const claimedByOther = Boolean(claimActor && claimActor !== actor);
  const canClaim = Boolean(session && !claimedByOther);

  const handleSave = () => {
    if (!actor) return;
    saveDraft(actor, node.id, body);
  };

  const handleDiscard = () => {
    if (actor) clearDraft(actor, node.id);
    setBody(node.editableBody);
    setEditorSyncKey(`${node.id}-${Date.now()}`);
  };

  const previewBody = useMemo(() => {
    const mirror = mirrorSuffix(node);
    const base = dirty ? body.trim() : node.body;
    if (dirty && mirror && !base.includes("## Full code snippet")) {
      return `${body.trim()}\n\n${mirror}`;
    }
    return base;
  }, [node, body, dirty]);

  return (
    <>
      <aside className="w-[min(420px,42vw)] shrink-0 glass border-l overflow-y-auto flex flex-col z-10">
        <header className="sticky top-0 z-10 glass-bar px-5 py-4 flex items-start gap-3">
          <span
            className="mt-1 inline-block h-3.5 w-3.5 rounded-full shrink-0"
            style={{ background: swatch, boxShadow: `0 0 8px ${swatch}88` }}
            title={`${node.progress}%`}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-lh-ivory leading-snug">{node.title}</h2>
            <p className="text-xs text-lh-ivory-muted mt-1 font-mono">
              {statusIcon[node.status]} {node.status} · {node.progress}% · {node.id}
            </p>
            {owners.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {owners.map((o) => {
                  const c = contributors[o]?.color ?? "#d4af37";
                  return (
                    <span
                      key={o}
                      className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                      style={{
                        borderColor: `${c}66`,
                        color: c,
                        backgroundColor: "var(--glass-bg)",
                      }}
                    >
                      {o}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-lh-ivory-muted hover:text-lh-ivory transition-colors p-1 shrink-0"
            aria-label="Close panel"
          >
            ✕
          </button>
        </header>

        <div className="px-5 py-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-lh-ivory-muted">Document</span>
            {!editorOpen && (
              <button
                type="button"
                onClick={() => setEditorOpen(true)}
                className="btn-glass text-xs py-1 px-2"
                title={
                  session
                    ? claimedByMe
                      ? "Open editor to improve this node"
                      : "Sign in and claim to edit"
                    : "Preview document (sign in to edit)"
                }
              >
                improve this
              </button>
            )}
          </div>
          <div className="prose-lh flex-1 overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{previewBody}</ReactMarkdown>
          </div>
        </div>

        <footer className="sticky bottom-0 glass-bar px-5 py-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canClaim || claimedByMe}
            onClick={() => onClaim(node)}
            className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              !session
                ? "Sign in with Vaulta to claim"
                : claimedByOther
                  ? `Longhorn: ${claimActor}`
                  : claimedByMe
                    ? "You are the Longhorn for this node"
                    : "Become the Longhorn for this node"
            }
          >
            {claimedByMe ? "You are Longhorn" : claimedByOther ? `Longhorn: ${claimActor}` : "Claim node"}
          </button>
          {claimedByMe && !editorOpen && (
            <button type="button" onClick={() => setEditorOpen(true)} className="btn-glass">
              Suggest PR
            </button>
          )}
          <a
            href={githubBlobUrl(node.file)}
            target="_blank"
            rel="noreferrer"
            className="btn-glass inline-block"
          >
            View source
          </a>
        </footer>
      </aside>

      <FullscreenEditor
        open={editorOpen}
        title={node.title}
        value={body}
        syncKey={editorSyncKey}
        readOnly={!session}
        dirty={dirty}
        hasDraft={hasDraft || dirty}
        canSuggestPR={claimedByMe}
        suggestingPR={suggestingPR}
        onChange={setBody}
        onClose={() => {
          setEditorOpen(false);
        }}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onSuggestPR={(text) => onSuggestPR(node, text)}
      />
    </>
  );
}
