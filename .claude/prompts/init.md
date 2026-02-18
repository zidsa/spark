# Project: Zid-Compatible TanStack Start Boilerplate

## Agent Instructions
**CRITICAL**: The main agent must NOT execute any tool calls directly. For ALL file 
reads, writes, terminal commands, or any other tool operations, the main agent MUST 
spawn dedicated subagents. This preserves context for the plan-then-execute workflow.

---

## Context
Zid is a Saudi e-commerce SaaS company. We are creating a modernized frontend app 
boilerplate to replace our outdated Remix-based `websites-boilerplate`.

**Target Stack**: TanStack Start + TanStack Router + Bun runtime

**Current Directory**: This is the new boilerplate repo (already initialized with base TanStack Start)

---

## Reference Repositories

| Repository | Path | Purpose |
|------------|------|---------|
| websites-boilerplate | `/Users/yazan/Desktop/zid/websites-boilerplate` | Legacy boilerplate (outdated, reference only) |
| hermes | `/Users/yazan/Desktop/zid/hermes` | Active merchant dashboard (current patterns) |
| hermod | `/Users/yazan/Desktop/zid/hermod` | Caddy proxy (backend connectivity) |
| backend | `/Users/yazan/Desktop/zid/backend` | Backend services (understand API structure) |

### Mandatory Reading Before Any Work
1. `CLAUDE.md` in both hermes and websites-boilerplate
2. `.claude/rules` directory files in hermes
3. `.eslintrc.*` config in hermes
4. `.prettierrc.*` config in hermes
5. `lefthook.yml` in hermes
6. `commitlint.config.*` in hermes
7. Hermod's Caddyfile or proxy configuration
8. How hermes connects to hermod (look for proxy config, API base URLs)
9. How hermod connects to backend (look for proxy config, API base URLs)

---

## Technology Stack (Final Decisions)

| Category | Choice | Version | Notes |
|----------|--------|---------|-------|
| Runtime | Bun | 1.3.9 | Verified compatible with TanStack Start |
| Meta-framework | TanStack Start | latest | |
| Router | TanStack Router | latest | Comes with TanStack Start |
| UI Library | @zidsa/zidmui | latest | Public npm package |
| HTTP Client | Internal ky wrapper | N/A | Port `zidderJs` pattern from hermes |
| State Management | TanStack Query | latest | |
| Forms | react-hook-form | latest | |
| Styling | Emotion / styled | N/A | MUI's styling solution |
| Package Manager | bun | 1.3.9 | NOT pnpm |
| MUI | 7.3.5 | Verify @zidsa/zidmui compatibility |
| TypeScript | latest stable | |

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
- Port the `useI18nNavigate` pattern from hermes/websites-boilerplate
- Port the `I18nLink` component pattern

### 3. Styling Rules
- **NO Tailwind CSS** — remove completely if present (check `/Users/yazan/Desktop/zid/README.md` on how to remove)
- **NO custom SCSS/CSS files**
- Use only Emotion `styled` or MUI's `sx` prop
- Colors MUST come from `theme.palette.*` only
- Port Zid brand theme from hermes (purple primary, dark purple secondary)
- Dark mode theme nativly supported in the boilerplate

### 4. Backend Connectivity
- All API calls route through hermod (Caddy proxy)
- Investigate hermod configuration to understand:
  - How frontend apps connect
  - What proxy paths are used
  - How to configure for new projects
- Update hermod config to support this new boilerplate project

### 5. Directory Structure
Match the module organization from hermes. Adapt to tanstack-router.

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
- Extract exact configuration from hermes
- Must include:
  - No relative imports (use `~/*` alias)
  - No direct `useNavigate` (must use i18n-aware hook)
  - Import ordering rules
  - Max file length warning (300 lines)
  - No console statements (error level)

### Prettier
- Extract exact configuration from hermes

### Commitlint
- Conventional commits format
- Extract rules from hermes

### Lefthook
- **ONLY** for commitlint (commit-msg hook)
- **NO** pre-commit linting hooks (linting moves to CI)

### Taskfile
- Adapt Taskfile from hermes for bun + TanStack Start
- Common tasks: install, dev, build, lint, typecheck, test, doctor

### GitHub Actions
Create a PR merge-blocking workflow that runs:
- ESLint
- TypeScript type checking
- Prettier check (not fix)
- Tests
- npx -y react-doctor@latest .

---

## Deployment

### Target: Cloudflare Pages

### Configuration Approach
Evaluate whether to use `wrangler.jsonc` instead of the legacy `cloudflare-pages-build.sh` 
script from hermes. If wrangler.jsonc is viable for TanStack Start + Bun, use it. 
If not, document why and adapt the shell script.

### Branch-Based Environments
- `master` → production
- `develop` → testing/staging
- Feature branches → preview deployments via cloudflare pages

---

## Decisions Requiring Research

For each of the following, research the current state, evaluate alternatives, and make 
a recommendation with justification. Document your reasoning in an `ARCHITECTURE.md` file.

### 1. i18n Library
- Current: hermes uses react-i18next
- Alternative: paraglide-js
- Evaluate for: TanStack Start SSR compatibility, Arabic RTL support, bundle size, DX
- Recommend one with justification

### 2. Validation Library
- Current: hermes uses yup
- Alternative: zod
- Evaluate for: TypeScript inference, bundle size, ecosystem support, migration effort
- Recommend one with justification

### 3. Query Builder
- Current: hermes uses react-query-kit
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