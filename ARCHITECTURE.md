# Architecture

## Research Decisions

### i18n: react-i18next (chosen) vs paraglide-js

**Chosen: react-i18next**

- Matches the existing Zid ecosystem (hermes, websites-boilerplate)
- Proven with Arabic RTL support and TanStack Start SSR
- Framework-agnostic, works client-side and server-side
- Large ecosystem: plugins for HTTP backend, language detection, etc.
- paraglide-js offers better tree-shaking but would diverge from the Zid ecosystem

### Validation: zod (chosen) vs yup

**Chosen: zod v4**

- Superior TypeScript type inference (infers types from schemas)
- Already installed in TanStack Start boilerplate
- TanStack Form has native zod adapter support
- Smaller bundle size than yup
- Hermes uses yup (legacy), but zod is the modern standard

### Query Factory: react-query-kit (chosen)

- Hermes uses react-query-kit v3 with TanStack Query v5
- Provides clean `createQuery` / `createMutation` factories
- Type-safe query key management
- Compatible with latest TanStack Query

### Testing: Vitest (chosen) vs Bun Test

**Chosen: Vitest**

- Mature ecosystem with `@testing-library` integration
- Watch mode, coverage, UI reporter
- Hermes uses the same stack
- Bun's test runner lacks rich plugin ecosystem

### Deployment: Shell script (chosen) vs wrangler.jsonc

**Chosen: cloudflare-pages-build.sh**

- More flexible for branch-based environment variables
- Handles private registry authentication
- Matches hermes deployment pattern
- wrangler.jsonc is for Workers-specific features (D1, KV)

## Key Patterns

### API HTTP Client

All API calls go through the `mainKyClient` (ky instance) configured with:

- `prefixUrl`: Hermod proxy URL (`VITE_API_URL`)
- Authentication interceptors (token injection via `beforeRequest`)
- Error handling (maps HTTP errors to typed error classes via `beforeError`)
- Token refresh handling (via `afterResponse`)
- Automatic retry (1 retry with exponential backoff)
- 90-second timeout
- Credentials included (cookies sent cross-origin)

Flow: `Component -> react-query-kit hook -> API resource -> mainKyClient -> Hermod -> Backend`

### Backend Connectivity

Frontend apps never call the backend directly. All requests go through **Hermod** (Caddy reverse proxy):

1. Frontend sends request to `VITE_API_URL` (hermod)
2. Hermod injects authorization token, CORS headers, caching
3. Hermod routes to the appropriate backend service

### Query Client

The TanStack Query client (`src/api/hooks/client.ts`) is configured with:

- `staleTime: 180_000` (3 minutes) -- reduces unnecessary refetches
- `retry: 0` -- retries are handled at the ky/HTTP layer, not the query layer

### RTL Support

RTL is handled at the Emotion CSS-in-JS level:

1. `ClientCacheProvider` reads the current language direction from i18next
2. Creates an Emotion cache with `stylis-plugin-rtl` for Arabic (`dir === 'rtl'`)
3. MUI components automatically flip layout (margins, paddings, text alignment)
4. The `<html dir>` and `<html lang>` attributes are set dynamically by the `$lang` route layout

When the language changes, the Emotion cache is recreated with the correct stylis plugins, triggering a full re-render of styled components with correct directionality.

### Module Structure

Feature code is organized into self-contained modules under `src/modules/`:

- `components/` -- UI components specific to the feature
- `hooks/` -- Custom hooks (data fetching, business logic)
- `pages/` -- Page-level components used by routes
- `schemas/` -- Zod validation schemas
- `types/` -- TypeScript type definitions

Shared code lives in `src/global/` (components, hooks, utils).

Routes in `src/routes/$lang/` are thin wrappers that import page components from their respective module.

### Theme System

The MUI theme is configured in `src/zidmui/libraries/mui/theme/parcel/`:

- Light mode (default) and dark mode palettes
- Zid brand colors (primary `#AE72FF`, secondary `#3C1C54`)
- IBM Plex Sans Arabic typography (imported from `@zidsa/zidmui`)
- Component overrides from `@zidsa/zidmui`
- Custom shape with `borderRadius: 8` and `standardBorderRadius: 12`

### Provider Stack

The root layout (`src/routes/__root.tsx`) composes providers in this order:

1. `I18nextProvider` -- i18n context
2. `ClientCacheProvider` -- Emotion cache (RTL-aware)
3. `ThemeProvider` -- MUI theme
4. `CssBaseline` -- MUI CSS reset
5. `PostHogProvider` -- Analytics
6. `TanStackQueryProvider` -- React Query client + devtools

### i18n Route Architecture

The locale is embedded in the URL as a route parameter (`$lang`):

- `/` redirects to `/$lang` using the default locale (`ar-sa`)
- The `$lang` route layout validates the locale and redirects to the default if unsupported
- On mount and language change, it syncs `i18n.language`, `document.dir`, and `document.lang`
- All child routes inherit the validated locale context
