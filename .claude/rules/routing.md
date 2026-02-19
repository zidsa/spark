# Routing & i18n

All user-facing routes are scoped under `/$lang/` (e.g., `/ar-sa/`, `/en-sa/example`).

- Supported locales: `ar-sa` (Arabic, RTL — default), `en-sa` (English, LTR)
- Root `/` redirects to `/ar-sa/`
- The `$lang` route segment validates the locale and sets `document.dir` + `document.lang`

## Navigation

- Always use `useI18nNavigate()` hook — auto-prefixes current locale
- Always use `<I18nLink>` component — never TanStack Router's `<Link>` directly
- These wrappers ensure locale is preserved across navigation

## Translation Files

Located at `public/locales/{locale}/{namespace}.json`:
- `common.json` — shared strings
- `pages.json` — page-specific strings
- `validation.json` — form validation messages
