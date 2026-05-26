import {
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolTriangle,
  type SymbolType,
} from "d3-shape";

export type NodeCategory = "code" | "finance" | "identity" | "accounts" | "resources";

export const NODE_CATEGORIES: NodeCategory[] = [
  "code",
  "finance",
  "identity",
  "accounts",
  "resources",
];

export const CATEGORY_LABEL: Record<NodeCategory, string> = {
  code: "Code",
  finance: "Finance",
  identity: "Identity",
  accounts: "Accounts",
  resources: "Resources",
};

export const CATEGORY_SYMBOL: Record<NodeCategory, SymbolType> = {
  code: symbolSquare,
  finance: symbolDiamond,
  identity: symbolCross,
  accounts: symbolCircle,
  resources: symbolTriangle,
};

/** Explicit mapping; unlisted nodes inherit from nearest mapped ancestor via parent walk. */
const CATEGORY_BY_ID: Partial<Record<string, NodeCategory>> = {
  // Code
  "retained-wasm-cdt": "code",
  "custom-system-contracts": "code",
  "consensus-tweaks": "code",
  "jungle4-testing": "code",
  // Finance
  "dex-mechanics": "finance",
  "dex-pool-locking": "finance",
  "dex-perpetuals": "finance",
  "dex-fee-bypass": "finance",
  "reflection-tokens": "finance",
  // Identity
  "programmable-permissions": "identity",
  "identity-verification": "identity",
  "lazy-passkey-actions": "identity",
  // Accounts
  "retained-core": "accounts",
  "retained-account-names": "accounts",
  "lazy-accounts": "accounts",
  // Resources
  "retained-permissions": "resources",
  "retained-resources": "resources",
  "enhanced-resources": "resources",
  "kv-storage": "resources",
  "events-indexing": "resources",
  "fractal-governance": "resources",
};

export function categoryForId(
  id: string,
  parentOf: Map<string, string | null>,
): NodeCategory {
  let cur: string | null = id;
  while (cur) {
    const hit = CATEGORY_BY_ID[cur];
    if (hit) return hit;
    cur = parentOf.get(cur) ?? null;
  }
  return "code";
}

export function buildParentMap(
  nodes: { id: string; parent: string | null }[],
): Map<string, string | null> {
  return new Map(nodes.map((n) => [n.id, n.parent]));
}
