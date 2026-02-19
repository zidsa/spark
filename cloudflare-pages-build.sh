#!/bin/bash
set -euo pipefail

echo "==> Branch: $CF_PAGES_BRANCH"
echo "==> Building spark..."

# Install bun if not present
if ! command -v bun &> /dev/null; then
  echo "==> Installing bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Install dependencies
bun install --frozen-lockfile

# Build
bun run build

echo "==> Build complete!"
