# Architecture

## Project Structure

```
src/
├── routes/                 # TanStack Router file-based routes
│   ├── __root.tsx          # Root layout (all providers)
│   ├── index.tsx           # / → redirect to /$lang/
│   └── $lang/              # Language-scoped routes
├── modules/                # Feature modules (self-contained)
│   └── <module>/
│       ├── components/     # Module UI components
│       ├── hooks/          # Module logic hooks
│       ├── pages/          # Page components used by routes
│       ├── schemas/        # Zod validation schemas
│       └── types/          # TypeScript types
├── global/                 # Shared across all modules
│   ├── components/         # I18nLink, PageContainer, etc.
│   ├── hooks/              # useI18nNavigate, etc.
│   └── utils/              # Shared utilities
├── api/                    # HTTP client (ky wrapper)
│   ├── client/             # mainKyClient + interceptors
│   ├── errors/             # Typed error classes
│   ├── hooks/              # react-query-kit query/mutation hooks
│   ├── resources/          # API endpoint definitions
│   ├── types/              # Request/response types
│   └── utils/              # HTTP utilities
├── ui/                     # MUI theme + Emotion RTL
├── libraries/              # Third-party integration configs (i18next)
├── integrations/           # Analytics/monitoring providers
├── router.tsx              # Router instance
├── routeTree.gen.ts        # Auto-generated (do NOT edit)
└── types/                  # Global type definitions
```

## Provider Stack (in `global/components/root-component.tsx`)

```
I18nextProvider → EmotionCacheProvider → MUI ThemeProvider → CssBaseline → PostHogProvider → QueryClientProvider
```

Emotion cache is recreated on language change to swap RTL/LTR stylis plugins.

PostHog's provider renders immediately and loads its SDK after client mount only when configured.
Use `usePostHog` from `~/integrations/posthog/provider`; it returns `undefined` until ready.
Keep app providers eager and optional SDK work asynchronous; see [code splitting](../../docs/code-splitting.md).

## Rendering Modes

**SPA Mode (default)** — static shell, client renders everything:

- `bun run build` enables SPA mode and disables SSR on the root route.
- `bun run start` serves the built app and static assets with srvx on Bun.
- Deploy `dist/client` with `/index.html` as the SPA fallback (automatic on Cloudflare Pages).

**SSR Mode** — server renders full HTML per request:

- `bun run build:ssr` selects Vite's `ssr` mode, disables SPA mode and enables root SSR.
- `bun run start:ssr` serves the built app and static assets with srvx on Bun.

**SSG (Static Prerendering)** — HTML generated at build time:

- In `vite.config.ts`, keep the SPA setting and add `prerender: { enabled: mode === 'ssr' }`
  plus `pages: [{ path: '/ar-sa/' }, { path: '/en-sa/' }]` to `tanstackStart()`.
- Run `bun run build:ssr` and deploy `dist/client`; this mode enables root SSR for prerendering.
- List desired localized URLs in `pages` because automatic discovery cannot fill `$lang`.
  Prerendering follows links by default; it is configured in the plugin, not route options.
- `bun run build` remains the default SPA build. See the README for the full recipe.

**Per-route Selective SSR** — fine-grained control:

- Any route can set `ssr: false` or `ssr: 'data-only'` in its route options
- Children inherit parent SSR setting (can only become more restrictive)
- Use `pendingComponent` for the server-side fallback when `ssr: false`

Hermes uses React Router v7 — adapt patterns to TanStack Start when porting.
