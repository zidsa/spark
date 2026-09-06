# Spark

Zid's TanStack Start boilerplate -- a modern, production-ready foundation for building Zid frontend applications.

## Stack

- **Runtime**: [Bun](https://bun.sh) 1.4.1
- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **UI**: [MUI v7](https://mui.com) + [@zidsa/zidmui](https://www.npmjs.com/package/@zidsa/zidmui)
- **Styling**: Emotion (CSS-in-JS) -- no Tailwind, no custom CSS
- **State**: [TanStack Query v5](https://tanstack.com/query) + [react-query-kit](https://github.com/nicktomlin/react-query-kit)
- **Forms**: [react-hook-form](https://react-hook-form.com) + [zod v4](https://zod.dev)
- **HTTP**: [ky](https://github.com/sindresorhus/ky) (API wrapper)
- **i18n**: [react-i18next](https://react.i18next.com) -- Arabic-first, RTL support
- **Testing**: [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)

MUI Material and Lab stay on their newest stable v7 releases because ZidMUI 3.3.1 requires MUI v7. All other direct dependencies use their latest published releases.

## Quick Start

```bash
# Install the pinned runtime
curl -fsSL https://bun.sh/install | bash -s "bun-v$(cat .bun-version)"

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
| `bun run build`               | Build for production (SPA)           |
| `bun run start`               | Serve production build locally       |
| `bun run build:ssr`           | Build for production (SSR)           |
| `bun run start:ssr`           | Start SSR server                     |
| `bun run test`                | Run tests                            |
| `bun run test:watch`          | Run tests in watch mode              |
| `bun run lint`                | Lint with oxlint                     |
| `bun run lint:fix`            | Lint and auto-fix                    |
| `bun run fmt`                 | Check formatting                     |
| `bun run fmt:fix`             | Fix formatting                       |
| `bun run doctor`             | Require a complete 100/100 scan       |
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
├── api/                 # HTTP client (ky wrapper)
│   ├── client/          # Main ky client + interceptors
│   ├── errors/          # Error classes
│   ├── hooks/           # react-query-kit query/mutation hooks
│   ├── resources/       # API endpoint definitions
│   ├── types/           # Request/response types
│   └── utils/           # HTTP utilities
├── ui/                  # MUI theme + Emotion
│   ├── libraries/
│   │   ├── emotion/     # Emotion cache + RTL
│   │   └── mui/         # Theme configuration
│   └── styles/          # Font declarations
├── libraries/           # Third-party library setup
│   └── i18next/         # i18n configuration
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

Spark supports three rendering modes:

**SPA (default)** — static shell, client renders everything:

- Build with `bun run build`, then serve locally with `bun run start`.
- The default build enables SPA mode and disables SSR on the root route.
- Deploy `dist/client` with `/index.html` as the SPA fallback (automatic on Cloudflare Pages).

**SSR** — server renders full HTML per request:

- Build with `bun run build:ssr`, then run `bun run start:ssr`.
- The `ssr` build mode disables SPA mode and enables SSR on the root route.
- Both start commands use srvx on Bun to serve the built app and its static assets.

**SSG** — HTML generated at build time:

- In `vite.config.ts`, keep the SPA setting and add `prerender: { enabled: mode === 'ssr' }` and `pages: [{ path: '/ar-sa/' }, { path: '/en-sa/' }]` to `tanstackStart()`.
- Run `bun run build:ssr` and deploy `dist/client`; root SSR must be enabled to generate HTML. `bun run build` remains SPA.
- List desired localized URLs in `pages` because discovery cannot fill `$lang`. Prerendering follows links by default; configure it in the plugin, not route options. See [TanStack static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).

## Creating a Module

1. Create module directory: `src/modules/your-module/`
2. Add subdirectories: `components/`, `hooks/`, `pages/`, `schemas/`, `types/`
3. Create route: `src/routes/$lang/your-route/index.tsx`
4. Add translations to `src/libraries/i18next/locales.ts`

Follow `src/modules/example/` and the [code-splitting guide](docs/code-splitting.md).
Route UI splits automatically; defer optional heavy code and run `bun run check:bundle` after building.

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

[`wrangler.jsonc`](wrangler.jsonc) is the source of truth for the project name,
output directory (`dist/client`), compatibility date/flags and build variables.
`BUN_VERSION` pins Bun to 1.4.1; keep it aligned with `.bun-version` and `package.json`.
`SKIP_DEPENDENCY_INSTALL=1` lets the build command enforce the frozen lockfile.

Set the Pages **Build command** to `bun install --frozen-lockfile && bun run build`.
TanStack emits `index.html` directly. Pages supplies SPA fallback when there is no
top-level `404.html`, so no shell script, file rename or `_redirects` is needed.

Pages does not support Wrangler's `build.command`. Git repository connection,
root directory, build system version (v3), production branch (`master`), preview
branch controls, build watch paths, build caching, build comments and custom
domains remain Pages project settings, managed through the dashboard or API.

For a repo created from Spark, set `name` to its Pages project name. Add non-secret
`VITE_*` values and resource bindings to Wrangler as needed. Keep secrets in Pages
secrets; never commit credentials. Use `env.production` and `env.preview` for
overrides, repeating all variables/bindings when overriding non-inheritable keys.
`develop` and feature branches both use preview settings; a separate staging
configuration requires a separate Pages project or explicit build-time logic.

When migrating an existing project, compare its current settings before deploying.
While older branches still need the script, use this temporary Pages build command:
`if [ -f cloudflare-pages-build.sh ]; then bash cloudflare-pages-build.sh; else bun install --frozen-lockfile && bun run build; fi`.
After migrating those branches, replace it with the build command above.

References: [Pages configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/),
[build settings](https://developers.cloudflare.com/pages/configuration/build-image/),
[SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering).
