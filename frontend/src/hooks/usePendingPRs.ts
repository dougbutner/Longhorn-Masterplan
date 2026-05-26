import { useCallback, useEffect, useState } from "react";
import { fetchOpenPRs } from "../lib/github";
import type { PendingPR } from "../types";

export function usePendingPRs(enabled = true) {
  const [prs, setPrs] = useState<PendingPR[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(undefined);
    try {
      setPrs(await fetchOpenPRs());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 120_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { prs, loading, error, refresh };
}
