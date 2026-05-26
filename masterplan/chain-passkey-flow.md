---
id: chain-passkey-flow
title: Chain & passkey UX flow
status: not_started
progress: 10
owners: [annie]
depends_on: [flavor-annie, programmable-permissions, lazy-account-materialization]
tags: [chain, ux, passkey]
---

# Chain & passkey UX flow

The North Star UX for Annie. A new user never sees a seed phrase, never funds RAM up-front, and never deals with a memo.

## Flow

1. **Longhorn wallet creates a passkey** on the user's device. The wallet shows the user their new account name (key-derived), e.g. `EOS4vJ9JU1bJe7tPfZgpxpV3h`.
2. **User goes to their CEX** and transfers EOS / Annie tokens to `EOS4vJ9JU1bJe7tPfZgpxpV3h`.
   - Critically: **no memo required**. The destination string *is* the account.
3. **First on-chain action**: at some later moment, the user signs anything from Longhorn wallet using `EOS4vJ9JU1bJe7tPfZgpxpV3h@active`. The chain:
   - **Materializes** the account on first action (see `lazy-account-materialization.md`).
   - Binds the **passkey** as the `active` authority (see `programmable-permissions.md`).
   - Bills the account from the existing balance (see `enhanced-resource-model.md`).
4. **Done.** The user is signing on chain without ever having "opened" an account.

## Properties

- **No memo** — bridges and CEXes are well-trained on plain account-name destinations.
- **No seed** — WebAuthn keys live in secure enclave / passkey provider.
- **No pre-funding cost** — billing happens *from* the inbound transfer.
- **Stateless onboarding** — the chain is the database; no waitlist.

## Touchpoints

- Wallet UX: Longhorn wallet (out of scope here; specified separately).
- Contract logic: `eosio.system::on_transfer` (lazy create) + `eosio.passkey::auth_passkey`.
- Frontend: the masterplan UI's Wharfkit sign-in is the *desktop* equivalent of this same flow.
