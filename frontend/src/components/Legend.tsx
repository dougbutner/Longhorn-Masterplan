import type { Contributors } from "../types";

export function Legend({ contributors }: { contributors: Contributors }) {
  const entries = Object.entries(contributors);
  return (
    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Contributors</p>
      <ul className="flex flex-col gap-1">
        {entries.map(([id, c]) => (
          <li key={id} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
            <span className="text-slate-200">{id}</span>
            <span className="text-slate-500 font-mono">{c.vaulta}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-400 mt-2 mb-1 uppercase tracking-wider text-[10px]">Progress</p>
      <div className="h-2 w-40 rounded-full bg-gradient-to-r from-brand-orange to-brand-green" />
      <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
