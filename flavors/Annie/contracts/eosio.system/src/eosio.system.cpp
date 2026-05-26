// eosio.system — Annie flavor scaffold.
//
// This file is intentionally minimal. The full reference implementation lives in
//   flavors/Annie/upstream/antelope-reference-contracts/contracts/eosio.system/
// after running flavors/scripts/pull-references.sh.
//
// Annie's divergences live here as small, auditable overlays.

#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>

using namespace eosio;

CONTRACT system_contract : public contract {
public:
   using contract::contract;

   // Lazy-aware account creation. When lazy=true the chain materializes the
   // account on first action instead of at create time.
   ACTION newaccount(name creator, name newacc, public_key key, bool lazy /* = true */);

   // Token notify-handler entry point. Auto-creates the destination account if
   // `to` is a public-key string and does not yet exist on chain.
   [[eosio::on_notify("eosio.token::transfer")]]
   void on_transfer(name from, name to, asset quantity, std::string memo);
};
