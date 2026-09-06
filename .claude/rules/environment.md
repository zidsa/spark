# Environment & CI

## Environment Variables

| Variable             | Required | Description                                |
| -------------------- | -------- | ------------------------------------------ |
| `VITE_ENVIRONMENT`   | Yes      | Environment identifier (e.g., `dev-spark`) |
| `VITE_API_URL`       | Yes      | Hermod proxy URL                           |
| `VITE_ASSETS_DOMAIN` | Yes      | R2 CDN for static assets                   |
| `VITE_SENTRY_DSN`    | No       | Sentry error tracking DSN                  |
| `VITE_POSTHOG_KEY`   | No       | PostHog analytics key                      |

Copy `.env.example` to `.env.local` for local development.

## Testing

- Vitest with jsdom environment
- Setup file: `__tests__/setup.ts`
- Testing Library (React + DOM) + MSW for API mocking
- Tests in `__tests__/` at project root

## PR Checks (`.github/workflows/pr-checks.yml`)

Runs on PRs to `master`/`develop`: ESLint, Prettier, TypeScript, Vitest, React Doctor.

Run `bun run doctor` locally for the same full-scan gate as CI: score 100,
zero findings, and a complete report with no skipped checks. Missing or invalid
reports fail. The official `millionco/react-doctor@v2` action also posts PR diagnostics.
React Doctor intentionally uses `latest`; upstream rule changes may require fixes.

`doctor.config.json` uses the defaults without file or rule exclusions. Preserve
the generated route tree's suppressions and the line-specific `no-console` exception
for the missing-Sentry startup warning. Fix findings instead of widening exclusions.

Both SPA and SSR builds run `bun run check:bundle`, which rejects client JavaScript chunks
over 500 kB (minified, before gzip). Check the built artifacts; do not increase the limit.
See [code splitting](../../docs/code-splitting.md) for the development and review workflow.

## Deployment

Cloudflare Pages uses `wrangler.jsonc` for project name, output directory,
compatibility settings and build variables. Bun is pinned with `BUN_VERSION`;
keep it aligned with `.bun-version` and `package.json`.

Set the Pages build command to `bun install --frozen-lockfile && bun run build`.
`SKIP_DEPENDENCY_INSTALL=1` disables the automatic install. TanStack creates
`dist/client/index.html`; Pages supplies SPA fallback without `_redirects`.

Put non-secret app variables and bindings in Wrangler. Keep credentials in Pages
secrets. Only `env.production` and `env.preview` are supported; `develop` shares
preview configuration with feature branches. Git integration, build command,
root directory, build system version, branch/watch controls, caching, comments
and domains remain Pages project settings. See `README.md` for migration steps.
