#!/usr/bin/env bash
# Show Annie's divergence from each declared upstream.
# Reads the "Upstream:" header in flavors/Annie/contracts/<c>/README.md and diffs the matching folder.

set -euo pipefail

ANNIE="$(cd "$(dirname "$0")/.." && pwd)"
UP="$ANNIE/upstream"

for readme in "$ANNIE"/contracts/*/README.md; do
  contract="$(basename "$(dirname "$readme")")"
  upstream_path="$(grep -m1 '^Upstream-path:' "$readme" | awk -F': *' '{print $2}' || true)"
  if [ -z "${upstream_path:-}" ]; then
    echo "  skip $contract (no Upstream-path: in README)"
    continue
  fi
  src="$UP/$upstream_path"
  dst="$ANNIE/contracts/$contract"
  if [ ! -d "$src" ]; then
    echo "  skip $contract (missing upstream $src — run flavors/scripts/pull-references.sh)"
    continue
  fi
  echo "=== $contract vs $upstream_path ==="
  diff -ruN --exclude='.git' "$src" "$dst" || true
done
