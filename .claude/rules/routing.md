# Routing & i18n

All user-facing routes are scoped under `/$lang/` (e.g., `/ar-sa/`, `/en-sa/example`).

- Supported locales: `ar-sa` (Arabic, RTL — default), `en-sa` (English, LTR)
- Root `/` redirects to `/ar-sa/`
- The `$lang` route validates the locale and updates its router's i18next instance on real loads.
- The root shell renders HTML language and direction on both server and client.

## Navigation

- Use `useI18nNavigate()` and `<I18nLink>` inside localized routes; both bind TanStack's native functions to `/$lang`.
- Use typed route templates: `navigate({ to: '/$lang/example' })` or `<I18nLink to="/$lang/example">`.
- The current `lang` parameter is inherited. Use `params: { lang: 'en-sa' }` to switch language.
- Params, search, hash, accessibility props, and preload options retain native typing; do not build URL strings.

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
