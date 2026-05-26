---
id: vaulta-auth
title: Vaulta / EOS sign-in
status: in_progress
progress: 40
owners: [annie, dougbutner]
depends_on: [frontend-overview]
tags: [frontend, auth, vaulta]
---

# Vaulta / EOS sign-in

We use **Wharfkit SessionKit** to authenticate participants. The signed identity unlocks the Activate button and every PR template the UI generates.

## Wharfkit configuration

```ts
import { SessionKit, Chains } from "@wharfkit/session";
import { WebRenderer } from "@wharfkit/web-renderer";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";
import { WalletPluginWebAuthn } from "@wharfkit/wallet-plugin-webauthn";

export const sessionKit = new SessionKit({
  appName: "longhorn-masterplan",
  chains: [Chains.EOS, Chains.Vaulta],
  ui: new WebRenderer(),
  walletPlugins: [
    new WalletPluginAnchor(),
    new WalletPluginWebAuthn(),
  ],
});
```

## Activate gate

The **Activate** button is disabled until `sessionKit.restore()` returns a Session. Once signed in:

- The actor's vaulta name is shown in the header.
- A pill colored from `CONTRIBUTORS.json` appears next to it.
- The menu's write-style items (claim node, open PR, comment) become enabled.

## PR title

Every PR opened through the UI is titled `[<actor>] <action> <node-id>`. CI fails any PR whose title doesn't start with a known `[vaultaname]` from `CONTRIBUTORS.json` (or whose proof signature can't be verified).

## Passkey path

The WebAuthn wallet plugin mirrors the **Longhorn wallet** flow described in `chain-passkey-flow.md`: a passkey on device, no seed phrase, transactions signed via WebAuthn.
