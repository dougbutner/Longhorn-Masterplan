import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { Contributors, PlanNode } from "../types";
import { HORN_SRC, ROOT_LOGO_SIZE } from "../lib/logo";
import { colorForProgress, statusIcon, viz } from "../theme";
import {
  buildParentMap,
  CATEGORY_SYMBOL,
  categoryForId,
  type NodeCategory,
} from "./nodeCategories";

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
  category: NodeCategory;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

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

const ROOT_R = ROOT_LOGO_SIZE / 2;

function radiusFor(progress: number, isRoot: boolean) {
  if (isRoot) return ROOT_R;
  return 12 + (progress / 100) * 18;
}

function collideRadius(d: SimNode) {
  if (d.isRoot) return ROOT_R + 10;
  const labelPad = Math.min(d.title.length * 0.45, 28);
  return radiusFor(d.progress, false) + 14 + labelPad;
}

function labelOffset(d: SimNode, cx: number, cy: number) {
  const x = d.x ?? cx;
  const y = d.y ?? cy;
  const angle = Math.atan2(y - cy, x - cx);
  const dist = radiusFor(d.progress, false) + 14;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  let anchor: "start" | "middle" | "end" = "middle";
  if (cos > 0.25) anchor = "start";
  else if (cos < -0.25) anchor = "end";
  return { x: cos * dist, y: sin * dist, anchor };
}

function forceRootCenter(
  centerRef: React.RefObject<{ x: number; y: number }>,
  chaseRef: React.RefObject<boolean>,
) {
  let simNodes: SimNode[] = [];
  const force: d3.Force<SimNode, SimLink> = (alpha) => {
    if (chaseRef.current) return;
    const root = simNodes.find((n) => n.isRoot);
    const c = centerRef.current;
    if (!root || !c || root.fx != null || root.fy != null) return;
    if (root.x == null || root.y == null) return;
    root.vx = (root.vx ?? 0) + (c.x - root.x) * 0.035 * alpha;
    root.vy = (root.vy ?? 0) + (c.y - root.y) * 0.035 * alpha;
  };
  force.initialize = (nodes) => {
    simNodes = nodes;
  };
  return force;
}

function forceChase(
  mouseRef: React.RefObject<{ x: number; y: number } | null>,
  chaseRef: React.RefObject<boolean>,
) {
  let simNodes: SimNode[] = [];
  const force: d3.Force<SimNode, SimLink> = (alpha) => {
    if (!chaseRef.current) return;
    const m = mouseRef.current;
    if (!m) return;
    for (const n of simNodes) {
      if (n.isRoot || n.x == null || n.y == null) continue;
      n.vx = (n.vx ?? 0) + (m.x - n.x) * 0.22 * alpha;
      n.vy = (n.vy ?? 0) + (m.y - n.y) * 0.22 * alpha;
    }
  };
  force.initialize = (nodes) => {
    simNodes = nodes;
  };
  return force;
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
  const [chaseMode, setChaseMode] = useState(false);
  const chaseRef = useRef(false);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  chaseRef.current = chaseMode;

  const parentMap = useMemo(() => buildParentMap(nodes), [nodes]);

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
      category: categoryForId(n.id, parentMap),
    }));
    const sLinks: SimLink[] = [];
    for (const n of visible) {
      if (n.parent && visibleIds.has(n.parent)) {
        sLinks.push({ source: n.parent, target: n.id });
      }
    }
    return { simNodes: sNodes, simLinks: sLinks };
  }, [nodes, collapsed, parentMap]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const wrap = wrapRef.current;
    if (!svgEl || !wrap) return;

    const width = wrap.clientWidth;
    const height = wrap.clientHeight;
    let cx = width / 2;
    let cy = height / 2;
    centerRef.current = { x: cx, y: cy };

    const rootNode = simNodes.find((n) => n.isRoot);
    if (rootNode) {
      rootNode.x = rootNode.x ?? cx;
      rootNode.y = rootNode.y ?? cy;
    }

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

    const symbolGen = d3.symbol<SimNode>().size((d) => {
      const r = radiusFor(d.progress, d.isRoot);
      return Math.PI * r * r * 1.15;
    });

    const nodeG = g
      .append("g")
      .selectAll<SVGGElement, SimNode>("g.node")
      .data(simNodes, (d) => d.id)
      .enter()
      .append("g")
      .attr("class", (d) =>
        d.isRoot ? `node cursor-pointer${chaseMode ? " map-root-chase" : ""}` : "node cursor-pointer",
      )
      .on("click", (e, d) => {
        e.stopPropagation();
        if (d.isRoot) {
          if (chaseRef.current) {
            setChaseMode(false);
            for (const n of simNodes) {
              if (!n.isRoot) {
                n.fx = null;
                n.fy = null;
              }
            }
            sim.alpha(0.4).restart();
          } else {
            onSelect(d.id);
          }
          return;
        }
        onSelect(d.id);
      })
      .on("dblclick", (e, d) => {
        e.stopPropagation();
        if (d.isRoot) {
          setChaseMode(true);
          for (const n of simNodes) {
            if (!n.isRoot) {
              n.fx = null;
              n.fy = null;
            }
          }
          sim.alpha(0.95).restart();
          return;
        }
        onToggleCollapse(d.id);
      });

    nodeG
      .filter((d) => d.isRoot)
      .append("image")
      .attr("class", "map-root-logo")
      .attr("href", HORN_SRC)
      .attr("x", -ROOT_R)
      .attr("y", -ROOT_R)
      .attr("width", ROOT_LOGO_SIZE)
      .attr("height", ROOT_LOGO_SIZE)
      .attr("preserveAspectRatio", "xMidYMid meet");

    nodeG
      .filter((d) => !d.isRoot)
      .append("path")
      .attr("d", (d) => symbolGen.type(CATEGORY_SYMBOL[d.category])(d)!)
      .attr("fill", (d) => colorForProgress(d.progress))
      .attr("stroke", (d) => {
        const owner = d.owners[d.owners.length - 1];
        return owner && contributors[owner] ? contributors[owner].color : viz.badgeStroke;
      })
      .attr("stroke-width", 3)
      .attr("class", (d) =>
        d.status === "in_progress" ? "node-shape node-pulse" : "node-shape",
      );

    nodeG
      .filter((d) => !d.isRoot)
      .append("text")
      .attr("class", "node-status")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", viz.iconOnNode)
      .attr("font-weight", "600")
      .attr("font-size", 11)
      .text((d) => statusIcon[d.status] ?? "○");

    const labelSel = nodeG
      .filter((d) => !d.isRoot)
      .append("text")
      .attr("class", "node-label")
      .attr("fill", viz.label)
      .attr("font-size", 10)
      .attr("font-family", "DM Sans, system-ui, sans-serif")
      .text((d) => d.title);

    nodeG
      .filter((d) => d.hiddenChildren > 0)
      .append("g")
      .attr("class", "node-badge")
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

    const sim = d3
      .forceSimulation<SimNode, SimLink>(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((l) => {
            const t = l.target as SimNode;
            return t.depth === 1 ? 165 : t.depth >= 2 ? 110 : 90;
          })
          .strength(chaseMode ? 0.15 : 0.6),
      )
      .force("charge", d3.forceManyBody().strength(chaseMode ? -140 : -360))
      .force("collide", d3.forceCollide<SimNode>().radius(collideRadius).strength(0.85).iterations(3))
      .force("rootCenter", forceRootCenter(centerRef, chaseRef))
      .force(
        "radial",
        d3
          .forceRadial<SimNode>(
            (d) => (d.isRoot ? 0 : d.depth * 185),
            cx,
            cy,
          )
          .strength((d) => (chaseMode ? 0 : d.isRoot ? 1 : 0.2)),
      )
      .force("chase", forceChase(mouseRef, chaseRef));

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);
      nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
      labelSel.each(function (d) {
        const { x, y, anchor } = labelOffset(d, cx, cy);
        d3.select(this).attr("x", x).attr("y", y).attr("text-anchor", anchor);
      });
    });

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .filter((_e, d) => !chaseRef.current || d.isRoot)
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(d.isRoot ? 0.45 : 0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
        if (d.isRoot) sim.alpha(0.35).restart();
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        if (d.isRoot) return;
        if (!chaseRef.current) {
          d.fx = null;
          d.fy = null;
        }
      });
    nodeG.call(drag);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);

    svg.on("mousemove.chase", (event) => {
      const [mx, my] = d3.pointer(event, g.node() as Element);
      mouseRef.current = { x: mx, y: my };
      if (chaseRef.current) sim.alpha(0.15).restart();
    });

    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      svg.attr("viewBox", `0 0 ${w} ${h}`);
      cx = w / 2;
      cy = h / 2;
      centerRef.current = { x: cx, y: cy };
      sim.force(
        "radial",
        d3
          .forceRadial<SimNode>(
            (d) => (d.isRoot ? 0 : d.depth * 185),
            cx,
            cy,
          )
          .strength((d) => (chaseRef.current ? 0 : d.isRoot ? 1 : 0.2)),
      );
      sim.alpha(0.5).restart();
    });
    ro.observe(wrap);

    return () => {
      sim.stop();
      ro.disconnect();
      svg.on("mousemove.chase", null);
    };
  }, [simNodes, simLinks, contributors, chaseMode, onSelect, onToggleCollapse]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const zoomG = d3.select(svgEl).select<SVGGElement>("g");
    if (zoomG.empty()) return;

    zoomG.selectAll<SVGGElement, SimNode>(".node").each(function (d) {
      if (!d || d.isRoot) return;
      const shape = d3.select(this).select(".node-shape");
      const owner = d.owners[d.owners.length - 1];
      const defaultStroke =
        owner && contributors[owner] ? contributors[owner].color : viz.badgeStroke;
      if (d.id === selectedId) {
        shape.attr("stroke", viz.selectedGlow).attr("stroke-width", 5);
      } else {
        shape.attr("stroke", defaultStroke).attr("stroke-width", 3);
      }
    });
  }, [selectedId, contributors]);

  return (
    <div ref={wrapRef} className="w-full h-full bg-transparent">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
