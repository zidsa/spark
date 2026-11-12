#!/usr/bin/env bash
# Model-check the manager token handling and compare each property with its expected result.
# Usage: .agents/skills/verify-manager-token/check.sh   (from any directory; needs tlc and sany)
# Exit 0: every property matches expected() and the covered code matches the sync record.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(git -C "$DIR" rev-parse --show-toplevel)"

# Property -> expected result at the sync commit. "violated" marks a reported finding.
expected() {
  case "$1" in
    NoStaleLogout | NoAnonymousReload) echo violated ;;
    GuestNeverSendsToken) echo holds ;;
  esac
}
# Covered file and its git blob hash at the sync commit. These hashes are what enforce sync.
SYNCED="
src/api/client/interceptors.ts 1f33a5a50d7390c47e5c625e327a8677dbc7a5c3
src/api/client/main.ts eae17a2d669a6eb2a6fc1288b7622ca5f37eb58b
"

status=0
while read -r file hash; do
  [[ -n "$file" ]] || continue
  now="$(git -C "$REPO" hash-object "$file")"
  if [[ "$now" != "$hash" ]]; then
    echo "STALE $file changed since the sync commit; compare it with AuthToken.tla before trusting results"
    status=1
  fi
done <<<"$SYNCED"

meta="$(mktemp -d)"
trap 'rm -rf "$meta"' EXIT
cd "$DIR"
sany AuthToken.tla >"$meta/sany.log" 2>&1 || { cat "$meta/sany.log"; echo "FAIL AuthToken.tla does not parse"; exit 1; }

for prop in NoStaleLogout NoAnonymousReload GuestNeverSendsToken; do
  out="$DIR/out/$prop.txt"
  mkdir -p "$DIR/out"
  tlc -config "$prop.cfg" -deadlock -workers 1 -metadir "$meta/$prop" AuthToken.tla >"$out" 2>&1 || true
  if grep -q "Invariant $prop is violated" "$out"; then
    got=violated
  elif grep -q "No error has been found" "$out"; then
    got=holds
  else
    echo "ERROR $prop: TLC did not finish; see $out"
    status=1
    continue
  fi
  states="$(grep -o '[0-9]* distinct states found' "$out" | head -1)"
  if [[ "$got" == "$(expected "$prop")" ]]; then
    [[ "$got" == holds ]] && echo "PASS    $prop holds ($states)" || echo "FINDING $prop violated as recorded; trace in $out"
  else
    echo "CHANGED $prop expected $(expected "$prop") but $got ($states); trace in $out"
    status=1
  fi
done
exit "$status"
