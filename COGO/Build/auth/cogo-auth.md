# Auth — Vaulta / EOS sign-in

The masterplan UI uses **Wharfkit SessionKit** to authenticate participants against an Antelope chain (EOS mainnet by default; Vaulta when selected).

## Flow

1. User clicks **Sign in**.
2. Wharfkit shows wallet picker (Anchor, WebAuthn/passkey).
3. User signs a deterministic challenge (`transaction.actions[0] = { account: "eosio.null", name: "nonce", data: <plan-hash + timestamp> }`).
4. App stores `{ actor, permission, walletPlugin }` in session storage.
5. **Activate** button enables; menu now exposes Claim / PR / Comment actions.

## Contributor binding

Every PR title generated through the UI is prefixed `[<actor>]` (e.g. `[annie] add lazy account materialization`). `CONTRIBUTORS.json` maps `actor → color`. CI validates the prefix on every PR.

## Why not Better Auth here

This repo's only auth surface is "prove you control a Vaulta account". A full session DB is overkill; the signed Wharfkit identity is the credential.
