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

# Run a command in its own session and write the session leader's pid to $1, so cleanup
# can stop the whole group. $! would name the backgrounded subshell, not the leader.
# macOS has no setsid(1).
detach() {
  local pidfile="$1"
  shift
  if command -v setsid >/dev/null; then
    setsid bash -c 'echo $$ >"$0" && exec "$@"' "$pidfile" "$@"
  else
    perl -MPOSIX -e 'defined POSIX::setsid() or die "setsid: $!"; my $f = shift; open(my $h, ">", $f) or die "$f: $!"; print $h "$$\n"; close $h; exec @ARGV or die "exec $ARGV[0]: $!"' -- "$pidfile" "$@"
  fi
}

port_held() {
  if command -v ss >/dev/null; then
    ss -ltnH "sport = :$1" 2>/dev/null | grep -q .
  else
    lsof -nP -iTCP:"$1" -sTCP:LISTEN -t >/dev/null 2>&1
  fi
}

pid_listens() {
  if command -v ss >/dev/null; then
    ss -ltnpH "sport = :$2" 2>/dev/null | grep -q "pid=$1[,)]"
  else
    lsof -nP -a -p "$1" -iTCP:"$2" -sTCP:LISTEN -t >/dev/null 2>&1
  fi
}

# Start time of a pid, so cleanup can tell this run's server from a recycled pid.
# LC_ALL=C: lstart is locale-formatted, and launch and cleanup may run in different locales.
started_at() {
  LC_ALL=C ps -o lstart= -p "$1" 2>/dev/null
}

pid_owns_port() {
  pid_listens "$1" "$2" && return 0
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
  rm -f "$STATE/pid"
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
      detach "$STATE/pid" bun --env-file .env.local --preload ./instrument.server.mjs \
        ./node_modules/.bin/vite dev --port "$port" --strictPort --host 127.0.0.1 \
        >"$STATE/server.log" 2>&1 &
      ;;
    spa | ssr)
      local script=build
      [[ "$mode" == ssr ]] && script=build:ssr
      bun run "$script" >"$STATE/build.log" 2>&1 || die "bun run $script failed; see $STATE/build.log"
      bun run check:bundle >>"$STATE/build.log" 2>&1 || die "check:bundle failed; see $STATE/build.log"
      detach "$STATE/pid" bun --preload ./instrument.server.mjs ./node_modules/.bin/srvx --prod \
        --port "$port" --host 127.0.0.1 --static ../client dist/server/server.js \
        >"$STATE/server.log" 2>&1 &
      ;;
    ssg)
      bun run build:ssg >"$STATE/build.log" 2>&1 || die "bun run build:ssg failed; see $STATE/build.log"
      bun run check:bundle >>"$STATE/build.log" 2>&1 || die "check:bundle failed; see $STATE/build.log"
      # SSG deploys dist/client as plain static files, so serve only that directory.
      detach "$STATE/pid" ./node_modules/.bin/srvx --prod --port "$port" --host 127.0.0.1 \
        --static dist/client >"$STATE/server.log" 2>&1 &
      ;;
    *) die "unknown mode '$mode' (dev|spa|ssr|ssg)" ;;
  esac
  for _ in $(seq 1 50); do [[ -s "$STATE/pid" ]] && break; sleep 0.1; done
  [[ -s "$STATE/pid" ]] || die "server did not record its pid; see $STATE/server.log"
  started_at "$(cat "$STATE/pid")" >"$STATE/started" || die "server exited at start; see $STATE/server.log"
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
    if kill -0 "$pid" 2>/dev/null; then
      [[ -s "$STATE/started" && "$(started_at "$pid")" == "$(cat "$STATE/started")" ]] ||
        die "pid $pid is not the server this run started (pid reused); state kept in $STATE"
      # setsid made the server its own process group; stop that group only.
      kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
      for _ in $(seq 1 10); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
      kill -KILL -- "-$pid" 2>/dev/null || true
    fi
    if [[ -f "$STATE/port" ]]; then
      local port
      port="$(cat "$STATE/port")"
      for _ in $(seq 1 10); do port_held "$port" || break; sleep 0.5; done
      port_held "$port" && die "port $port is still listening after stopping group $pid; state kept in $STATE"
    fi
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
