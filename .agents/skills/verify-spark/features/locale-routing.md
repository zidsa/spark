# Locale routing

Every page lives under a supported locale. The root and any unsupported locale send the user to the Arabic home page, and a deep link with a supported locale opens directly.

## Sub-features

- `route-root` redirects `/` to `/ar-sa`.
- `route-unsupported` redirects `/xx-yy/example` to `/ar-sa`.
- `route-deep-link` opens `/en-sa/example` without a redirect.

## How to get to it (user POV)

- Type the URL in the address bar or open a shared link.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `OK` for this run. Use `dev`, `spa` or `ssr` for all three cases.

- **Root.** Open `/`. The path becomes `/ar-sa` with `lang="ar-sa" dir="rtl"`.
- **Unsupported locale.** Open `/xx-yy/example`. The path becomes `/ar-sa`.
- **Deep link.** Open `/en-sa/example`. The path stays `/en-sa/example` with `lang="en-sa" dir="ltr"`.
- **Proof.** Run `RUN=<id> bun .agents/skills/verify-spark/scripts/drive.mjs locale-routing`. `steps.jsonl` has one line per URL with the final URL and `<html>` attributes.

## Gotchas

- In `ssg` mode the local static server has no fallback for paths that were not prerendered. The journey logs `SKIPPED open /xx-yy/example` there. Prove that case in another mode.
- An unsupported locale goes to the Arabic home page, not to the same page in Arabic.
