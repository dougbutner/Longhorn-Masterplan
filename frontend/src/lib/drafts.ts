const PREFIX = "lh-draft:";

function key(actor: string, nodeId: string): string {
  return `${PREFIX}${actor}:${nodeId}`;
}

export function loadDraft(actor: string, nodeId: string): string | undefined {
  try {
    return localStorage.getItem(key(actor, nodeId)) ?? undefined;
  } catch {
    return undefined;
  }
}

export function saveDraft(actor: string, nodeId: string, body: string): void {
  localStorage.setItem(key(actor, nodeId), body);
}

export function clearDraft(actor: string, nodeId: string): void {
  localStorage.removeItem(key(actor, nodeId));
}

export function listDraftNodeIds(actor: string): string[] {
  const ids: string[] = [];
  const needle = `${PREFIX}${actor}:`;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith(needle)) continue;
      ids.push(k.slice(needle.length));
    }
  } catch {
    /* ignore */
  }
  return ids;
}
