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

## Provider Stack (in `__root.tsx`)

```
I18nextProvider → EmotionCacheProvider → MUI ThemeProvider → CssBaseline → PostHogProvider → QueryClientProvider
```

Emotion cache is recreated on language change to swap RTL/LTR stylis plugins.

## Rendering Modes

**SPA Mode (default)** — static shell, client renders everything:

- `bun run build` enables SPA mode and disables SSR on the root route.
- `bun run start` serves the built app and static assets with srvx on Bun.
- Deploy `dist/client` with `/index.html` as the SPA fallback (automatic on Cloudflare Pages).

**SSR Mode** — server renders full HTML per request:

- `bun run build:ssr` selects Vite's `ssr` mode, disables SPA mode and enables root SSR.
- `bun run start:ssr` serves the built app and static assets with srvx on Bun.

**SSG (Static Prerendering)** — HTML generated at build time:

- `vite.config.ts`: add `prerender: { enabled: true }` to `tanstackStart()`
- Individual routes opt in with `prerender: true` in route options

**Per-route Selective SSR** — fine-grained control:

- Any route can set `ssr: false` or `ssr: 'data-only'` in its route options
- Children inherit parent SSR setting (can only become more restrictive)
- Use `pendingComponent` for the server-side fallback when `ssr: false`

Hermes uses React Router v7 — adapt patterns to TanStack Start when porting.
