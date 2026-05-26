#!/usr/bin/env bash
# Build every Annie contract via CDT.
# Requires `cdt-cpp` / `eosio-cpp` on PATH (install AntelopeIO/cdt).

set -euo pipefail

ANNIE="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ANNIE/build"
mkdir -p "$OUT"

CDT_BIN="${CDT_BIN:-cdt-cpp}"
if ! command -v "$CDT_BIN" >/dev/null 2>&1; then
  echo "error: $CDT_BIN not on PATH; install https://github.com/AntelopeIO/cdt" >&2
  exit 1
fi

CONTRACTS=(eosio.system eosio.token eosio.boot eosio.proton eosio.passkey eosio.kv eosio.events eosio.subsidy)

for c in "${CONTRACTS[@]}"; do
  SRC_DIR="$ANNIE/contracts/$c"
  SRC_FILE="$SRC_DIR/src/$c.cpp"
  if [ ! -f "$SRC_FILE" ]; then
    echo "  skip $c (no $SRC_FILE)"
    continue
  fi
  echo "  → building $c"
  "$CDT_BIN" -abigen \
    -I "$SRC_DIR/include" \
    -contract "$c" \
    -o "$OUT/$c.wasm" \
    "$SRC_FILE"
done

echo
echo "Built artifacts: $OUT"
