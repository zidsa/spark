# Home and language switch

The home page welcomes the user in the URL's language and offers a button that reloads the same page in the other language, with the matching text direction.

## Sub-features

- `home-render` shows the title, subtitle, `Example` button and language button.
- `home-switch-ar` changes from English LTR to Arabic RTL.
- `home-switch-en` changes from Arabic RTL back to English LTR.

## How to get to it (user POV)

- Open `/en-sa/` or `/ar-sa/`.
- Open `/`, which redirects to `/ar-sa`.
- Select the language button: `العربية` on the English page, `English` on the Arabic page.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `OK` for this run. Any mode works.

- **English home.** Open `/en-sa/`. The heading `Welcome to Spark` appears and `<html>` has `lang="en-sa" dir="ltr"`.
- **Switch to Arabic.** Select the link `العربية`. The heading `مرحبًا بك في سبارك` appears, the path starts with `/ar-sa` and `<html>` has `lang="ar-sa" dir="rtl"`.
- **Switch back.** Select the link `English`. The heading `Welcome to Spark` returns with `lang="en-sa" dir="ltr"`.
- **Proof.** Run `RUN=<id> bun .claude/skills/verify-spark/scripts/drive.mjs home-language`. It writes `1-english-home.*` and `2-arabic-home.*`. In the Arabic screenshot, the text is right-aligned.

## Gotchas

- Each button is a `button` inside a `link`. Select the link by role; the inner button has the same name.
- The language link has `preload={false}`. Hovering it does not load the other locale.
- The TanStack Devtools button is in every dev and SPA page. Ignore it in ARIA snapshots.
