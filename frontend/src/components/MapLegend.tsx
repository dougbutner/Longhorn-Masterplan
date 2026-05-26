import { useState } from "react";
import * as d3 from "d3";
import type { Contributors } from "../types";
import {
  CATEGORY_LABEL,
  CATEGORY_SYMBOL,
  NODE_CATEGORIES,
  type NodeCategory,
} from "../viz/nodeCategories";

const CATEGORY_SWATCH: Record<NodeCategory, string> = {
  code: "#c9b87a",
  finance: "#e8c547",
  identity: "#9ec9e8",
  accounts: "#d4af37",
  resources: "#8fbc8f",
};

function CategoryShapeIcon({ category }: { category: NodeCategory }) {
  const path = d3.symbol().type(CATEGORY_SYMBOL[category]).size(64)();
  if (!path) return null;
  return (
    <svg width={14} height={14} viewBox="-6 -6 12 12" className="shrink-0" aria-hidden>
      <path d={path} fill={CATEGORY_SWATCH[category]} />
    </svg>
  );
}

interface Props {
  contributors: Contributors;
  empty?: boolean;
}

export function MapLegend({ contributors, empty = false }: Props) {
  const [open, setOpen] = useState(true);
  const entries = Object.entries(contributors);

  if (!open) {
    return (
      <button
        type="button"
        className="absolute bottom-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-lh-gold-light hover:text-lh-ivory transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Expand legend"
        title="Expand legend"
      >
        <span className="text-xs leading-none" aria-hidden>
          ▴
        </span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-10 max-w-[240px] glass-panel px-4 py-3 pr-9 text-xs">
      <button
        type="button"
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md text-lh-ivory-muted hover:text-lh-gold-light hover:bg-[rgba(245,240,230,0.08)] transition-colors"
        onClick={() => setOpen(false)}
        aria-expanded
        aria-label="Collapse legend"
        title="Collapse legend"
      >
        <span className="text-[10px] leading-none" aria-hidden>
          ▾
        </span>
      </button>

      <p className="text-[10px] font-semibold uppercase tracking-wider text-lh-gold mb-2">
        Longhorns
      </p>
      {empty ? (
        <p className="text-lh-ivory-muted text-[11px] leading-relaxed">No Longhorns yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map(([id, c]) => (
            <li key={id} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: c.color, boxShadow: `0 0 6px ${c.color}66` }}
              />
              <span className="text-lh-ivory font-medium">{id}</span>
              <span className="text-lh-ivory-muted font-mono text-[10px] truncate">{c.vaulta}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[10px] font-semibold uppercase tracking-wider text-lh-gold mt-3 mb-1.5">
        Domains
      </p>
      <ul className="flex flex-col gap-1 mb-2">
        {NODE_CATEGORIES.map((cat) => (
          <li key={cat} className="flex items-center gap-2 text-[11px] text-lh-ivory">
            <CategoryShapeIcon category={cat} />
            <span>{CATEGORY_LABEL[cat]}</span>
          </li>
        ))}
      </ul>

      <p className="text-[10px] text-lh-ivory-muted leading-relaxed mb-2">
        Double-click the center logo to herd nodes; click again to stop. Drag the logo to push nodes.
      </p>

      <p className="text-[10px] font-semibold uppercase tracking-wider text-lh-gold mt-2 mb-1.5">
        Progress
      </p>
      <div className="h-1.5 w-full rounded-full bg-[rgba(245,240,230,0.12)] overflow-hidden">
        <div className="h-full w-full rounded-full bg-lh-gold opacity-80" />
      </div>
      <div className="flex justify-between text-[10px] text-lh-ivory-muted mt-1 font-mono">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
