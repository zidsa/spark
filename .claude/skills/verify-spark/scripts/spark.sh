#!/usr/bin/env bash
# Launch, check and stop one Spark instance owned by this verification run.
# Usage: spark.sh launch <dev|spa|ssr|ssg> | doctor | cleanup
# RUN (default: default) names the run. State lives in .state/$RUN, proof in evidence/$RUN.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="$(cd "$SKILL_DIR/../../.." && pwd)"
RUN="${RUN:-default}"
STATE="$SKILL_DIR/.state/$RUN"
EVIDENCE="$SKILL_DIR/evidence/$RUN"

die() { echo "FAIL: $*" >&2; exit 1; }

free_port() {
  bun -e 'const s = Bun.listen({ hostname: "127.0.0.1", port: 0, socket: { data() {} } }); console.log(s.port); s.stop(true);'
}

pid_owns_port() {
  ss -ltnpH "sport = :$2" 2>/dev/null | grep -q "pid=$1[,)]" && return 0
  # The listener can be a child of the process we started (bun -> vite).
  local child
  for child in $(pgrep -P "$1" 2>/dev/null); do
    pid_owns_port "$child" "$2" && return 0
  done
  return 1
}

launch() {
  local mode="${1:-dev}"
  [[ -f "$STATE/pid" ]] && kill -0 "$(cat "$STATE/pid")" 2>/dev/null &&
    die "run '$RUN' already has a live instance; run cleanup first or pick another RUN"
  mkdir -p "$STATE" "$EVIDENCE"
  cd "$REPO"
  [[ -d node_modules ]] || bun install --frozen-lockfile
  if [[ ! -f .env.local ]]; then
    # Verification scaffolding: the dev script needs .env.local; cleanup removes this copy.
    cp .env.example .env.local
    touch "$STATE/created-env-local"
  fi
  local port="${PORT:-$(free_port)}"
  case "$mode" in
    dev)
      setsid bun --env-file .env.local --preload ./instrument.server.mjs \
        ./node_modules/.bin/vite dev --port "$port" --strictPort --host 127.0.0.1 \
        >"$STATE/server.log" 2>&1 &
      ;;
    spa | ssr)
      local script=build
      [[ "$mode" == ssr ]] && script=build:ssr
      bun run "$script" >"$STATE/build.log" 2>&1 || die "bun run $script failed; see $STATE/build.log"
      bun run check:bundle >>"$STATE/build.log" 2>&1 || die "check:bundle failed; see $STATE/build.log"
      setsid bun --preload ./instrument.server.mjs ./node_modules/.bin/srvx --prod \
        --port "$port" --host 127.0.0.1 --static ../client dist/server/server.js \
        >"$STATE/server.log" 2>&1 &
      ;;
    ssg)
      bun run build:ssg >"$STATE/build.log" 2>&1 || die "bun run build:ssg failed; see $STATE/build.log"
      bun run check:bundle >>"$STATE/build.log" 2>&1 || die "check:bundle failed; see $STATE/build.log"
      # SSG deploys dist/client as plain static files, so serve only that directory.
      setsid ./node_modules/.bin/srvx --prod --port "$port" --host 127.0.0.1 \
        --static dist/client >"$STATE/server.log" 2>&1 &
      ;;
    *) die "unknown mode '$mode' (dev|spa|ssr|ssg)" ;;
  esac
  echo $! >"$STATE/pid"
  echo "$port" >"$STATE/port"
  echo "$mode" >"$STATE/mode"
  git rev-parse HEAD >"$STATE/commit"
  local url="http://127.0.0.1:$port"
  for _ in $(seq 1 60); do
    if curl -fsSL "$url/en-sa/" 2>/dev/null | grep -aq '<title>Spark</title>'; then
      echo "$url" >"$STATE/url"
      echo "READY $url mode=$mode run=$RUN pid=$(cat "$STATE/pid")"
      return 0
    fi
    kill -0 "$(cat "$STATE/pid")" 2>/dev/null || die "server exited; see $STATE/server.log"
    sleep 1
  done
  die "not ready after 60s; see $STATE/server.log"
}

doctor() {
  [[ -f "$STATE/pid" ]] || die "no instance for run '$RUN'; launch first"
  local pid port mode url head
  pid="$(cat "$STATE/pid")" port="$(cat "$STATE/port")" mode="$(cat "$STATE/mode")"
  url="http://127.0.0.1:$port"
  kill -0 "$pid" 2>/dev/null || die "pid $pid is not running"
  pid_owns_port "$pid" "$port" || die "port $port is not owned by pid $pid or its children"
  curl -fsSL -o "$STATE/doctor.html" "$url/en-sa/" || die "GET $url/en-sa/ failed"
  grep -aq '<title>Spark</title>' "$STATE/doctor.html" || die "GET $url/en-sa/ is not the Spark shell"
  head="$(git -C "$REPO" rev-parse HEAD)"
  local built
  built="$(cat "$STATE/commit")"
  [[ "$mode" == dev || "$head" == "$built" ]] ||
    echo "WARN: built at $built but HEAD is $head; relaunch to test current code" >&2
  echo "OK run=$RUN mode=$mode pid=$pid url=$url commit=$built"
}

cleanup() {
  if [[ -f "$STATE/pid" ]]; then
    local pid
    pid="$(cat "$STATE/pid")"
    # setsid made the server its own process group; stop that group only.
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    for _ in $(seq 1 10); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
    kill -KILL -- "-$pid" 2>/dev/null || true
  fi
  if [[ -f "$STATE/created-env-local" ]]; then
    rm -f "$REPO/.env.local"
  fi
  if [[ -f "$STATE/server.log" ]]; then
    mkdir -p "$EVIDENCE"
    cp "$STATE/server.log" "$EVIDENCE/server.log"
    [[ -f "$STATE/build.log" ]] && cp "$STATE/build.log" "$EVIDENCE/build.log"
  fi
  rm -rf "$STATE"
  echo "CLEANED run=$RUN; evidence kept in $EVIDENCE"
}

case "${1:-}" in
  launch) launch "${2:-dev}" ;;
  doctor) doctor ;;
  cleanup) cleanup ;;
  *) die "usage: RUN=<id> $0 launch <dev|spa|ssr|ssg> | doctor | cleanup" ;;
esac
