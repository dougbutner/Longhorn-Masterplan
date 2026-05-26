import { LonghornLogo } from "./LonghornLogo";
import { PendingPRs } from "./PendingPRs";
import type { Contributors, PendingPR, SessionInfo } from "../types";

interface Props {
  session: SessionInfo | undefined;
  sessionReady: boolean;
  signIn: () => void;
  signOut: () => void;
  contributors: Contributors;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  filterTag: string | undefined;
  tagOptions: string[];
  onFilterTag: (t: string | undefined) => void;
  filterLonghorn: string | undefined;
  longhornOptions: string[];
  onFilterLonghorn: (v: string | undefined) => void;
  pendingPRs: PendingPR[];
  pendingPRsLoading: boolean;
  pendingPRsError: string | undefined;
  onRefreshPRs: () => void;
}

export function MenuBar({
  session,
  sessionReady,
  signIn,
  signOut,
  contributors,
  onExpandAll,
  onCollapseAll,
  onToggleFullscreen,
  isFullscreen,
  filterTag,
  tagOptions,
  onFilterTag,
  filterLonghorn,
  longhornOptions,
  onFilterLonghorn,
  pendingPRs,
  pendingPRsLoading,
  pendingPRsError,
  onRefreshPRs,
}: Props) {
  const myColor = session ? contributors[session.actor]?.color : undefined;
  const activeDisabled = !session;

  return (
    <header className="glass-bar flex items-center gap-3 px-5 py-3 shrink-0 z-20">
      <h1 className="flex items-center gap-2.5 text-sm font-semibold tracking-wide shrink-0">
        <LonghornLogo className="h-7 w-7" />
        <span className="text-lh-gold-light">Longhorn</span>
        <span className="text-lh-ivory-muted font-normal">Masterplan</span>
      </h1>

      <div className="flex items-center gap-2">
        <select
          value={filterTag ?? ""}
          onChange={(e) => onFilterTag(e.target.value || undefined)}
          className="select-glass"
          aria-label="Filter by tag"
        >
          <option value="">all tags</option>
          {tagOptions.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>
        <select
          value={filterLonghorn ?? ""}
          onChange={(e) => onFilterLonghorn(e.target.value || undefined)}
          className="select-glass"
          aria-label="Filter by Longhorn"
          disabled={longhornOptions.length === 0}
        >
          <option value="">all Longhorns</option>
          {longhornOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={onExpandAll} className="btn-glass" title="Expand all (E)">
          Expand
        </button>
        <button type="button" onClick={onCollapseAll} className="btn-glass" title="Collapse all (C)">
          Collapse
        </button>
        <button type="button" onClick={onToggleFullscreen} className="btn-glass" title="Fullscreen (F)">
          {isFullscreen ? "Exit FS" : "Fullscreen"}
        </button>

        <PendingPRs
          prs={pendingPRs}
          loading={pendingPRsLoading}
          error={pendingPRsError}
          contributors={contributors}
          onRefresh={onRefreshPRs}
        />

        {!session ? (
          <button
            type="button"
            onClick={signIn}
            disabled={!sessionReady}
            className="btn-gold disabled:opacity-40"
          >
            Sign in with Vaulta
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full border"
              style={{
                borderColor: myColor ?? "var(--glass-border-hover)",
                color: myColor ?? "var(--lh-gold-light)",
                backgroundColor: "var(--glass-bg-active)",
              }}
              title={`${session.actor}@${session.permission} (${session.chain})`}
            >
              {session.actor}
            </span>
            <button type="button" onClick={signOut} className="btn-glass">
              Sign out
            </button>
          </div>
        )}

        <button
          type="button"
          disabled={activeDisabled}
          className={activeDisabled ? "btn-glass opacity-50 cursor-not-allowed" : "btn-gold"}
          title={activeDisabled ? "Sign in with Vaulta to activate" : "Activated"}
        >
          {activeDisabled ? "Activate" : "Active"}
        </button>
      </div>
    </header>
  );
}
