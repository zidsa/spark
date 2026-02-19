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

## Deployment

Cloudflare Pages via `cloudflare-pages-build.sh` with branch-based env injection.
