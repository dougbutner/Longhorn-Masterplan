import { useCallback, useMemo, useState } from "react";
import { readAllClaims, setClaim as persistClaim } from "../lib/claims";

export function useClaims() {
  const [version, setVersion] = useState(0);

  const claims = useMemo(() => readAllClaims(), [version]);

  const claimNode = useCallback((nodeId: string, actor: string) => {
    persistClaim(nodeId, actor);
    setVersion((v) => v + 1);
  }, []);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { claims, claimNode, refresh };
}
