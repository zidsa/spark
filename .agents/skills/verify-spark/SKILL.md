---
name: verify-spark
description: Launch the Spark web app (TanStack Start, ar-sa/en-sa localized UI) on a private port in dev, SPA, SSR or SSG mode, drive its pages in headless Chromium, and keep screenshots, ARIA snapshots and step logs as proof. Use to prove a Spark UI, routing, locale/RTL or rendering-mode change works the way a user sees it, beyond unit tests.
---

# Verify Spark

Spark's user surface is a localized web UI under `/ar-sa/` (Arabic, RTL, default) and `/en-sa/` (English, LTR). The shipped routes are the home page and the example page. The example data comes from a local fixture adapter in `src/api/resources/example.ts`, so verification needs no Hermod, backend or Zid local stack. Do not start, stop or change that stack for Spark verification.

Run every command from the repository root. Each run has an ID in `RUN`. Use a new ID for each proof, such as `RUN=pr42-locale`. Two runs can be live at the same time; each one gets its own free port and state directory.

| Path                                         | Contents                                             | Lifetime           |
| -------------------------------------------- | ---------------------------------------------------- | ------------------ |
| `.agents/skills/verify-spark/.state/$RUN/`   | pid, port, url, mode, commit, server and build logs  | removed by cleanup |
| `.agents/skills/verify-spark/evidence/$RUN/` | proof per feature, plus copied server and build logs | kept, gitignored   |

## Launch

```bash
RUN=my-check .agents/skills/verify-spark/scripts/spark.sh launch dev   # or spa | ssr | ssg
```

- `dev` runs Vite with hot reload. It starts in about 2 seconds and is the default for UI changes.
- `spa`, `ssr` and `ssg` run `bun run build`, `build:ssr` or `build:ssg`, then `bun run check:bundle`, then serve the output. `spa` and `ssr` use the same srvx command as `bun run start`. `ssg` serves only `dist/client`, the files that are deployed. A build takes about 30 seconds. Use these modes for rendering, hydration or initial-HTML changes.
- The script installs dependencies when `node_modules` is missing. When `.env.local` is missing, it copies `.env.example` to `.env.local` and cleanup deletes that copy. It never edits an existing `.env.local`.
- Set `PORT=<n>` to choose the port. Otherwise the script picks a free one. Vite uses `--strictPort`, so a taken port fails instead of moving.
- Ready means `GET /en-sa/` follows redirects and returns the Spark shell (`<title>Spark</title>`). The script prints `READY <url> mode=<mode> run=<RUN> pid=<pid>`. Any other ending is a failure; read the named log.
- The startup line `VITE_SENTRY_DSN is not defined. Sentry is not running.` is expected without a DSN.

## Doctor

```bash
RUN=my-check .agents/skills/verify-spark/scripts/spark.sh doctor
```

Run this first, and again whenever a result looks wrong. It is read-only. It checks that the recorded pid is alive, that the pid or its child owns the recorded port, and that `/en-sa/` returns the Spark shell. It prints `OK run=... mode=... pid=... url=... commit=...`. For a built mode, it warns when `HEAD` moved after the build; relaunch to test the current code. Never drive an instance that this run did not start.

## Drive

```bash
RUN=my-check bun .agents/skills/verify-spark/scripts/drive.mjs <feature>
```

`<feature>` is one of `home-language`, `example-list`, `example-form`, `locale-routing` or `initial-html`. The [feature map](features/README.md) describes each one from the user's side. Read the matching feature file before you trust or extend a journey.

`drive.mjs` loads Playwright from the global npm install (`npm root -g`) and runs headless Chromium. Playwright is not a Spark dependency, and this skill does not add it. If the import fails, report that Playwright is missing; do not add it to `package.json`. A journey passes only when every step passes and the browser console has no errors. It exits `0` on pass, `1` on fail and `2` for an unknown feature.

Use the selectors that the journeys use: ARIA roles with visible names, such as `getByRole('link', { name: 'Example' })`, `getByRole('textbox', { name: 'Title' })` and the Arabic names in the feature files. Do not use coordinates, CSS order or MUI class names, except for counting `.MuiCard-root` cards.

For a change that no journey covers, add a journey to `drive.mjs` and a feature file that describe the user path. Do not prove a change with a one-off script that the map does not record.

## Evidence

Each drive writes `evidence/$RUN/<feature>/`:

- `steps.jsonl`: one line per user action with the observed URL, `<html lang dir>`, text and values.
- `<n>-<name>.png` and `<n>-<name>.aria.txt`: a screenshot and an ARIA snapshot after each important step.
- `result.json`: pass or fail, the failure message, mode, URL and browser console errors.
- `failure.png` and `failure.aria.txt` when a step fails.

Proof standards:

- Use the real user path: open a URL, select a link or button, type in a field. Do not call router, i18n or query APIs from the page.
- Record the action and the state after it, not only the final screen.
- Check direction and language with `<html lang dir>`, not only with translated text.
- The example form saves nothing. Its proof is the validation messages and the field values after submit. Do not claim that it creates an item.
- The fixture adapter is the only mock, and it is the app's own code. Do not intercept network requests in a journey.
- In a PR, paste the `steps.jsonl` lines and attach the screenshots that prove the claim.

## Cleanup

```bash
RUN=my-check .agents/skills/verify-spark/scripts/spark.sh cleanup
```

Cleanup stops only the process group that `launch` started; the server writes its own session leader pid to the pid file after `setsid`, and `launch` records that pid's start time. Cleanup refuses to signal a live pid whose start time differs (a reused pid), and keeps `.state/$RUN/`. Cleanup also fails, and keeps `.state/$RUN/`, if the port is still listening afterwards. It deletes `.env.local` only when this run created it. It copies the server and build logs to `evidence/$RUN/`, then deletes `.state/$RUN/`. It never deletes evidence. Run cleanup after every failed launch or drive as well. Never kill Spark, Vite, Bun or srvx processes by name; other agents run them on this machine.

## Gotchas

- `spark.sh` runs on Linux and macOS. It uses `ss` and `setsid` when present; on macOS it falls back to `lsof` for the port check and Perl's `POSIX::setsid` to give the server its own process group, so cleanup still stops only that group. Linux needs procps `ps` (`ps -o lstart=`); BusyBox `ps` lacks it, so on Alpine install `procps` first. `bun` must be on `PATH` (`~/.bun/bin` on a default install).
- Two runs in one checkout share `.env.local`. The run that created it deletes it at cleanup, so start a second run only after the first one's cleanup, or use separate worktrees.
- Built modes write to `dist/`. Two built-mode runs in the same checkout overwrite each other's build. Run them one after the other, or use separate worktrees.
- In dev and SPA, the server sends one shell for every locale, and the client sets `<html lang dir>` after hydration. Wait for those attributes; the journeys do this. Only SSR and SSG send the final attributes in the first HTML.
- `/en-sa/` redirects to `/en-sa` and `/` redirects to `/ar-sa`. Compare paths without the trailing slash.
- In SSG mode, the local static server returns an error for paths that were not prerendered, such as `/xx-yy/example`. Cloudflare Pages behaves differently, so `locale-routing` skips that case in SSG and logs `SKIPPED`.
- Once, during this skill's first proof, the SPA server (`bun run start`, srvx 1.0.3 on Bun 1.4.1) exited while it served font files. The log said `A FileHandle object was closed during garbage collection`. Nine later journeys on a new instance passed. If doctor reports a dead pid and `server.log` shows that error, report it as a server crash. Do not hide it with a relaunch.

## Helpers

| Command                                                                             | Purpose                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `RUN=<id> .agents/skills/verify-spark/scripts/spark.sh launch <dev\|spa\|ssr\|ssg>` | Build when needed, start on a free port and wait until ready |
| `RUN=<id> .agents/skills/verify-spark/scripts/spark.sh doctor`                      | Read-only health check of this run's instance                |
| `RUN=<id> bun .agents/skills/verify-spark/scripts/drive.mjs <feature>`              | Run one mapped journey and write evidence                    |
| `RUN=<id> .agents/skills/verify-spark/scripts/spark.sh cleanup`                     | Stop this run's server and keep its evidence                 |

## Coverage

The inventory groups `src/routes` and `src/modules/example` as feature group `starter`. This skill is both the app-level launch/doctor base and that group's verify flow: every route in the group (`/`, `/:lang`, `/:lang/example`) has a journey in the [feature map](features/README.md). Its formal side is `formal-starter` (locale routing and form messages); the API client's token handling is `verify-manager-token`. Before a PR, run the journeys that touch your change and both formal `check.sh` scripts (see `AGENTS.md`).

Keep the feature map current with `/pstack:maintain-verification-skill` when routes, labels or rendering modes change.
