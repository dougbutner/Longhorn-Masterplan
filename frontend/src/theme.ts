import { interpolateRgb } from "d3-interpolate";

/** Progress: bronze → gold → bright gold */
export const PROGRESS_START = "#5c4a1f";
export const PROGRESS_MID = "#d4af37";
export const PROGRESS_END = "#f0d78c";

export const GOLD = "#d4af37";
export const GOLD_LIGHT = "#f0d78c";
export const IVORY = "#f5f0e6";
export const BLACK = "#0a0a0a";

const progressScale = interpolateRgb(PROGRESS_START, PROGRESS_END);

export function colorForProgress(progress: number): string {
  const p = Math.max(0, Math.min(100, progress)) / 100;
  return progressScale(p);
}

export const statusIcon: Record<string, string> = {
  not_started: "○",
  in_progress: "◔",
  review: "◐",
  done: "✓",
};

/** D3 / SVG palette */
export const viz = {
  link: "rgba(212, 175, 55, 0.28)",
  linkBright: "rgba(240, 215, 140, 0.45)",
  rootFill: "#121212",
  rootStroke: GOLD,
  label: IVORY,
  labelMuted: "rgba(201, 196, 184, 0.75)",
  iconOnNode: "#0a0a0a",
  badgeFill: "#1a1a1a",
  badgeStroke: "rgba(212, 175, 55, 0.4)",
  selectedGlow: GOLD_LIGHT,
} as const;
