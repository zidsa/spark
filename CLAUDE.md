# Spark — Zid TanStack Start Boilerplate

Spark is a modern frontend boilerplate for Zid, a Saudi e-commerce SaaS company.

**Stack**: TanStack Start + TanStack Router + Bun 1.3.9 + MUI v7 + @zidsa/zidmui + Emotion + TanStack Query v5 + react-hook-form + zod v4 + react-i18next + Vitest

**CRITICAL**: The main agent must NOT execute any tool calls directly. For ALL file
reads, writes, terminal commands, Web Search, fetch or any other tool operations, the main agent MUST
spawn dedicated subagents. This preserves context for the plan-then-execute workflow.

## Commands

```bash
bun run dev                 # Dev server on http://localhost:3000
bun run build && bun start  # Production build + run
bun run lint:eslint-fix     # Auto-fix lint errors
bun run lint:prettier-fix   # Auto-fix formatting
bun run tscheck             # TypeScript type check
bun run test                # Run tests
```

## Hard Rules

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

@.claude/rules/workflow.md
@.claude/rules/code-style.md
@.claude/rules/architecture.md
@.claude/rules/routing.md
@.claude/rules/backend.md
@.claude/rules/environment.md
