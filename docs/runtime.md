# Runtime, data, and localized navigation

## Ownership

`getRouter()` in `src/router.tsx` creates a query cache and an i18next instance.
Neither is shared between routers. The browser retains its router across navigation;
SSR creates a router per request, and SSG creates one per prerendered page.

`AppProviders` receives those instances and composes the providers used by both the
app and tests. Tests create their runtime before rendering, so rerendering does not
replace the cache. Static translations and theme options can be shared; mutable
instances cannot.

Use `context.queryClient` in loaders and `useQueryClient()` in React. Keep the
three-minute stale time and disable query retries because Ky owns HTTP retries.
The installed TanStack SSR Query integration transfers loaded data to the browser
and cleans up the server query cache after rendering.

## Locale and direction

The `$lang` route validates the URL and changes its own runtime's language on an
actual load. Preloading another locale must not change the visible page's language.
The root shell derives HTML language and direction from the URL, including on the
server. SPA also synchronizes those attributes after hydration because every locale
shares one static shell. The Emotion provider updates the theme and styling cache together when
direction changes, without remounting children or discarding form state.

## Example data

The example follows one path: route loader or page query → example resource →
shared Ky behavior → local fetch adapter. The query key includes locale, and the
resource validates unknown JSON with Zod before exposing items to the page.
The loader and page use the same query definition, so server data can hydrate into
the browser cache without a duplicate request.

The local adapter lives in `src/api/resources/example.ts` and serves fixtures for
`GET /v1/example/` only. The `.invalid` URL identifies a demo; no request goes to
Hermod. Tests change the transport response while retaining the real query and
resource. There is no second mock query or unimplemented detail query.

To replace the demo with a real feature, establish its backend response contract,
update its schema, and use the shared HTTP transport instead of the fixture adapter.
Do not send the example path to production. The example form demonstrates validation
only; it does not create or update anything.

The HTTP client respects explicit `accept-language` headers. Browser requests can
derive a default from the URL and use browser storage for manager authentication.
Server calls must pass their locale explicitly; browser storage and reload actions
are skipped there. Authenticated SSR needs request-scoped credentials and must never
put a manager token in a global client or in prerendered public HTML.

## Localized navigation

`I18nLink` and `useI18nNavigate` expose TanStack's native functions bound to `/$lang`.
Use them inside localized routes. The router inherits the current `lang` parameter;
there is no URL string concatenation. Destinations use registered route templates:

```tsx
<I18nLink to="/$lang/example" hash="items">Example</I18nLink>
<I18nLink to="/$lang" params={{ lang: 'en-sa' }}>English</I18nLink>

const navigate = useI18nNavigate();
void navigate({ to: '/$lang/example', replace: true });
```

Route parameters, search, hash, preloading, active state, refs, and accessibility
props retain the native types. When adding a route such as `/$lang/orders/$id`,
the caller must supply its new `id`; inheriting locale does not hide other inputs.
Use a normal anchor for external destinations.

## Rendering modes

| Mode         | Build               | Deployment                                                         |
| ------------ | ------------------- | ------------------------------------------------------------------ |
| SPA, default | `bun run build`     | Static `dist/client`; Pages supplies the shell fallback            |
| SSR          | `bun run build:ssr` | Serve the server output and static assets with `bun run start:ssr` |
| SSG          | `bun run build:ssg` | Static `dist/client`; rendering happens only during the build      |

`vite.config.ts` enables prerendering only in `ssg` mode. It seeds both localized
home pages and follows their links to the example pages. Add explicit paths for
other dynamic routes that cannot be discovered. SPA and SSG need no deployed
application server or Worker. An SSR-capable deployment is a separate hosting choice.

## Verification

Run `bun run tscheck`, `bun run test`, lint and formatting checks. Runtime tests
cover cache and locale isolation, preloading, and retained state on direction
changes. Navigation type checks live under `__tests__/types/`; TypeScript checks
them without executing their sample navigation expressions.

Build all three modes and run `bun run check:bundle` after each. Check static
hosting for SPA deep links and generated SSG pages. In SSR and SSG, inspect the
initial HTML for the correct locale, direction, and example items, then verify
hydration and navigation in a browser. CI builds each mode and checks the 500 kB
client chunk limit plus the expected static outputs.
