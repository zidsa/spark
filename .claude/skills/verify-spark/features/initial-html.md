# Initial HTML by rendering mode

Before any script runs, SSR and SSG send HTML with the page's language, direction and content, so crawlers and the first paint see the right page. SPA and dev send one shell and render after the scripts load.

## Sub-features

- `html-attrs` sends `<html lang dir>` for the URL's locale.
- `html-content` includes the page content (`Welcome to Spark`, `First Example`) in the first HTML for SSR and SSG.
- `html-shell` records the shell that dev and SPA send, without content assertions.

## How to get to it (user POV)

- A first visit, a hard reload or a crawler request to `/en-sa/` or `/ar-sa/example`.

## Driving it with drive.mjs

Preconditions:

- Launch with `ssr` or `ssg` for a pass that proves server-rendered content. In `dev` or `spa`, the journey only records the shell.

- **English home.** `GET /en-sa/` has `<html lang="en-sa" dir="ltr">` and the text `Welcome to Spark`.
- **Arabic example.** `GET /ar-sa/example` has `<html lang="ar-sa" dir="rtl">` and the text `First Example`.
- **Proof.** Run `RUN=<id> bun .claude/skills/verify-spark/scripts/drive.mjs initial-html`. It saves each raw response as `_en-sa_.html` and `_ar-sa_example.html`, and `steps.jsonl` records the `<html>` tag and the content check.

## Gotchas

- This journey uses `fetch`, not the browser. Pair it with `example-list` in the same mode to prove that hydration keeps the content and adds no console errors.
- Built modes test the build made at launch. If doctor warns that `HEAD` moved, relaunch.
- SSG prerenders only the paths seeded in `vite.config.ts` and the links found from them. A new route that no seeded page links to needs a new seed.
