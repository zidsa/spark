# Code Style

## Imports

- Absolute imports with `~/` prefix: `import { Foo } from '~/modules/foo/components/foo'`
- Never use relative imports (`../`, `./`)
- Never use barrel file re-exports — import directly from the source file
- Import order (enforced by ESLint):
  1. External packages (`react`, `@mui/*`, `@tanstack/*`)
  2. `@zidsa/*` and `@mui/*` packages
  3. Internal absolute imports (`~/modules/*`, `~/global/*`, `~/api/*`)

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
- No custom CSS/SCSS files — use Emotion via MUI
- Use `Box` instead of raw `div`/`span`

## TypeScript

- Strict mode — no `any` without justification
- `verbatimModuleSyntax` enabled — use `import type` for type-only imports
- All unused variables/parameters are errors

## Commits

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `perf:`, `ci:`
- Commitlint on commit-msg hook via lefthook
