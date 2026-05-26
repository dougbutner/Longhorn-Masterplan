import { interpolateRgb } from "d3-interpolate";

export const ORANGE = "#f97316";
export const GREEN = "#22c55e";

const progressScale = interpolateRgb(ORANGE, GREEN);

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
