# Spark

Zid's TanStack Start boilerplate -- a modern, production-ready foundation for building Zid frontend applications.

## Stack

- **Runtime**: [Bun](https://bun.sh) 1.3.9
- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **UI**: [MUI v7](https://mui.com) + [@zidsa/zidmui](https://www.npmjs.com/package/@zidsa/zidmui)
- **Styling**: Emotion (CSS-in-JS) -- no Tailwind, no custom CSS
- **State**: [TanStack Query v5](https://tanstack.com/query) + [react-query-kit](https://github.com/nicktomlin/react-query-kit)
- **Forms**: [react-hook-form](https://react-hook-form.com) + [zod v4](https://zod.dev)
- **HTTP**: [ky](https://github.com/sindresorhus/ky) (ZidderJS wrapper)
- **i18n**: [react-i18next](https://react.i18next.com) -- Arabic-first, RTL support
- **Testing**: [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)

## Quick Start

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env.local

# Start development server
bun run dev
```

The app starts at [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                        | Description                          |
| ----------------------------- | ------------------------------------ |
| `bun run dev`                 | Start development server (port 3000) |
| `bun run build`               | Production build                     |
| `bun run preview`             | Preview production build             |
| `bun run start`               | Start production server              |
| `bun run test`                | Run tests                            |
| `bun run test:watch`          | Run tests in watch mode              |
| `bun run lint:eslint`         | Lint with ESLint                     |
| `bun run lint:eslint-fix`     | Lint and auto-fix                    |
| `bun run lint:prettier-check` | Check formatting                     |
| `bun run lint:prettier-fix`   | Fix formatting                       |
| `bun run tscheck`             | TypeScript type checking             |

If you use [Task](https://taskfile.dev), copy `taskfile.dist.yml` to `Taskfile.yml` and use `task dev`, `task lint`, etc.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable             | Description            | Default                   |
| -------------------- | ---------------------- | ------------------------- |
| `VITE_ENVIRONMENT`   | Environment identifier | `dev-YOUR_NAME_ID`        |
| `VITE_API_URL`       | Hermod API proxy URL   | `https://hermod.zid.dev/` |
| `VITE_ASSETS_DOMAIN` | Static assets CDN      | (see .env.example)        |
| `VITE_SENTRY_DSN`    | Sentry error tracking  | (optional)                |
| `VITE_POSTHOG_KEY`   | PostHog analytics      | (optional)                |

## Directory Structure

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout (providers, theme)
│   ├── index.tsx        # / → redirects to /$lang/
│   └── $lang/           # Language-scoped routes
│       ├── route.tsx    # Language layout (validates locale, sets dir)
│       ├── index.tsx    # Home page
│       └── example/     # Example route
├── modules/             # Feature modules
│   └── example/         # Example module
│       ├── components/  # Module-specific components
│       ├── hooks/       # Module-specific hooks
│       ├── pages/       # Page components
│       ├── schemas/     # Zod validation schemas
│       └── types/       # TypeScript types
├── global/              # Shared utilities
│   ├── components/      # Shared components (I18nLink, PageContainer)
│   ├── hooks/           # Shared hooks (useI18nNavigate)
│   └── utils/           # Utility functions
├── zidderjs/            # HTTP client (ky wrapper)
│   ├── client/          # Main ky client + interceptors
│   ├── errors/          # Error classes
│   ├── resources/       # API endpoint definitions
│   ├── types/           # Request/response types
│   └── utils/           # HTTP utilities
├── zidmui/              # MUI theme + Emotion
│   ├── libraries/
│   │   ├── emotion/     # Emotion cache + RTL
│   │   └── mui/         # Theme configuration
│   └── styles/          # Font declarations
├── libraries/           # Third-party library setup
│   └── i18next/         # i18n configuration
├── services/            # react-query-kit query/mutation hooks
└── integrations/        # Analytics (PostHog, Sentry)
```

## i18n

### Language Support

- **Arabic (ar-sa)**: Default language, RTL
- **English (en-sa)**: LTR

### URL Structure

All routes are prefixed with the locale: `/{locale}/path`

- `/ar-sa/` -- Arabic home
- `/en-sa/example` -- English example page
- `/` -- Redirects to `/ar-sa/`

### Navigation

Always use the i18n-aware navigation utilities:

```tsx
// Programmatic navigation
import { useI18nNavigate } from '~/global/hooks/use-i18n-navigate';

const navigate = useI18nNavigate();
navigate('/example'); // → /ar-sa/example (auto-prefixes locale)

// Link component
import { I18nLink } from '~/global/components/i18n-link';

<I18nLink to="/example">Go to Example</I18nLink>;
```

**Never use `useNavigate` or `Link` from TanStack Router directly** -- they won't prefix the locale.

### Adding Translations

Translations are bundled inline in `src/libraries/i18next/locales.ts` (not loaded via HTTP). Add your strings directly to the `i18nResources` object under the appropriate locale and namespace:

```ts
// src/libraries/i18next/locales.ts
export const i18nResources: Resource = {
  'ar-sa': {
    common: {
      /* ... */
    },
    'your-namespace': {
      key: 'القيمة',
    },
  },
  'en-sa': {
    common: {
      /* ... */
    },
    'your-namespace': {
      key: 'Value',
    },
  },
};
```

If you add a new namespace, register it in `src/libraries/i18next/options.ts` under the `ns` array.

### Rendering Modes

Spark supports three rendering modes. Switch between them by configuring `vite.config.ts` and `src/routes/__root.tsx`:

**SPA (default)** — static shell, client renders everything:

- `vite.config.ts`: `tanstackStart({ spa: { enabled: true } })`
- `__root.tsx`: `ssr: false` on the root route
- Deploy: CDN with `/_shell.html` catch-all rewrite

**SSR** — server renders full HTML per request:

- `vite.config.ts`: remove `spa` config from `tanstackStart()`
- `__root.tsx`: remove `ssr: false` from root route
- Deploy: requires server runtime (Cloudflare Workers, Node, etc.)

**SSG** — HTML generated at build time:

- `vite.config.ts`: add `prerender: { enabled: true }` to `tanstackStart()`
- Individual routes opt in with `prerender: true` in route options

See the [TanStack Start docs](https://tanstack.com/start/latest/docs/framework/react/guide/ssr) for details.

## Creating a Module

1. Create module directory: `src/modules/your-module/`
2. Add subdirectories: `components/`, `hooks/`, `pages/`, `schemas/`, `types/`
3. Create route: `src/routes/$lang/your-route/index.tsx`
4. Add translations to `src/libraries/i18next/locales.ts`

Follow the example module in `src/modules/example/` as a reference.

## Styling Rules

- Use MUI components and `sx` prop or `styled` from `@mui/material/styles`
- Colors must come from `theme.palette.*` -- never hardcode colors
- No Tailwind CSS, no custom SCSS/CSS files
- Use `Box` instead of raw `div`/`span` for MUI theme access

## Code Conventions

- **Imports**: Absolute with `~/` prefix. No relative imports (same-folder allowed).
- **File names**: kebab-case (e.g., `example-card.tsx`)
- **Components**: PascalCase named exports. No default exports.
- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- **Max file size**: ~300 lines (warning)
- **No console.log**: Error in ESLint

## Deployment

### Cloudflare Pages

Build command: `bash cloudflare-pages-build.sh`
Output directory: `.output/public`

Branch mapping:

- `master` -- Production
- `develop` -- Staging
- Feature branches -- Preview deployments
