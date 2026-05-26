# eosio.token (Annie)

Status: scaffolding
Upstream: AntelopeIO/reference-contracts
Upstream-path: antelope-reference-contracts/contracts/eosio.token

## Annie additions

- `transfer` emits a richer event via `eosio.events::emit_event` so KV-only indexers see balance changes without scanning action traces.
- No change to the public ABI; existing wallets and dapps work unmodified.
