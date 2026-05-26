import { useEffect, useMemo, useRef, useState } from "react";
import { MenuBar } from "./components/MenuBar";
import { NodePanel } from "./components/NodePanel";
import { Legend } from "./components/Legend";
import { ProgressMap } from "./viz/ProgressMap";
import { useSession } from "./hooks/useSession";
import { useFullscreen } from "./hooks/useFullscreen";
import planData from "./data/plan.json";
import contributorsData from "./data/contributors.json";
import type { Contributors, PlanNode } from "./types";

const REPO_URL = "https://github.com/dougbutner/Longhorn-Masterplan";

export default function App() {
  const nodes = planData as PlanNode[];
  const contributors = contributorsData as Contributors;
  const rootId = useMemo(() => nodes.find((n) => n.parent === null)?.id ?? "longhorn", [nodes]);

  const { ready, info: session, signIn, signOut } = useSession();
  const [selectedId, setSelectedId] = useState<string | undefined>(rootId);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined);

  const wrapRef = useRef<HTMLDivElement>(null);
  const { isFull, toggle: toggleFs } = useFullscreen(wrapRef);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const n of nodes) for (const t of n.tags) set.add(t);
    return [...set].sort();
  }, [nodes]);

  const visibleNodes = useMemo<PlanNode[]>(() => {
    if (!filterTag) return nodes;
    return nodes.filter((n) => n.parent === null || n.tags.includes(filterTag));
  }, [nodes, filterTag]);

  const selected = useMemo<PlanNode | undefined>(
    () => nodes.find((n) => n.id === selectedId),
    [nodes, selectedId],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "f" || e.key === "F") toggleFs();
      else if (e.key === "e" || e.key === "E") setCollapsed(new Set());
      else if (e.key === "c" || e.key === "C") setCollapsed(new Set(nodes.map((n) => n.id)));
      else if (e.key === "Escape") setSelectedId(undefined);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nodes, toggleFs]);

  const handleToggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openPRFor = (id: string, action: "claim" | "update" = "claim") => {
    if (!session) return;
    const title = encodeURIComponent(`[${session.actor}] ${action} ${id}`);
    const body = encodeURIComponent(
      `## Vaulta identity\n- vaulta name: \`${session.actor}\`\n- permission: \`${session.permission}\`\n- chain: \`${session.chain}\`\n\n## Masterplan nodes touched\n- ${id}\n\n## Change summary\n${action === "claim" ? "Claiming this node and starting work." : "Progress update."}\n`,
    );
    window.open(`${REPO_URL}/compare/main...main?expand=1&title=${title}&body=${body}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-full flex flex-col">
      <MenuBar
        session={session}
        sessionReady={ready}
        signIn={signIn}
        signOut={signOut}
        contributors={contributors}
        onExpandAll={() => setCollapsed(new Set())}
        onCollapseAll={() => setCollapsed(new Set(nodes.map((n) => n.id)))}
        onToggleFullscreen={toggleFs}
        isFullscreen={isFull}
        filterTag={filterTag}
        tagOptions={tagOptions}
        onFilterTag={setFilterTag}
      />
      <main className="flex-1 flex min-h-0">
        <div ref={wrapRef} className="relative flex-1 min-w-0">
          <ProgressMap
            nodes={visibleNodes}
            contributors={contributors}
            collapsed={collapsed}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onToggleCollapse={handleToggleCollapse}
          />
          <Legend contributors={contributors} />
        </div>
        <NodePanel
          node={selected}
          contributors={contributors}
          session={session}
          onClose={() => setSelectedId(undefined)}
          onClaim={(id) => openPRFor(id, "claim")}
          onOpenPR={(id) => openPRFor(id, "update")}
        />
      </main>
    </div>
  );
}
