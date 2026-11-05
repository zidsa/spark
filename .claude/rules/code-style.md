# Code Style

## Imports

- Absolute imports with `~/` prefix: `import { Foo } from '~/modules/foo/components/foo'`
- Never use relative imports (`../`, `./`)
- Never use barrel file re-exports — import directly from the source file
- Dynamic imports also use `~/` and source files. Adapt named exports with `.then(module => ({ default: module.Component }))` for `React.lazy`; keep the source export named.
- Import order (enforced by oxfmt, blank line between groups):
  1. External packages (`react`, `@tanstack/*`)
  2. `@zidsa/zidmui/*`
  3. `@mui/*`
  4. Internal absolute imports: `~/ui/*`, then `~/api/*`, then `~/global/*`, then other `~/*`

## Naming

- Directories: kebab-case (`order-details/`)
- Files: kebab-case (`order-details-card.tsx`)
- Components: PascalCase (`OrderDetailsCard`)
- Hooks: camelCase with `use` prefix (`useOrderDetails`)
- Types/Interfaces: PascalCase (`OrderDetailsResponse`)
- Named exports only — no default exports

## Styling

- MUI components + `sx` prop or `styled` from `@mui/material/styles`
- Colors only from `theme.palette.*` — never hardcode hex/rgb
- No Tailwind CSS — not installed, must not be added
- No new CSS/SCSS files — use Emotion via MUI (`src/styles.css` and `src/ui/styles/fonts.css` are the only global CSS)
- Use `Box` instead of raw `div`/`span`

## TypeScript

- Strict mode — no `any` without justification
- `verbatimModuleSyntax` enabled — use `import type` for type-only imports
- All unused variables/parameters are errors

## Commits

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `perf:`, `ci:`
- Commitlint on commit-msg hook via lefthook
