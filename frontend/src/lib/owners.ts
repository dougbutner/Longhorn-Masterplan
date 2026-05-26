import type { PlanNode } from "../types";
import type { ClaimsMap } from "./claims";

/** Owners from frontmatter plus any local claim for this browser. */
export function mergedOwners(node: PlanNode, claims: ClaimsMap): string[] {
  const claim = claims[node.id];
  if (!claim) return [...node.owners];
  return [...new Set([...node.owners, claim])];
}

/** Vaulta names (Longhorns) attached to at least one node. */
export function listLonghorns(nodes: PlanNode[], claims: ClaimsMap): string[] {
  const set = new Set<string>();
  for (const n of nodes) {
    for (const o of mergedOwners(n, claims)) set.add(o);
  }
  return [...set].sort();
}

export function applyClaimsToNodes(nodes: PlanNode[], claims: ClaimsMap): PlanNode[] {
  return nodes.map((n) => {
    const owners = mergedOwners(n, claims);
    if (owners.length === n.owners.length && owners.every((o, i) => o === n.owners[i])) return n;
    return { ...n, owners };
  });
}
