// eosio.passkey — Annie flavor scaffold.
//
// Programmable permissions + native WebAuthn verification.

#include <eosio/eosio.hpp>
#include <eosio/crypto.hpp>

using namespace eosio;

CONTRACT passkey_contract : public contract {
public:
   using contract::contract;

   ACTION setlogic(name account, name permission, std::vector<uint8_t> wasm_logic);
   ACTION authpasskey(name account, signature sig, std::vector<char> data);
};
