# Project: Zid-Compatible TanStack Start Boilerplate

## Agent Instructions

Use judgment — simple, direct tasks don't need a subagent.

---

## Context

Zid is a Saudi e-commerce SaaS company. We are creating a modernized frontend app
boilerplate to replace our outdated Remix-based `websites-boilerplate`.

**Target Stack**: TanStack Start + TanStack Router + Bun runtime

**Current Directory**: This is the new boilerplate repo (already initialized with base TanStack Start)

---

## Reference Repositories

| Repository           | Path                                            | Purpose                                       |
| -------------------- | ----------------------------------------------- | --------------------------------------------- |
| websites-boilerplate | `/Users/yazan/Desktop/zid/websites-boilerplate` | Legacy boilerplate (outdated, reference only) |
| merchant-dashboard   | `/Users/yazan/Desktop/zid/merchant-dashboard`   | Active merchant dashboard (current patterns)  |
| hermod               | `/Users/yazan/Desktop/zid/hermod`               | Caddy proxy (backend connectivity)            |
| backend              | `/Users/yazan/Desktop/zid/backend`              | Backend services (understand API structure)   |

### Mandatory Reading Before Any Work

1. `CLAUDE.md` in both merchant-dashboard and websites-boilerplate
2. `.claude/rules` directory files in merchant-dashboard
3. `.eslintrc.*` config in merchant-dashboard
4. `.prettierrc.*` config in merchant-dashboard
5. `lefthook.yml` in merchant-dashboard
6. `commitlint.config.*` in merchant-dashboard
7. Hermod's Caddyfile or proxy configuration
8. How merchant-dashboard connects to hermod (look for proxy config, API base URLs)
9. How hermod connects to backend (look for proxy config, API base URLs)

---

## Technology Stack (Final Decisions)

| Category         | Choice              | Version                            | Notes                                      |
| ---------------- | ------------------- | ---------------------------------- | ------------------------------------------ |
| Runtime          | Bun                 | 1.4.1                              | Verified compatible with TanStack Start    |
| Meta-framework   | TanStack Start      | latest                             |                                            |
| Router           | TanStack Router     | latest                             | Comes with TanStack Start                  |
| UI Library       | @zidsa/zidmui       | latest                             | Public npm package                         |
| HTTP Client      | Internal ky wrapper | N/A                                | Port `api` pattern from merchant-dashboard |
| State Management | TanStack Query      | latest                             |                                            |
| Forms            | react-hook-form     | latest                             |                                            |
| Styling          | Emotion / styled    | N/A                                | MUI's styling solution                     |
| Package Manager  | bun                 | 1.4.1                              | NOT pnpm                                   |
| MUI              | 7.3.5               | Verify @zidsa/zidmui compatibility |
| TypeScript       | latest stable       |                                    |

---

## Architecture Requirements

### 1. Rendering Modes

The boilerplate MUST support all three modes via configuration:

- **SSR** (Server-Side Rendering) — default for SEO pages
- **SSG** (Static Site Generation) — for static content
- **SPA** (Single Page Application) — for authenticated dashboards (default)

Document how to configure each mode in the README.

### 2. Internationalization (Arabic-First)

- Default language: Arabic (ar)
- Supported: Arabic (ar), English (en)
- URL structure: `/:lang/path` (e.g., `/ar-sa/home`, `/en-sa/home`)
- Full RTL support using Emotion + stylis-plugin-rtl
- Port the `useI18nNavigate` pattern from merchant-dashboard/websites-boilerplate
- Port the `I18nLink` component pattern

### 3. Styling Rules

- **NO Tailwind CSS** — remove completely if present (check `/Users/yazan/Desktop/zid/README.md` on how to remove)
- **NO custom SCSS/CSS files**
- Use only Emotion `styled` or MUI's `sx` prop
- Colors MUST come from `theme.palette.*` only
- Port Zid brand theme from merchant-dashboard (purple primary, dark purple secondary)
- Dark mode theme nativly supported in the boilerplate

### 4. Backend Connectivity

- All API calls route through hermod (Caddy proxy)
- Investigate hermod configuration to understand:
  - How frontend apps connect
  - What proxy paths are used
  - How to configure for new projects
- Update hermod config to support this new boilerplate project

### 5. Directory Structure

Match the module organization from merchant-dashboard. Adapt to tanstack-router.

### 6. Authentication

Out of scope. Authentication is handled by the backend. Do not implement auth logic.

---

## Environment Variables

Create `.env.example` with:

```
VITE_ENVIRONMENT=dev-YOUR_NAME_ID

#
# Testing env
VITE_API_URL=https://hermod.zid.dev/
VITE_ASSETS_DOMAIN=https://pub-c3284fa51357406ca9a56ec1740ae4c0.r2.dev

#
# Production env
# VITE_API_URL=https://hermod.zid.sa/
# VITE_ASSETS_DOMAIN=https://static.zid.store
```

---

## Code Quality Configuration

### ESLint

- Extract exact configuration from merchant-dashboard
- Must include:
  - No relative imports (use `~/*` alias)
  - No direct `useNavigate` (must use i18n-aware hook)
  - Import ordering rules
  - Max file length warning (300 lines)
  - No console statements (error level)

### Prettier

- Extract exact configuration from merchant-dashboard

### Commitlint

- Conventional commits format
- Extract rules from merchant-dashboard

### Lefthook

- **ONLY** for commitlint (commit-msg hook)
- **NO** pre-commit linting hooks (linting moves to CI)

### Taskfile

- Adapt Taskfile from merchant-dashboard for bun + TanStack Start
- Common tasks: install, dev, build, lint, typecheck, test, doctor

### GitHub Actions

Create a PR merge-blocking workflow that runs:

- ESLint
- TypeScript type checking
- Prettier check (not fix)
- Tests
- bunx -y react-doctor@latest .

---

## Deployment

### Target: Cloudflare Pages

### Configuration Approach

Use `wrangler.jsonc` for Pages project name, output directory, compatibility
settings, non-secret variables and bindings. Pin Bun through `BUN_VERSION` and
set `SKIP_DEPENDENCY_INSTALL=1`. Keep credentials in Pages secrets.
Set the Pages build command to `bun install --frozen-lockfile && bun run build`.
Generate `dist/client/index.html` through TanStack's SPA prerender settings and
use Pages' automatic SPA fallback. See `README.md` for dashboard-only settings.

### Branch-Based Environments

- `master` → production
- `develop` and feature branches → Pages preview environment
- Separate staging settings require a separate Pages project or explicit build-time logic

---

## Decisions Requiring Research

For each of the following, research the current state, evaluate alternatives, and make
a recommendation with justification. Document your reasoning in an `ARCHITECTURE.md` file.

### 1. i18n Library

- Current: merchant-dashboard uses react-i18next
- Alternative: paraglide-js
- Evaluate for: TanStack Start SSR compatibility, Arabic RTL support, bundle size, DX
- Recommend one with justification

### 2. Validation Library

- Current: merchant-dashboard uses yup
- Alternative: zod
- Evaluate for: TypeScript inference, bundle size, ecosystem support, migration effort
- Recommend one with justification

### 3. Query Builder

- Current: merchant-dashboard uses react-query-kit
- Verify compatibility with latest TanStack Query
- If deprecated or problematic, recommend alternative

### 4. Testing Infrastructure

- Research testing approaches for TanStack Start + Bun
- Evaluate: Vitest vs Bun's native test runner
- Evaluate: Testing Library, MSW for API mocking
- Set up chosen infrastructure with example tests
- Include: unit test example, component test example, integration test example

---

## Deliverables

1. **Fully configured TanStack Start project** in this repo
2. **README.md** with:
   - Setup instructions (bun install, env setup)
   - Available scripts (dev, build, lint, typecheck, test)
   - Rendering mode configuration
   - Deployment instructions
3. **ARCHITECTURE.md** documenting:
   - Research findings and decisions made
   - Directory structure explanation
   - Key patterns (i18n, RTL, data fetching)
4. **Example route** demonstrating:
   - i18n with language switching
   - RTL support
   - Data fetching with TanStack Query
   - Form with validation
5. **Test examples**:
   - Unit test
   - Component test
   - Integration test
6. **GitHub Actions workflow** (`.github/workflows/pr-checks.yml`)
7. **Updated hermod configuration** to support this project

---

## Verification Checklist

Before marking complete, verify:

- [ ] `bun install` succeeds
- [ ] `bun run dev` starts without errors
- [ ] Arabic (RTL) renders correctly
- [ ] English (LTR) renders correctly
- [ ] Language switching works
- [ ] Route navigation preserves language
- [ ] API call through hermod works (if hermod is running)
- [ ] Build succeeds for all rendering modes
- [ ] ESLint passes
- [ ] TypeScript compiles without errors
- [ ] Tests pass
- [ ] Commitlint validates commit messages
