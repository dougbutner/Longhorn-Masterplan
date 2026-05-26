import type { Contributors, PendingPR } from "../types";

interface Props {
  prs: PendingPR[];
  loading: boolean;
  error: string | undefined;
  contributors: Contributors;
  onRefresh: () => void;
}

function vaultaBadge(vaulta: string | undefined, contributors: Contributors) {
  if (!vaulta) {
    return (
      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[color:var(--glass-border)] text-lh-ivory-muted glass">
        no prefix
      </span>
    );
  }
  const c = contributors[vaulta]?.color ?? "#d4af37";
  return (
    <span
      className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0"
      style={{ borderColor: `${c}88`, color: c, background: "rgba(10, 10, 10, 0.4)" }}
    >
      {vaulta}
    </span>
  );
}

export function PendingPRs({ prs, loading, error, contributors, onRefresh }: Props) {
  return (
    <details className="relative group">
      <summary className="btn-glass cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        PRs
        {prs.length > 0 && (
          <span className="ml-1.5 text-lh-gold-light font-mono text-[10px]">{prs.length}</span>
        )}
      </summary>
      <div className="absolute right-0 top-full mt-2 w-[min(360px,90vw)] glass-panel p-3 z-30 max-h-[min(420px,60vh)] overflow-y-auto">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs text-lh-ivory-muted uppercase tracking-wider">Open pull requests</p>
          <button type="button" onClick={onRefresh} className="text-xs text-lh-gold-light hover:underline">
            {loading ? "…" : "Refresh"}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
        {!error && prs.length === 0 && !loading && (
          <p className="text-sm text-lh-ivory-muted">No open PRs.</p>
        )}
        <ul className="space-y-2">
          {prs.map((pr) => (
            <li key={pr.number}>
              <a
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg glass px-2.5 py-2 transition-colors hover:border-[color:var(--glass-border-hover)]"
              >
                <div className="flex items-center gap-2 mb-1">
                  {vaultaBadge(pr.vaulta, contributors)}
                  <span className="text-[10px] font-mono text-lh-ivory-muted">#{pr.number}</span>
                  {pr.draft && (
                    <span className="text-[10px] uppercase text-lh-ivory-muted">draft</span>
                  )}
                </div>
                <p className="text-sm text-lh-ivory leading-snug line-clamp-2">{pr.title}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
