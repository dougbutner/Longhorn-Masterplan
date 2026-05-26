const PREFIX = "lh-claim:";

export type ClaimsMap = Record<string, string>;

export function readAllClaims(): ClaimsMap {
  const claims: ClaimsMap = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith(PREFIX)) continue;
      const nodeId = k.slice(PREFIX.length);
      const actor = localStorage.getItem(k);
      if (actor) claims[nodeId] = actor;
    }
  } catch {
    /* ignore */
  }
  return claims;
}

export function getClaim(nodeId: string): string | undefined {
  try {
    return localStorage.getItem(`${PREFIX}${nodeId}`) ?? undefined;
  } catch {
    return undefined;
  }
}

export function setClaim(nodeId: string, actor: string): void {
  localStorage.setItem(`${PREFIX}${nodeId}`, actor);
}

export function clearClaim(nodeId: string): void {
  localStorage.removeItem(`${PREFIX}${nodeId}`);
}
