// Wharfkit SessionKit wiring. Exposes a singleton, plus a small wrapper around
// login/restore/logout used by the auth context.

import { Chains, SessionKit, type Session } from "@wharfkit/session";
import { WebRenderer } from "@wharfkit/web-renderer";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";

let kit: SessionKit | null = null;

export function getSessionKit(): SessionKit {
  if (kit) return kit;
  kit = new SessionKit({
    appName: "longhorn-masterplan",
    chains: [Chains.EOS],
    ui: new WebRenderer(),
    walletPlugins: [new WalletPluginAnchor()],
  });
  return kit;
}

export async function restoreSession(): Promise<Session | undefined> {
  try {
    return await getSessionKit().restore();
  } catch {
    return undefined;
  }
}

export async function login(): Promise<Session | undefined> {
  const result = await getSessionKit().login();
  return result.session;
}

export async function logout(session: Session): Promise<void> {
  await getSessionKit().logout(session);
}
