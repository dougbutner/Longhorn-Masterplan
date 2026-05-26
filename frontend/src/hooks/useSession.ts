import { useEffect, useState } from "react";
import type { Session } from "@wharfkit/session";
import { login, logout, restoreSession } from "../lib/wharfkit";
import type { SessionInfo } from "../types";

export function useSession() {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    restoreSession()
      .then((s) => { if (!cancelled) setSession(s); })
      .catch((e) => { if (!cancelled) setError(String(e)); })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  const info: SessionInfo | undefined = session
    ? {
        actor: String(session.actor),
        permission: String(session.permission),
        chain: session.chain.name,
      }
    : undefined;

  return {
    ready,
    session,
    info,
    error,
    signIn: async () => {
      setError(undefined);
      try { setSession(await login()); }
      catch (e) { setError(String(e)); }
    },
    signOut: async () => {
      if (!session) return;
      await logout(session);
      setSession(undefined);
    },
  };
}
