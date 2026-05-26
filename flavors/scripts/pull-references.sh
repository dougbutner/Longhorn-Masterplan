#!/usr/bin/env bash
# Sparse-pull system contract folders from each upstream repo (not full clones).
#
# Usage:
#   flavors/scripts/pull-references.sh [flavor] [source|contract|all]...
#
# Sources (all system contracts in that upstream's contracts/ tree):
#   antelope   AntelopeIO/reference-contracts
#   wax        worldwide-asset-exchange/wax-system-contracts
#   wire       Wire-Network/wire-system-contracts
#   vaulta     VaultaFoundation/system-contracts
#   enf        eosnetworkfoundation/eos-system-contracts
#   proton     XPRNetwork/proton.contracts
#   ts         XPRNetwork/ts-smart-contracts (assembly only)
#
# Examples:
#   flavors/scripts/pull-references.sh Annie all
#   flavors/scripts/pull-references.sh Annie antelope wax proton
#   flavors/scripts/pull-references.sh Annie eosio.system   # Annie contract → minimal paths
#
# Default (no args after flavor): Annie all

set -euo pipefail

FLAVOR="${1:-Annie}"
shift || true

if [ "${#}" -lt 1 ]; then
  set -- all
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/flavors/$FLAVOR/upstream"

mkdir -p "$DEST"
cd "$DEST"

ensure_sparse_repo() {
  local url="$1" dir="$2" ref="$3"
  if [ -d "$dir/.git" ]; then
    return 0
  fi
  echo "  → sparse-clone $url → $dir ($ref)"
  if ! git clone --filter=blob:none --no-checkout --depth 1 --branch "$ref" --sparse "$url" "$dir" >/dev/null 2>&1; then
    git clone --filter=blob:none --no-checkout --depth 1 --sparse "$url" "$dir" >/dev/null
  fi
}

# Merge new sparse paths into an existing sparse repo (union of paths).
apply_sparse_paths() {
  local dir="$1" ref="$2"
  shift 2
  local -a new_paths=("$@")

  git -C "$dir" fetch --depth 1 origin "$ref" >/dev/null 2>&1 || true
  git -C "$dir" checkout -q "$ref" 2>/dev/null || true
  git -C "$dir" sparse-checkout init --cone >/dev/null 2>&1 || true

  local -a existing=()
  if git -C "$dir" sparse-checkout list >/dev/null 2>&1; then
    while IFS= read -r line; do
      line="${line#+}"; line="${line# }"
      [ -n "$line" ] && existing+=("$line")
    done < <(git -C "$dir" sparse-checkout list 2>/dev/null || true)
  fi

  local -a merged=()
  local p seen
  for p in "${existing[@]}" "${new_paths[@]}"; do
    seen=0
    for m in "${merged[@]}"; do
      [ "$m" = "$p" ] && seen=1 && break
    done
    [ "$seen" -eq 0 ] && merged+=("$p")
  done

  git -C "$dir" sparse-checkout set "${merged[@]}" >/dev/null
  git -C "$dir" checkout -q "$ref" >/dev/null 2>&1 || true
  git -C "$dir" pull --ff-only --depth 1 origin "$ref" >/dev/null 2>&1 || true
}

pull_repo_paths() {
  local url="$1" dir="$2" ref="$3"
  shift 3
  local -a paths=("$@")
  ensure_sparse_repo "$url" "$dir" "$ref"
  apply_sparse_paths "$dir" "$ref" "${paths[@]}"
  echo "     ✓ ${#paths[@]} path(s) in $dir"
}

# --- Upstream sources: every system contract folder (no icons / test_contracts) ---

pull_source_antelope() {
  echo "== antelope (reference-contracts) =="
  local base="contracts"
  pull_repo_paths \
    "https://github.com/AntelopeIO/reference-contracts.git" \
    antelope-reference-contracts main \
    "$base/eosio.bios" \
    "$base/eosio.boot" \
    "$base/eosio.bpay" \
    "$base/eosio.fees" \
    "$base/eosio.msig" \
    "$base/eosio.system" \
    "$base/eosio.token" \
    "$base/eosio.wrap"
}

pull_source_wax() {
  echo "== wax (wax-system-contracts) =="
  local base="contracts"
  pull_repo_paths \
    "https://github.com/worldwide-asset-exchange/wax-system-contracts.git" \
    wax-system-contracts master \
    "$base/eosio.bios" \
    "$base/eosio.msig" \
    "$base/eosio.system" \
    "$base/eosio.token" \
    "$base/eosio.wrap"
}

pull_source_wire() {
  echo "== wire (wire-system-contracts) =="
  local base="contracts"
  pull_repo_paths \
    "https://github.com/Wire-Network/wire-system-contracts.git" \
    wire-system-contracts master \
    "$base/sysio.bios" \
    "$base/sysio.boot" \
    "$base/sysio.msig" \
    "$base/sysio.roa" \
    "$base/sysio.system" \
    "$base/sysio.token" \
    "$base/sysio.wrap"
}

pull_source_vaulta() {
  echo "== vaulta (VaultaFoundation/system-contracts) =="
  local base="contracts"
  pull_repo_paths \
    "https://github.com/VaultaFoundation/system-contracts.git" \
    vaulta-system-contracts main \
    "$base/core.vaulta" \
    "$base/eosio.bios" \
    "$base/eosio.boot" \
    "$base/eosio.bpay" \
    "$base/eosio.fees" \
    "$base/eosio.msig" \
    "$base/eosio.system" \
    "$base/eosio.token" \
    "$base/eosio.wrap"
}

pull_source_enf() {
  echo "== enf (eos-system-contracts) =="
  local base="contracts"
  pull_repo_paths \
    "https://github.com/eosnetworkfoundation/eos-system-contracts.git" \
    eos-system-contracts main \
    "$base/core.vaulta" \
    "$base/eosio.bios" \
    "$base/eosio.boot" \
    "$base/eosio.bpay" \
    "$base/eosio.fees" \
    "$base/eosio.msig" \
    "$base/eosio.system" \
    "$base/eosio.token" \
    "$base/eosio.wrap"
}

pull_source_proton() {
  echo "== proton (proton.contracts) =="
  local base="contracts"
  pull_repo_paths \
    "https://github.com/XPRNetwork/proton.contracts.git" \
    proton.contracts master \
    "$base/cfund.proton" \
    "$base/eosio.assert" \
    "$base/eosio.bios" \
    "$base/eosio.msig" \
    "$base/eosio.msig.old" \
    "$base/eosio.proton" \
    "$base/eosio.system" \
    "$base/eosio.token" \
    "$base/eosio.wrap" \
    "$base/memochecker" \
    "$base/token.proton"
}

pull_source_ts() {
  echo "== ts (ts-smart-contracts, assembly only) =="
  pull_repo_paths \
    "https://github.com/XPRNetwork/ts-smart-contracts.git" \
    ts-smart-contracts main \
    assembly
}

# Annie contract name → minimal upstream path(s)
pull_annie_contract() {
  local contract="$1"
  case "$contract" in
    eosio.system|eosio.token|eosio.boot)
      pull_source_antelope
      ;;
    eosio.proton)
      pull_source_proton
      ;;
    eosio.kv)
      pull_source_ts
      ;;
    eosio.passkey)
      echo "== eosio.passkey =="
      echo "     (Tonomy-ID is an app monorepo — no small contracts/ tree; diff manually or add a dedicated contracts repo)"
      ;;
    eosio.events|eosio.subsidy)
      echo "== $contract =="
      echo "     (no upstream — Annie-native contract)"
      ;;
    *)
      echo "error: unknown Annie contract: $contract" >&2
      exit 2
      ;;
  esac
}

pull_source() {
  case "$1" in
    antelope) pull_source_antelope ;;
    wax)      pull_source_wax ;;
    wire)     pull_source_wire ;;
    vaulta)   pull_source_vaulta ;;
    enf)      pull_source_enf ;;
    proton)   pull_source_proton ;;
    ts)       pull_source_ts ;;
    all)
      pull_source_antelope
      pull_source_wax
      pull_source_wire
      pull_source_vaulta
      pull_source_enf
      pull_source_proton
      pull_source_ts
      ;;
    eosio.system|eosio.token|eosio.boot|eosio.proton|eosio.passkey|eosio.kv|eosio.events|eosio.subsidy)
      pull_annie_contract "$1"
      ;;
    *)
      echo "error: unknown source or contract: $1" >&2
      echo "sources: antelope wax wire vaulta enf proton ts all" >&2
      echo "contracts: eosio.system eosio.token eosio.boot eosio.proton eosio.passkey eosio.kv eosio.events eosio.subsidy" >&2
      exit 2
      ;;
  esac
}

echo "Pulling system contracts (sparse) into: $DEST"
for arg in "$@"; do
  pull_source "$arg"
done

echo
echo "Done. Upstreams are under: $DEST"
