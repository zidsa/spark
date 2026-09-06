# Data Flow & Backend

```
Component → react-query-kit hook → API resource → mainKyClient → Hermod proxy → Backend
```

## API (`~/api/`)

- Wraps `ky` HTTP client with Zid-specific interceptors
- Base URL: `VITE_API_URL` (Hermod proxy, e.g., `https://hermod.zid.dev/`)
- Auth: Token injection via request interceptor
- Error handling: Maps HTTP errors to typed `GenericError` classes
- Retry: 1 retry with exponential backoff, 90-second timeout

## Hermod Proxy

Caddy-based reverse proxy between frontend and backend:

- CORS: Enforces allowed origins (includes `localhost:3000` for Spark dev)
- Auth: Injects `Authorization: Bearer` header upstream from env config
- Routing: `/v1/*` and `/v2/*` → extension-backend; everything else → core-backend
- Headers: Injects `X-Hermod-Proxy`, geolocation headers from Cloudflare
- Manager auth: Extracts `xManagerToken` cookie → injects as `X-Manager-Token` header

## TanStack Query Config

- `staleTime`: 180 seconds
- `retry`: 0 (retries handled at HTTP/ky layer)
- One query client per `getRouter()` call; loaders use context, UI uses `useQueryClient()`.
- Query keys include response-affecting inputs such as locale. The example resource validates JSON with Zod.
- The demo uses a local fetch adapter through the real query/resource path, including SSR/SSG.
- Pass an explicit `accept-language` for server requests. Browser storage auth is skipped on the server; authenticated SSR requires explicit request-scoped credentials.
