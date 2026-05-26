# Flavors

A **flavor** is a complete, buildable variant of the Antelope chain we're building. Each subfolder holds *all* system contracts for one flavor, plus the upstream sources it derives from and a build script.

## Layout

```
flavors/
  Annie/                    ← the first flavor, see Annie/README.md
    README.md
    contracts/
      eosio.system/
      eosio.token/
      eosio.boot/
      eosio.proton/
      eosio.passkey/
      eosio.kv/
      eosio.events/
      eosio.subsidy/
    upstream/               ← populated by scripts/pull-references.sh
    scripts/
      build.sh
      diff-upstream.sh
    build/                  ← compiled .wasm + .abi
  scripts/
    pull-references.sh      ← sparse-pulls system contract folders per upstream (not full repos)
```

## Adding a new flavor

1. Copy `Annie/` to `flavors/<your-flavor>/`.
2. Open a PR `[yourvaultaname] add flavor <your-flavor>`.
3. Update each contract's README to declare its upstream lineage.
4. Run `flavors/<your-flavor>/scripts/build.sh` to compile against CDT.
