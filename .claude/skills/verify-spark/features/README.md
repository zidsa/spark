# Spark verification map

This directory is the maintained source for verifying what a Spark user sees. Read this index before you drive the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `RUN=<id> .claude/skills/verify-spark/scripts/spark.sh launch <mode>` from the repository root. Use `dev` unless the feature names another mode.
- `RUN=<id> .claude/skills/verify-spark/scripts/spark.sh doctor` prints `OK` for the same run.
- No seed data is needed. The example items come from the fixture in `src/api/resources/example.ts`: `First Example` (active), `Second Example` (draft) and `Third Example` (inactive).
- Never drive an instance that this run did not start.

## Driving conventions

- Run each journey with `RUN=<id> bun .claude/skills/verify-spark/scripts/drive.mjs <feature>`.
- Start every journey from a fresh page load. The journeys do not depend on each other.
- Use ARIA roles and visible names. Arabic names are literal; copy them as written.
- Compare URL paths without the trailing slash.
- Wait for `<html lang dir>` to change; do not read it once right after load.

## Proof and skip reporting

- Proof is `evidence/<RUN>/<feature>/`: `steps.jsonl`, screenshots, ARIA snapshots and `result.json`.
- A journey fails when the browser console shows an error, even if every assertion passed.
- Report a skipped case with its `SKIPPED` line and reason. Do not report it as verified through another path.
- Name the mode with the result. A pass in `dev` does not prove `ssr` or `ssg`.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph that describes the user-visible behavior. It then has exactly four H2 sections in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with drive.mjs` (starts with `Preconditions:`), and `Gotchas`.

## Features

- [Home and language switch](./home-language.md) covers the home page and the switch between Arabic RTL and English LTR.
- [Example list](./example-list.md) covers the example page, its three fixture items and their localized status labels.
- [Example form validation](./example-form.md) covers the form's validation messages and a valid submit.
- [Locale routing](./locale-routing.md) covers the root redirect, unsupported locales and direct deep links.
- [Initial HTML by rendering mode](./initial-html.md) covers what the server or static host sends before scripts run.
