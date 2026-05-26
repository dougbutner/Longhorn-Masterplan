import type { Contributors, SessionInfo } from "../types";

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
}: Props) {
  const myColor = session ? contributors[session.actor]?.color : undefined;
  const activeDisabled = !session;
  return (
    <header className="flex items-center gap-3 px-4 py-2 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <h1 className="text-sm font-semibold tracking-wide">
        <span className="text-brand-orange">Longhorn</span>{" "}
        <span className="text-slate-300">Masterplan</span>
      </h1>

      <div className="ml-2 flex items-center gap-1 text-xs text-slate-400">
        <select
          value={filterTag ?? ""}
          onChange={(e) => onFilterTag(e.target.value || undefined)}
          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs"
          aria-label="Filter by tag"
        >
          <option value="">all tags</option>
          {tagOptions.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onExpandAll}
          className="px-2 py-1 text-xs rounded border border-slate-800 text-slate-300 hover:bg-slate-900"
          title="Expand all (E)"
        >
          Expand
        </button>
        <button
          onClick={onCollapseAll}
          className="px-2 py-1 text-xs rounded border border-slate-800 text-slate-300 hover:bg-slate-900"
          title="Collapse all (C)"
        >
          Collapse
        </button>
        <button
          onClick={onToggleFullscreen}
          className="px-2 py-1 text-xs rounded border border-slate-800 text-slate-300 hover:bg-slate-900"
          title="Fullscreen (F)"
        >
          {isFullscreen ? "Exit FS" : "Fullscreen"}
        </button>

        {!session ? (
          <button
            onClick={signIn}
            disabled={!sessionReady}
            className="px-3 py-1.5 text-xs rounded bg-brand-orange/90 hover:bg-brand-orange text-slate-950 font-semibold disabled:opacity-40"
          >
            Sign in with Vaulta
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
              style={{ borderColor: myColor ?? "#64748b", color: myColor ?? "#cbd5e1" }}
              title={`${session.actor}@${session.permission} (${session.chain})`}
            >
              {session.actor}
            </span>
            <button
              onClick={signOut}
              className="px-2 py-1 text-xs rounded border border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              Sign out
            </button>
          </div>
        )}

        <button
          disabled={activeDisabled}
          className="px-3 py-1.5 text-xs rounded font-semibold bg-brand-green/90 hover:bg-brand-green disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950"
          title={activeDisabled ? "Sign in with Vaulta to activate" : "Activated"}
        >
          {activeDisabled ? "Activate" : "Active"}
        </button>
      </div>
    </header>
  );
}
