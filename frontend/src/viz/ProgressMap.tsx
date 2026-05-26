import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { Contributors, PlanNode } from "../types";
import { colorForProgress, statusIcon } from "../theme";

interface Props {
  nodes: PlanNode[];
  contributors: Contributors;
  collapsed: Set<string>;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onToggleCollapse: (id: string) => void;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  progress: number;
  status: PlanNode["status"];
  owners: string[];
  hiddenChildren: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

/**
 * Walk depends_on edges and compute the set of nodes hidden under each collapsed root.
 */
function hiddenSets(nodes: PlanNode[], collapsed: Set<string>) {
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const childrenOf = new Map<string, string[]>();
  for (const n of nodes) {
    for (const dep of n.depends_on) {
      const arr = childrenOf.get(dep) ?? [];
      arr.push(n.id);
      childrenOf.set(dep, arr);
    }
  }
  const hidden = new Set<string>();
  const hiddenByRoot = new Map<string, number>();
  for (const root of collapsed) {
    if (!byId.has(root)) continue;
    let count = 0;
    const stack = [...(childrenOf.get(root) ?? [])];
    while (stack.length) {
      const id = stack.pop()!;
      if (hidden.has(id)) continue;
      hidden.add(id);
      count++;
      stack.push(...(childrenOf.get(id) ?? []));
    }
    hiddenByRoot.set(root, count);
  }
  return { hidden, hiddenByRoot };
}

export function ProgressMap({
  nodes,
  contributors,
  collapsed,
  selectedId,
  onSelect,
  onToggleCollapse,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { simNodes, simLinks, hiddenByRoot } = useMemo(() => {
    const { hidden, hiddenByRoot: hbr } = hiddenSets(nodes, collapsed);
    const visible = nodes.filter((n) => !hidden.has(n.id));
    const visibleIds = new Set(visible.map((n) => n.id));
    const sNodes: SimNode[] = visible.map((n) => ({
      id: n.id,
      title: n.title,
      progress: n.progress,
      status: n.status,
      owners: n.owners,
      hiddenChildren: hbr.get(n.id) ?? 0,
    }));
    const sLinks: SimLink[] = [];
    for (const n of visible) {
      for (const dep of n.depends_on) {
        if (visibleIds.has(dep)) sLinks.push({ source: dep, target: n.id });
      }
    }
    return { simNodes: sNodes, simLinks: sLinks, hiddenByRoot: hbr };
  }, [nodes, collapsed]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const wrap = wrapRef.current;
    if (!svgEl || !wrap) return;

    const width = wrap.clientWidth;
    const height = wrap.clientHeight;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#475569");

    const g = svg.append("g");

    const linkSel = g
      .append("g")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.4)
      .selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("marker-end", "url(#arrow)");

    const nodeG = g
      .append("g")
      .selectAll<SVGGElement, SimNode>("g.node")
      .data(simNodes, (d) => d.id)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .on("click", (_e, d) => onSelect(d.id))
      .on("dblclick", (e, d) => {
        e.stopPropagation();
        onToggleCollapse(d.id);
      });

    nodeG
      .append("circle")
      .attr("r", (d) => 12 + (d.progress / 100) * 18)
      .attr("fill", (d) => colorForProgress(d.progress))
      .attr("stroke", (d) => {
        const owner = d.owners[d.owners.length - 1];
        return owner && contributors[owner] ? contributors[owner].color : "#1e293b";
      })
      .attr("stroke-width", 3)
      .attr("class", (d) => (d.status === "in_progress" ? "node-pulse" : ""));

    nodeG
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#0f172a")
      .attr("font-weight", "600")
      .attr("font-size", 12)
      .text((d) => statusIcon[d.status] ?? "○");

    nodeG
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => 12 + (d.progress / 100) * 18 + 14)
      .attr("fill", "#e2e8f0")
      .attr("font-size", 11)
      .text((d) => d.title);

    nodeG
      .filter((d) => d.hiddenChildren > 0)
      .append("g")
      .attr("transform", (d) => `translate(${12 + (d.progress / 100) * 18 + 4}, -${12 + (d.progress / 100) * 18})`)
      .call((g) => {
        g.append("circle").attr("r", 9).attr("fill", "#1e293b").attr("stroke", "#475569");
        g.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr("font-size", 10)
          .attr("fill", "#e2e8f0")
          .text((d) => `+${(d as SimNode).hiddenChildren}`);
      });

    nodeG
      .filter((d) => d.id === selectedId)
      .select("circle")
      .attr("stroke-width", 5);

    const sim = d3
      .forceSimulation<SimNode, SimLink>(simNodes)
      .force(
        "link",
        d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(90).strength(0.4),
      )
      .force("charge", d3.forceManyBody().strength(-260))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(34));

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);
      nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = d.x;
        d.fy = d.y;
      });
    nodeG.call(drag);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);

    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      svg.attr("viewBox", `0 0 ${w} ${h}`);
      sim.force("center", d3.forceCenter(w / 2, h / 2));
      sim.alpha(0.3).restart();
    });
    ro.observe(wrap);

    return () => {
      sim.stop();
      ro.disconnect();
    };
  }, [simNodes, simLinks, contributors, selectedId, onSelect, onToggleCollapse]);

  void hiddenByRoot;

  return (
    <div ref={wrapRef} className="w-full h-full bg-slate-950">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
