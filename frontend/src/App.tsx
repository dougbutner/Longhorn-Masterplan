import { useEffect, useMemo, useRef, useState } from "react";
import { MenuBar } from "./components/MenuBar";
import { MapLegend } from "./components/MapLegend";
import { NodeDetailPanel } from "./components/NodeDetailPanel";
import { ProgressMap } from "./viz/ProgressMap";
import { useSession } from "./hooks/useSession";
import { useClaims } from "./hooks/useClaims";
import { usePendingPRs } from "./hooks/usePendingPRs";
import { useFullscreen } from "./hooks/useFullscreen";
import { LonghornAccent } from "./components/LonghornAccent";
import { SuggestPRNotice } from "./components/SuggestPRNotice";
import { githubEditUrl } from "./lib/constants";
import { suggestNodePR, type SuggestPRResult } from "./lib/preparePr";
import { applyClaimsToNodes, listLonghorns } from "./lib/owners";
import planData from "./data/plan.json";
import contributorsData from "./data/contributors.json";
import { useContributors } from "./hooks/useContributors";
import type { Contributors, PlanNode } from "./types";

export default function App() {
  const nodes = planData as PlanNode[];
  const staticContributors = contributorsData as Contributors;
  const { contributors, registerContributor } = useContributors(staticContributors);
  const { ready, info: session, signIn, signOut } = useSession();
  const { claims, claimNode } = useClaims();

  useEffect(() => {
    if (session?.actor) registerContributor(session.actor);
  }, [session?.actor, registerContributor]);
  const { prs, loading: prsLoading, error: prsError, refresh: refreshPRs } = usePendingPRs(true);

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
  const [filterOwner, setFilterOwner] = useState<string | undefined>(undefined);
  const [suggestNotice, setSuggestNotice] = useState<SuggestPRResult | null>(null);
  const [suggestingPR, setSuggestingPR] = useState(false);

  const mapShellRef = useRef<HTMLDivElement>(null);
  const { isFull, toggle: toggleFs } = useFullscreen(mapShellRef);

  const nodesWithClaims = useMemo(() => applyClaimsToNodes(nodes, claims), [nodes, claims]);

  const longhornOptions = useMemo(() => listLonghorns(nodes, claims), [nodes, claims]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const n of nodes) for (const t of n.tags) set.add(t);
    return [...set].sort();
  }, [nodes]);

  const visibleNodes = useMemo<PlanNode[]>(() => {
    let list = nodesWithClaims;
    if (filterTag) {
      list = list.filter((n) => n.parent === null || n.tags.includes(filterTag));
    }
    if (filterOwner) {
      list = list.filter((n) => n.parent === null || n.owners.includes(filterOwner));
    }
    return list;
  }, [nodesWithClaims, filterTag, filterOwner]);

  const selected = useMemo<PlanNode | undefined>(
    () => nodesWithClaims.find((n) => n.id === selectedId),
    [nodesWithClaims, selectedId],
  );

  const legendContributors = useMemo(() => {
    const out: Contributors = {};
    for (const id of longhornOptions) {
      if (contributors[id]) out[id] = contributors[id];
      else {
        out[id] = { color: "#d4af37", vaulta: id };
      }
    }
    return out;
  }, [longhornOptions, contributors]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target;
      const inField =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.closest(".CodeMirror") !== null);
      if (inField) return;
      if (e.key === "f" || e.key === "F") toggleFs();
      else if (e.key === "e" || e.key === "E") setCollapsed(new Set());
      else if (e.key === "c" || e.key === "C") setCollapsed(new Set(nodes.map((n) => n.id)));
      else if (e.key === "Escape" && !document.querySelector(".lh-editor-overlay")) {
        if (selectedId) setSelectedId(undefined);
        else if (isFull) void toggleFs();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nodes, toggleFs, isFull, selectedId]);

  function handleToggleCollapse(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleClaim(node: PlanNode) {
    if (!session) return;
    claimNode(node.id, session.actor);
  }

  async function handleSuggestPR(node: PlanNode, editedBody: string) {
    if (!session) return;
    setSuggestingPR(true);
    try {
      const result = await suggestNodePR(node, session, editedBody, claims);
      setSuggestNotice(result);
    } catch (e) {
      setSuggestNotice({
        mode: "manual",
        editUrl: githubEditUrl(node.file),
        copied: false,
        message: `Could not start PR flow: ${e}`,
      });
    } finally {
      setSuggestingPR(false);
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-lh-black">
      <div className="pointer-events-none absolute inset-0 z-0 bg-lh-radial opacity-80" aria-hidden />
      {!isFull && <LonghornAccent />}
      <MenuBar
        session={session}
        sessionReady={ready}
        signIn={signIn}
        signOut={signOut}
        contributors={contributors}
        pendingPRs={prs}
        pendingPRsLoading={prsLoading}
        pendingPRsError={prsError}
        onRefreshPRs={() => void refreshPRs()}
        onExpandAll={() => setCollapsed(new Set())}
        onCollapseAll={() => setCollapsed(new Set(nodes.map((n) => n.id)))}
        onToggleFullscreen={toggleFs}
        isFullscreen={isFull}
        filterTag={filterTag}
        tagOptions={tagOptions}
        onFilterTag={setFilterTag}
        filterLonghorn={filterOwner}
        longhornOptions={longhornOptions}
        onFilterLonghorn={setFilterOwner}
      />
      <main className="relative z-[2] flex min-h-0 flex-1">
        <div
          ref={mapShellRef}
          className={`map-shell relative flex min-h-0 min-w-0 flex-1 flex-col bg-lh-black ${isFull ? "" : "border-r border-[color:var(--glass-border)]"}`}
        >
          {isFull && (
            <>
              <div className="pointer-events-none absolute inset-0 z-0 bg-lh-radial opacity-80" aria-hidden />
              <LonghornAccent />
            </>
          )}
          <div className="relative z-[1] min-h-0 flex-1">
            <ProgressMap
              nodes={visibleNodes}
              contributors={contributors}
              collapsed={collapsed}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onToggleCollapse={handleToggleCollapse}
            />
          </div>
          <MapLegend contributors={legendContributors} empty={longhornOptions.length === 0} />

          {isFull && (
            <>
              <div className="pointer-events-none absolute top-4 right-4 z-20 flex gap-2">
                <button type="button" onClick={() => void toggleFs()} className="btn-glass pointer-events-auto">
                  Exit fullscreen (F)
                </button>
              </div>
              {!selected && (
                <p className="pointer-events-none absolute bottom-16 left-1/2 z-10 max-w-xs -translate-x-1/2 rounded-xl glass-panel px-4 py-2 text-center text-[11px] leading-relaxed text-lh-ivory-muted">
                  Click any node to open its detail panel
                </p>
              )}
              {selected && (
                <NodeDetailPanel
                  layout="overlay"
                  node={selected}
                  contributors={contributors}
                  claims={claims}
                  session={session}
                  suggestingPR={suggestingPR}
                  onClose={() => setSelectedId(undefined)}
                  onClaim={handleClaim}
                  onSuggestPR={handleSuggestPR}
                />
              )}
            </>
          )}
        </div>

        {!isFull && selected && (
          <NodeDetailPanel
            layout="aside"
            node={selected}
            contributors={contributors}
            claims={claims}
            session={session}
            suggestingPR={suggestingPR}
            onClose={() => setSelectedId(undefined)}
            onClaim={handleClaim}
            onSuggestPR={handleSuggestPR}
          />
        )}
      </main>
      <SuggestPRNotice result={suggestNotice} onDismiss={() => setSuggestNotice(null)} />
    </div>
  );
}
