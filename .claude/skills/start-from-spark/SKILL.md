---
name: start-from-spark
description: Use when starting a new frontend project from Spark. Creates the repository from
  the template, renames it, records the Spark base and verifies it builds.
---

# Start a project from Spark

The project is _started_ when its GitHub repository exists under the new name,
`.spark-base` records the Spark commit it came from, every check in
`.github/workflows/pr-checks.yml` passes locally, and the first commit is pushed.

## 1. Gather

Ask one question with four answers: the project name (kebab-case, for example
`merchant-portal`), the Hermod URL for `VITE_API_URL`, the owner (default `zidsa`)
and the visibility (default `private`). Done when all four are known.

`gh auth status` must pass and `gh auth setup-git` must have run, so Git can read
Spark while it is private.

## 2. Create

Create the repository from the template. A template copy has no fork parent, so
its pull requests default to the new repository; a fork would default them to
Spark. Use the template even when the user says "fork" or "clone", and tell them
why in one line.

```bash
gh repo create <owner>/<name> --template zidsa/spark --<visibility> --clone
cd <name>
git fetch https://github.com/zidsa/spark.git master
tree=$(git rev-parse 'HEAD^{tree}')
for c in $(git rev-list FETCH_HEAD); do [ "$(git rev-parse "$c^{tree}")" = "$tree" ] && echo "$c" && break; done > .spark-base
```

`.spark-base` now holds the Spark commit whose files equal the copy. Done when it
holds one commit hash; when it is empty, find the commit with the finder in
`update-from-spark` step 2.

When the user cannot create repositories in the owner account, clone instead and
create the repository in step 5:

```bash
git clone https://github.com/zidsa/spark.git <name> && cd <name>
git rev-parse HEAD > .spark-base && rm -rf .git && git init -b master
```

## 3. Rename

Replace Spark's identity with the project's: `name` in `package.json` and
`wrangler.jsonc`, the README title and intro, the first lines of `AGENTS.md`, the
page title in `src/routes/__root.tsx`, the `common.app` and `pages.home` strings
for both locales in `src/libraries/i18next/locales.ts` (including the "Zid
TanStack Start Boilerplate" description and subtitle; Arabic writes Spark as
`سبارك`), the tests that assert the home title, and every doc that calls the
project Spark.

In the README, add one line under the title:
`Created from [Spark](https://github.com/zidsa/spark) at the commit in .spark-base.`

Delete this skill (`.claude/skills/start-from-spark`). Keep the other skills in
`.claude/skills` as Spark wrote them: Spark owns them, and `update-from-spark`
keeps them current.

Done when `.claude/skills/start-from-spark` is gone and
`git add -A && git grep -n -i -e spark -e سبارك -- ':!bun.lock' ':!.gitignore' ':!.claude/skills'`
shows only the README origin lines (the new one and the Deployment note on repos
created from Spark).

## 4. Set up and verify

Follow the README Quick Start (pinned Bun, `bun install`, `.env.local`), and set
`VITE_API_URL` to the Hermod URL from step 1. Run every `run:` step of
`.github/workflows/pr-checks.yml` in order. Then start `bun run dev` and confirm
`/ar-sa` and `/en-sa` return 200.

## 5. Publish

Commit everything as `chore: start <name> from spark`. Push `master`; a cloned
project creates its repository now with
`gh repo create <owner>/<name> --<visibility> --source . --push`. Point the user
to the README Deployment section for the Cloudflare Pages project; it needs
dashboard settings no file can carry.

## The example module

Keep the example module until the first real feature exists; it shows the route,
resource, hook, schema and test pattern. To remove it, delete the files from
`git ls-files | grep -i example` other than `.env.example`. Then remove the home
page link to `/$lang/example`, the `example` locale keys and the example-page
checks in `pr-checks.yml`, and rerun the checks.
