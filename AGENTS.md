# Spark — Zid TanStack Start Boilerplate

Spark is a modern frontend boilerplate for Zid, a Saudi e-commerce SaaS company.

**Stack**: TanStack Start + TanStack Router + Bun 1.4.1 + MUI v7 + @zidsa/zidmui + Emotion + TanStack Query v5 + react-hook-form + zod v4 + react-i18next + Vitest

## Commands

```bash
bun run dev                 # Dev server on http://localhost:3000
bun run build && bun run start  # Production build + serve (SPA)
bun run build:ssr && bun run start:ssr  # Production build + serve (SSR)
bun run check:bundle        # Check client chunks after either production build
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
4. No Tailwind, no custom CSS/SCSS — Emotion + MUI `sx` only
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

@.claude/rules/code-style.md
@.claude/rules/architecture.md
@.claude/rules/routing.md
@.claude/rules/backend.md
@.claude/rules/environment.md
