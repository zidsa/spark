---
name: update-from-spark
description: Use when updating a project created from Spark with newer Spark changes. Replays
  the Spark diff and fixes breaking changes.
---

# Update a project from Spark

Spark is the template this project came from. An update replays the Spark changes
made since the project's **base** (the Spark commit it last matched) onto the
project, keeps the project's own product code, and fixes whatever the upgraded
dependencies break.

The update is done when every Spark change since the base is applied, ported or
listed as skipped with a reason, every crossed major version has a verdict, the
project's CI checks pass locally, and `.spark-base` holds the new Spark commit.

## 1. Prepare

Start from a clean worktree on a new branch named by the project's rules.
`gh auth setup-git` lets Git read Spark while it is private. Fetch Spark without
adding a remote, so nothing can point pull requests at it:

```bash
git fetch https://github.com/zidsa/spark.git master
```

Every block below starts by reading the fetched commit again, because each block
may run in a new shell. Done when `git rev-parse FETCH_HEAD` prints a commit.

## 2. Find the base

Use the commit in `.spark-base` when the file exists. Projects started before the
file existed take the Spark commit whose files match the project most:

```bash
spark=$(git rev-parse FETCH_HEAD); mine=$(mktemp)
git ls-tree -r HEAD | awk '{print $3, $4}' | sort > "$mine"
for c in $(git rev-list "$spark"); do
  echo "$(git ls-tree -r "$c" | awk '{print $3, $4}' | sort | comm -12 - "$mine" | wc -l) $(git log -1 --date=format-local:%Y-%m-%dT%H:%M --format='%cd %h %s' "$c")"
done | sort -k1,1nr -k2,2 | head -5
```

Each line is the count of identical files, then the commit time, hash and subject.
The first line is the base: the highest count, and the oldest commit on a tie,
since replaying a change the project already has merges cleanly. Show the user the
top lines and wait for them to confirm the base; a wrong base replays the wrong
changes.

Done when the base is known. If it equals `FETCH_HEAD`, the project is current:
stop.

## 3. Read the change

```bash
spark=$(git rev-parse FETCH_HEAD); base=<base>
git log --reverse --format='%h %s%n%b' "$base..$spark"; git diff --stat "$base" "$spark"
```

The commit messages carry Spark's intent; use them to port changes the project has
moved. Done when you can name what each Spark commit changes.

## 4. Apply

Apply Spark's diff one file at a time so one failure does not block the rest.
`--no-renames` turns a Spark rename into a delete and an add, so the old file goes
too:

```bash
spark=$(git rev-parse FETCH_HEAD); base=<base>
rm -f .git/spark-leftovers
git diff --no-renames --name-only "$base" "$spark" -- . ':!.claude/skills/start-from-spark' |
while read -r f; do git diff "$base" "$spark" -- "$f" | git apply --3way || echo "$f" >> .git/spark-leftovers; done
```

`git apply --3way` stages what it applies: review it with `git diff --cached`.
Resolve each conflict and each file in `.git/spark-leftovers` (when it exists) by
ownership:

- **Spark owns infrastructure**: tooling config, CI, the API client, theme, i18n
  setup, router, providers and the skills in `.claude/skills`. Take Spark's
  change.
- **The project owns its product**: names, routes, modules, copy, env values and
  deployment names. Keep the project's version.
- **Moved code**: when the project moved or renamed a file, find its new home by
  searching for an identifying symbol and port the change there.
- **Removed on purpose** (the example module, a dropped integration): skip it and
  record the reason. A Spark deletion of a file the project never had is already
  done.
- **`bun.lock`**: restore the project's copy and regenerate it with `bun install`
  once `package.json` is resolved. Where the project pins a newer version than
  Spark, keep the newer one. Keep the Bun version aligned as
  `.claude/rules/environment.md` describes.

Done when `git grep -n -E '^(<<<<<<<|>>>>>>>)'` is empty, `git diff HEAD --check`
passes, and every file in `.git/spark-leftovers` is ported or recorded as skipped.

## 5. Fix breaking changes

List every dependency whose major version moved (or minor, below 1.0) by comparing
`package.json` with `git show HEAD:package.json`. For each one, read the release
notes or migration guide for every major crossed, search the project for the APIs
they change, and fix each use. When Spark made the same bump, its commit shows the
fix for Spark's copy of the code: reuse it.

Each crossed major ends with a verdict: "no affected use" or "fixed in <files>".

## 6. Verify and publish

Run every check in the project's CI workflows and its test suite, then start the
dev server and load each locale's home page. Write the fetched commit to
`.spark-base`.

Commit under the project's rules: the Spark sync in one commit, each
breaking-change fix in its own. The pull request links the Spark range as
`https://github.com/zidsa/spark/compare/<base>...<spark>`, lists the verdicts, and
lists every skipped change with its reason.
