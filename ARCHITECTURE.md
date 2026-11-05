# Architecture

## Research Decisions

### i18n: react-i18next (chosen) vs paraglide-js

**Chosen: react-i18next**

- Matches the existing Zid ecosystem (merchant-dashboard, websites-boilerplate)
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
- Merchant Dashboard uses yup (legacy), but zod is the modern standard

### Query Factory: react-query-kit (chosen)

- Merchant Dashboard uses react-query-kit v3 with TanStack Query v5
- Provides clean `createQuery` / `createMutation` factories
- Type-safe query key management
- Compatible with latest TanStack Query

### Testing: Vitest (chosen) vs Bun Test

**Chosen: Vitest**

- Mature ecosystem with `@testing-library` integration
- Watch mode, coverage, UI reporter
- Merchant Dashboard uses the same stack
- Bun's test runner lacks rich plugin ecosystem

### Deployment: wrangler.jsonc

**Chosen: Cloudflare Pages with `wrangler.jsonc`**

- Pages supports Wrangler configuration, including output directory, compatibility settings, variables and bindings.
- Bun's version and the dependency-install policy live in the repository.
- TanStack generates `index.html`; Pages provides SPA fallback without a redirect file.
- The build command remains a Pages project setting: `bun install --frozen-lockfile && bun run build`.
- Git integration, branch controls, build image/caching and domains remain Pages project settings.
- Pages has production and preview environments; `develop` shares preview configuration with feature branches.
- Private package credentials remain secrets. See `README.md` for migration and new-project setup.

## Key Patterns

### API HTTP Client

All API calls go through the `mainKyClient` (ky instance) configured with:

- `prefix`: Hermod proxy URL (`VITE_API_URL`)
- Authentication interceptors (token injection via `beforeRequest`)
- Error handling (maps HTTP errors to typed error classes via `beforeError`)
- Login-token capture (via `afterResponse`; this is not a refresh-token flow)
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

Each `getRouter()` call owns a fresh TanStack Query client and i18next instance. The client uses:

- `staleTime: 180_000` (3 minutes) -- reduces unnecessary refetches
- `retry: 0` -- retries are handled at the ky/HTTP layer, not the query layer

Routes use `context.queryClient`; rendered code uses `useQueryClient()`. The installed TanStack
SSR Query integration transfers query data to the browser. See [runtime and data flow](docs/runtime.md).

### RTL Support

RTL is handled at the Emotion CSS-in-JS level:

1. `ClientCacheProvider` reads the current language direction from i18next
2. Creates an Emotion cache with `stylis-plugin-rtl` for Arabic (`dir === 'rtl'`)
3. The same provider creates the MUI theme with that direction.
4. The root shell derives `<html dir>` and `<html lang>` from the URL, on server and client.

When direction changes, theme and Emotion cache change in the same render without remounting the app.

### Module Structure

Feature code is organized into self-contained modules under `src/modules/`. Create only the folders a module needs:

- `components/` -- UI components specific to the feature
- `hooks/` -- Custom hooks (data fetching, business logic)
- `pages/` -- Page-level components used by routes
- `schemas/` -- Zod validation schemas
- `types/` -- TypeScript type definitions

Shared code lives in `src/global/` (components, hooks, utils).

Routes in `src/routes/$lang/` are thin wrappers that import page components from their respective module.

### Theme System

The MUI theme is configured in `src/ui/libraries/theme/parcel/`:

- Light palette from `@zidsa/zidmui` (no dark mode)
- Zid brand colors (primary `#AE72FF`, secondary `#3C1C54`)
- IBM Plex Sans Arabic typography (imported from `@zidsa/zidmui`)
- Component overrides from `@zidsa/zidmui`
- Custom shape with `borderRadius: 8` and `standardBorderRadius: 12`

### Provider Stack

`AppProviders` (`src/global/components/app-providers.tsx`) is shared by the app and tests:

1. `I18nextProvider` -- i18n context
2. `ClientCacheProvider` -- Emotion cache (RTL-aware)
3. `ThemeProvider` -- MUI theme
4. `CssBaseline` -- MUI CSS reset
5. `PostHogProvider` -- Analytics
6. `QueryClientProvider` -- the owning router's cache; devtools remain in the root view

### i18n Route Architecture

The locale is embedded in the URL as a route parameter (`$lang`):

- `/` redirects to `/$lang` using the default locale (`ar-sa`)
- The `$lang` route layout validates the locale and redirects to the default if unsupported
- Actual route loads change the router's i18next locale; speculative preloads do not.
- The root shell renders language and direction attributes, including in SSR and SSG.
- All child routes inherit the validated locale context

## Rendering and example data

SPA remains the default (`bun run build`). SSR uses `build:ssr`; SSG uses `build:ssg`.
SPA and SSG deploy static `dist/client` files to Cloudflare Pages. Only SSR needs a live renderer.
The example route, page, and tests share one query and a Zod-validated resource. Its local fetch
adapter keeps the demo self-contained; replacing it with Hermod requires a real backend contract.
