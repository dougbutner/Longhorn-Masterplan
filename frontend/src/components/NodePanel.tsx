import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Contributors, PlanNode, SessionInfo } from "../types";
import { colorForProgress, statusIcon } from "../theme";

interface Props {
  node: PlanNode | undefined;
  contributors: Contributors;
  session: SessionInfo | undefined;
  onClose: () => void;
  onClaim: (id: string) => void;
  onOpenPR: (id: string) => void;
}

export function NodePanel({ node, contributors, session, onClose, onClaim, onOpenPR }: Props) {
  if (!node) {
    return (
      <aside className="w-[420px] shrink-0 border-l border-slate-800 bg-slate-900/60 p-6 hidden md:block">
        <p className="text-slate-400 text-sm">
          Click any node to view its component spec. Double-click to collapse / expand its subtree.
        </p>
      </aside>
    );
  }
  const swatch = colorForProgress(node.progress);
  return (
    <aside className="w-[420px] shrink-0 border-l border-slate-800 bg-slate-900/80 overflow-y-auto">
      <header className="sticky top-0 bg-slate-900/95 backdrop-blur px-5 py-4 border-b border-slate-800 flex items-start gap-3">
        <span
          className="mt-1 inline-block h-3 w-3 rounded-full ring-2 ring-slate-700"
          style={{ background: swatch }}
          title={`${node.progress}%`}
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold leading-tight">{node.title}</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {statusIcon[node.status]} {node.status} · {node.progress}% · {node.id}
          </p>
          {node.owners.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {node.owners.map((o) => {
                const c = contributors[o]?.color ?? "#64748b";
                return (
                  <span
                    key={o}
                    className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                    style={{ borderColor: c, color: c }}
                  >
                    {o}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-100"
          aria-label="Close panel"
        >
          ✕
        </button>
      </header>

      <div className="px-5 py-4 prose prose-invert prose-sm max-w-none prose-headings:scroll-mt-20">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.body}</ReactMarkdown>
      </div>

      <footer className="sticky bottom-0 bg-slate-900/95 backdrop-blur px-5 py-3 border-t border-slate-800 flex flex-wrap gap-2">
        <button
          disabled={!session}
          onClick={() => onClaim(node.id)}
          className="px-3 py-1.5 text-xs rounded bg-brand-green/20 text-brand-green border border-brand-green/40 disabled:opacity-40 disabled:cursor-not-allowed"
          title={!session ? "Sign in with Vaulta to claim" : "Open a PR claiming this node"}
        >
          Claim node
        </button>
        <button
          disabled={!session}
          onClick={() => onOpenPR(node.id)}
          className="px-3 py-1.5 text-xs rounded bg-slate-800 text-slate-100 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          title={!session ? "Sign in with Vaulta to open a PR" : "Open a PR for this node"}
        >
          Open PR
        </button>
        <a
          href={`/${node.file}`}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          View source
        </a>
      </footer>
    </aside>
  );
}
