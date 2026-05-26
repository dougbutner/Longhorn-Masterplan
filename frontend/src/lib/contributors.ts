import type { Contributor, Contributors } from "../types";

/** Bright, fully saturated hues for map badges and PR labels. */
export const CONTRIBUTOR_PALETTE = [
  "#ff3366",
  "#ff5533",
  "#ff8800",
  "#ffcc00",
  "#aadd00",
  "#33dd66",
  "#00ddaa",
  "#00bbff",
  "#4488ff",
  "#7766ff",
  "#bb44ff",
  "#ff44cc",
] as const;

const STORAGE_KEY = "lh-contributors";

export function readLocalContributors(): Contributors {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Contributors;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalContributors(contributors: Contributors): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contributors));
}

export function pickContributorColor(): string {
  const i = Math.floor(Math.random() * CONTRIBUTOR_PALETTE.length);
  return CONTRIBUTOR_PALETTE[i]!;
}

/** Assign a stable random palette color the first time this actor signs in on this browser. */
export function ensureLocalContributor(actor: string): Contributor {
  const all = readLocalContributors();
  const existing = all[actor];
  if (existing) return existing;

  const entry: Contributor = { color: pickContributorColor(), vaulta: actor };
  all[actor] = entry;
  writeLocalContributors(all);
  return entry;
}

export function mergeContributors(staticBase: Contributors, local: Contributors): Contributors {
  return { ...staticBase, ...local };
}

/** Deterministic palette color for CI labels when the actor is not in CONTRIBUTORS.json. */
export function colorForActor(actor: string): string {
  let h = 0;
  for (let i = 0; i < actor.length; i++) {
    h = (Math.imul(31, h) + actor.charCodeAt(i)) >>> 0;
  }
  return CONTRIBUTOR_PALETTE[h % CONTRIBUTOR_PALETTE.length]!;
}
