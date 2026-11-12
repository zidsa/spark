#!/usr/bin/env bash
# Formal checks for Spark's starter group: locale routing (TLA+) and the example form messages (bun).
# Usage: .agents/skills/formal-starter/check.sh   (from any directory; needs tlc, sany and bun)
# Exit 0: every result matches expected() and the covered code matches the sync record.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(git -C "$DIR" rev-parse --show-toplevel)"

# Model config -> expected result at the sync commit. "violated" marks a recorded hazard.
expected() {
  case "$1" in
    Bundled) echo holds ;;
    AsyncBackend) echo violated ;;
  esac
}
# Covered file and its git blob hash at the sync commit. These hashes are what enforce sync.
SYNCED="
src/routes/index.tsx 5dd1b70aac58299c7ed6ae4440e0d5b9808221e6
src/routes/\$lang/route.tsx 6b6316bbe6265f830056c5facf7eb81065f7c9e6
src/libraries/i18next/client.ts 00c8ade0c81ab5d3283a420e55b41b133a73d889
src/libraries/i18next/resource.ts 18a00efd6c46634e40e727c5038dc5504639140d
src/router.tsx 053a5641f4187c985884a85533f124eeee8dbadf
src/modules/example/schemas/example.schema.ts 991e97c666a08b4bc63d8fadf8f2e3584e5e0473
src/modules/example/components/example-form.tsx 57861268c3192296c4fb8c192f3e811e3fb3aaaf
"
# The model copies i18next's changeLanguage (isLanguageChangingTo guard) from this version.
I18NEXT=26.5.11

status=0
while read -r file hash; do
  [[ -n "$file" ]] || continue
  now="$(git -C "$REPO" hash-object "$REPO/$file")"
  if [[ "$now" != "$hash" ]]; then
    echo "STALE $file changed since the sync commit; compare it with the model before trusting results"
    status=1
  fi
done <<<"$SYNCED"
got_i18next="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$REPO/node_modules/i18next/package.json" 2>/dev/null | head -1)"
if [[ "$got_i18next" != "$I18NEXT" ]]; then
  echo "STALE i18next is '${got_i18next:-not installed}', model follows $I18NEXT; reread changeLanguage in node_modules/i18next"
  status=1
fi

meta="$(mktemp -d)"
trap 'rm -rf "$meta"' EXIT
cd "$DIR"
sany LocaleSync.tla >"$meta/sany.log" 2>&1 || { cat "$meta/sany.log"; echo "FAIL LocaleSync.tla does not parse"; exit 1; }

mkdir -p "$DIR/out"
for cfg in Bundled AsyncBackend; do
  out="$DIR/out/$cfg.txt"
  tlc -config "$cfg.cfg" -deadlock -workers 1 -metadir "$meta/$cfg" LocaleSync.tla >"$out" 2>&1 || true
  if grep -q "Invariant .* is violated" "$out"; then
    got=violated
  elif grep -q "No error has been found" "$out"; then
    got=holds
  else
    echo "ERROR $cfg: TLC did not finish; see $out"
    status=1
    continue
  fi
  states="$(grep -o '[0-9]* distinct states found' "$out" | head -1)"
  inv="$(grep -o 'Invariant [A-Za-z]* is violated' "$out" | head -1 || true)"
  if [[ "$got" == "$(expected "$cfg")" ]]; then
    [[ "$got" == holds ]] && echo "PASS    $cfg: UrlSupported, LangMatchesUrl hold ($states)" ||
      echo "FINDING $cfg: $inv as recorded; trace in $out"
  else
    echo "CHANGED $cfg expected $(expected "$cfg") but $got ($states); trace in $out"
    status=1
  fi
done

cd "$REPO"
if out="$(bun "$DIR/example-messages.ts" 2>&1)"; then
  echo "${out##*$'\n'}"
else
  echo "$out"
  status=1
fi
exit "$status"
