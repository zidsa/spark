#!/bin/bash
set -euo pipefail

echo "==> Branch: $CF_PAGES_BRANCH"
echo "==> Building spark..."

# Install the project's Bun version if it is missing or different
if ! command -v bun &> /dev/null || [ "$(bun --version)" != "$(cat .bun-version)" ]; then
  echo "==> Installing Bun $(cat .bun-version)..."
  curl -fsSL https://bun.sh/install | bash -s "bun-v$(cat .bun-version)"
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Install dependencies
bun install --frozen-lockfile

# Build
bun run build

# Cloudflare Pages SPA setup
mv dist/client/_shell.html dist/client/index.html
echo '/* /index.html 200' > dist/client/_redirects

echo "==> Build complete!"
