# Example list

The example page shows a heading, a demo form and a list of three items with localized status labels. The items come through the app's real query, resource and HTTP client, with a local fixture adapter in place of a backend.

## Sub-features

- `list-navigate` opens the example page from the home page.
- `list-items` shows `First Example`, `Second Example` and `Third Example`.
- `list-status-en` shows the statuses `active`, `draft` and `inactive` in English.
- `list-status-ar` shows the statuses `نشط`, `مسودة` and `غير نشط` in Arabic with RTL layout.

## How to get to it (user POV)

- Select `Example` on `/en-sa/` or `مثال` on `/ar-sa/`.
- Open `/en-sa/example` or `/ar-sa/example` directly.

## Driving it with drive.mjs

Preconditions:

- Doctor prints `OK` for this run. Any mode works.

- **Navigate.** Open `/en-sa/` and select the link `Example`. The level-1 heading `Example Page` appears.
- **Items.** The headings `First Example`, `Second Example` and `Third Example` appear in three cards. `steps.jsonl` records each card's title and status.
- **Arabic.** Open `/ar-sa/example`. The heading `صفحة المثال` and the status `مسودة` appear, and `<html>` has `lang="ar-sa" dir="rtl"`.
- **Proof.** Run `RUN=<id> bun .agents/skills/verify-spark/scripts/drive.mjs example-list`. It writes `1-english-list.*` and `2-arabic-list.*`.

## Gotchas

- Item titles and descriptions are English in both locales; only the status labels are translated.
- Hovering `Example` preloads the route, so the list can appear without a spinner. Do not require the spinner.
- If the page shows `Failed to load items` or `تعذر تحميل العناصر`, the response did not match the Zod schema. That is a failure, not a flake.
