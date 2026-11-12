# Spark — Zid TanStack Start Boilerplate

Spark is a modern frontend boilerplate for Zid, a Saudi e-commerce SaaS company.

**Stack**: TanStack Start + TanStack Router + Bun 1.4.4 + MUI v7 + @zidsa/zidmui + Emotion + TanStack Query v5 + react-hook-form + zod v4 + react-i18next + Vitest

## Commands

```bash
bun run dev                 # Dev server on http://localhost:3000
bun run build && bun run start  # Production build + serve (SPA)
bun run build:ssr && bun run start:ssr  # Production build + serve (SSR)
bun run build:ssg           # Prerender HTML; deploy dist/client as static files
bun run check:bundle        # Check client chunks after each production build
bun run lint:fix     # Auto-fix lint errors
bun run lint:prettier-fix   # Auto-fix formatting
bun run tscheck             # TypeScript type check
bun run test                # Run tests
```

## Hard Rules

Cloudflare Pages uses `wrangler.jsonc` for deployment settings and build variables.
The Pages build command is `bun install --frozen-lockfile && bun run build`.
The SPA build emits `dist/client/index.html`; Pages supplies the SPA fallback.
See `README.md` for project settings that cannot be stored in Wrangler.

1. `bun` only — never `npm` or `pnpm`
2. Absolute imports only (`~/`) — no relative imports
3. No barrel files — import from source directly
4. No Tailwind, no new CSS/SCSS files — Emotion + MUI `sx` only (existing global reset and font CSS excepted)
5. No hardcoded colors — `theme.palette.*` only
6. No `console.log` — use Sentry for error tracking
7. No direct `useNavigate` or `<Link>` — use `useI18nNavigate` and `<I18nLink>`
8. Named exports only — no default exports
9. Prefer `@zidsa/zidmui` components over raw `@mui/material`
10. `routeTree.gen.ts` is auto-generated — never edit manually
11. Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, etc.
12. PRs target `master` branch
13. 250 lines max per file
14. Follow [code splitting](docs/code-splitting.md): keep route splitting automatic, defer optional heavy code, and keep client chunks within 500 kB.

## Verify Before Opening a PR

Both verifications must run, and pass, before you open a PR. Skills live in
`.agents/skills/`; the `.claude/`, `.codex/`, `.cursor/` and `.hermes/` skills
folders link to the same copies.

1. **Verification skill** `verify-spark`: launch the app in the mode your
   change affects and drive every journey in its feature map that touches it.

   ```bash
   vs=.agents/skills/verify-spark/scripts
   RUN=pr $vs/spark.sh launch dev        # or ssr, spa, ssg
   RUN=pr $vs/spark.sh doctor
   RUN=pr bun $vs/drive.mjs <journey>     # home-language, example-list, example-form, locale-routing, initial-html
   RUN=pr $vs/spark.sh cleanup
   ```

2. **Formal verification skills**: `formal-starter` (locale routing and the
   example form) and `verify-manager-token` (API client token handling).

   ```bash
   .agents/skills/formal-starter/check.sh
   .agents/skills/verify-manager-token/check.sh
   ```

Pass means every journey prints `PASS` with exit 0 and both `check.sh` exit 0.
A `FINDING` line is a recorded hazard and does not fail the run. `STALE`,
`CHANGED`, `FAIL` or a non-zero exit means the code moved or a recorded
outcome changed: read that skill's SKILL.md, then fix the code or update the
skill and its record in the same PR.
@.claude/rules/code-style.md
@.claude/rules/architecture.md
@.claude/rules/routing.md
@.claude/rules/backend.md
@.claude/rules/environment.md
