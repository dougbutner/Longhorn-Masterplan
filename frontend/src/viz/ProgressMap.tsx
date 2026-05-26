import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { Contributors, PlanNode } from "../types";
import { colorForProgress, statusIcon, viz } from "../theme";

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
  depth: number;
  isRoot: boolean;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

/**
 * Walk parent edges and compute the set of nodes hidden under each collapsed root.
 */
function hiddenSets(nodes: PlanNode[], collapsed: Set<string>) {
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const childrenOf = new Map<string, string[]>();
  for (const n of nodes) {
    if (!n.parent) continue;
    const arr = childrenOf.get(n.parent) ?? [];
    arr.push(n.id);
    childrenOf.set(n.parent, arr);
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

function radiusFor(progress: number, isRoot: boolean) {
  if (isRoot) return 30;
  return 12 + (progress / 100) * 18;
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

  const { simNodes, simLinks } = useMemo(() => {
    const { hidden, hiddenByRoot } = hiddenSets(nodes, collapsed);
    const visible = nodes.filter((n) => !hidden.has(n.id));
    const visibleIds = new Set(visible.map((n) => n.id));
    const sNodes: SimNode[] = visible.map((n) => ({
      id: n.id,
      title: n.title,
      progress: n.progress,
      status: n.status,
      owners: n.owners,
      hiddenChildren: hiddenByRoot.get(n.id) ?? 0,
      depth: n.depth,
      isRoot: n.parent === null,
    }));
    const sLinks: SimLink[] = [];
    for (const n of visible) {
      if (n.parent && visibleIds.has(n.parent)) {
        sLinks.push({ source: n.parent, target: n.id });
      }
    }
    return { simNodes: sNodes, simLinks: sLinks };
  }, [nodes, collapsed]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const wrap = wrapRef.current;
    if (!svgEl || !wrap) return;

    const width = wrap.clientWidth;
    const height = wrap.clientHeight;
    const cx = width / 2;
    const cy = height / 2;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g");

    const linkSel = g
      .append("g")
      .attr("stroke", viz.link)
      .attr("stroke-width", 1.2)
      .selectAll("line")
      .data(simLinks)
      .enter()
      .append("line");

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
      .attr("r", (d) => radiusFor(d.progress, d.isRoot))
      .attr("fill", (d) => (d.isRoot ? viz.rootFill : colorForProgress(d.progress)))
      .attr("stroke", (d) => {
        if (d.isRoot) return viz.rootStroke;
        const owner = d.owners[d.owners.length - 1];
        return owner && contributors[owner] ? contributors[owner].color : viz.badgeStroke;
      })
      .attr("stroke-width", (d) => (d.isRoot ? 4 : 3))
      .attr("class", (d) => (d.status === "in_progress" && !d.isRoot ? "node-pulse" : ""));

    nodeG
      .filter((d) => d.isRoot)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", viz.label)
      .attr("font-weight", "600")
      .attr("font-size", 13)
      .attr("font-family", "DM Sans, system-ui, sans-serif")
      .text("Longhorn");

    nodeG
      .filter((d) => !d.isRoot)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", viz.iconOnNode)
      .attr("font-weight", "600")
      .attr("font-size", 12)
      .text((d) => statusIcon[d.status] ?? "○");

    nodeG
      .filter((d) => !d.isRoot)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => radiusFor(d.progress, false) + 14)
      .attr("fill", viz.label)
      .attr("font-size", 11)
      .attr("font-family", "DM Sans, system-ui, sans-serif")
      .text((d) => d.title);

    nodeG
      .filter((d) => d.hiddenChildren > 0)
      .append("g")
      .attr("transform", (d) => {
        const r = radiusFor(d.progress, d.isRoot);
        return `translate(${r + 4}, -${r})`;
      })
      .call((sel) => {
        sel.append("circle").attr("r", 9).attr("fill", viz.badgeFill).attr("stroke", viz.badgeStroke);
        sel
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr("font-size", 10)
          .attr("fill", viz.labelMuted)
          .text((d) => `+${(d as SimNode).hiddenChildren}`);
      });

    nodeG
      .filter((d) => d.id === selectedId)
      .select("circle")
      .attr("stroke", viz.selectedGlow)
      .attr("stroke-width", 5);

    const sim = d3
      .forceSimulation<SimNode, SimLink>(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((l) => {
            const t = l.target as SimNode;
            return t.depth === 1 ? 150 : 90;
          })
          .strength(0.6),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("collide", d3.forceCollide(38))
      .force(
        "radial",
        d3
          .forceRadial<SimNode>(
            (d) => (d.isRoot ? 0 : d.depth * 180),
            cx,
            cy,
          )
          .strength((d) => (d.isRoot ? 1 : 0.18)),
      );

    sim.on("tick", () => {
      const root = simNodes.find((n) => n.isRoot);
      if (root) {
        root.fx = cx;
        root.fy = cy;
      }
      linkSel
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);
      nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .filter((_e, d) => !d.isRoot)
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
      const newCx = w / 2;
      const newCy = h / 2;
      sim.force(
        "radial",
        d3
          .forceRadial<SimNode>(
            (d) => (d.isRoot ? 0 : d.depth * 180),
            newCx,
            newCy,
          )
          .strength((d) => (d.isRoot ? 1 : 0.18)),
      );
      sim.alpha(0.5).restart();
    });
    ro.observe(wrap);

    return () => {
      sim.stop();
      ro.disconnect();
    };
  }, [simNodes, simLinks, contributors, selectedId, onSelect, onToggleCollapse]);

  return (
    <div ref={wrapRef} className="w-full h-full bg-transparent">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
