# Routing & i18n

All user-facing routes are scoped under `/$lang/` (e.g., `/ar-sa/`, `/en-sa/example`).

- Supported locales: `ar-sa` (Arabic, RTL — default), `en-sa` (English, LTR)
- Root `/` redirects to `/ar-sa/`
- The `$lang` route segment validates the locale and sets `document.dir` + `document.lang`

## Navigation

- Always use `useI18nNavigate()` hook — auto-prefixes current locale
- Always use `<I18nLink>` component — never TanStack Router's `<Link>` directly
- These wrappers ensure locale is preserved across navigation

## Code splitting

- TanStack Start automatically splits route components; keep `createFileRoute` and named page imports.
- Keep `beforeLoad`, locale validation, and guards eager. Keep feature imports out of `__root.tsx`.
- Use dynamic imports inside a route only for expensive optional UI or actions.
- Follow [the shared guide](../../docs/code-splitting.md); do not wrap every route in `React.lazy`.

## Translations

Bundled inline in `src/libraries/i18next/locales.ts`. Namespaces registered in `src/libraries/i18next/options.ts`:

- `common` — shared strings
- `pages` — page-specific strings
- `validation` — form validation messages
