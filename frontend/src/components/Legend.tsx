import type { Contributors } from "../types";

export function Legend({
  contributors,
  empty = false,
}: {
  contributors: Contributors;
  empty?: boolean;
}) {
  const entries = Object.entries(contributors);
  return (
    <div className="absolute bottom-4 left-4 glass-panel px-4 py-3 text-xs z-10 max-w-[220px]">
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
