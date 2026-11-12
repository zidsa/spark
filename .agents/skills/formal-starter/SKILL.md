---
name: formal-starter
description: Formally check Spark's starter group (src/routes and src/modules/example). A TLA+ model checks that the URL locale and the i18next language agree after every order of navigations and language loads, and a bounded-exhaustive run of the real example form schema checks that every rejected value shows a translated message. Use before you merge a change to src/routes, src/router.tsx, src/libraries/i18next or src/modules/example.
---

# Formal checks for the starter group

The inventory puts Spark's two modules, `src/routes` and `src/modules/example`, in one feature group, `starter`. This skill holds one property for each. The UI journeys for the same group live in `verify-spark` (see its feature map); this skill does not launch the app.

## Properties

| Property                   | Plain meaning                                                                                                                   | Harm when broken                                                                                                                            | Tool                                        | Status at sync commit                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `UrlSupported`             | The router never commits a locale segment whose lowercase form is not `ar-sa` or `en-sa`.                                       | `/xx-yy/example` renders with an unknown language and the wrong direction.                                                                  | TLC, `LocaleSync.tla`                       | Holds                                                                                                       |
| `LangMatchesUrl`           | When no navigation or language load is in flight, `i18n.language` equals the URL locale.                                        | An `/ar-sa/...` page (RTL, `lang="ar-sa"`) shows English text, or the reverse. `<html lang dir>` comes from the URL, the text from i18next. | TLC, `LocaleSync.tla`                       | Holds with bundled resources (`Bundled.cfg`); violated with an async backend (`AsyncBackend.cfg`): hazard 1 |
| `EveryRejectionHasMessage` | Every value `createExampleSchema` rejects maps to a `case` in `getValidationMessage` and to a non-empty string in both locales. | A field turns red with no text, so the user cannot tell what to fix.                                                                        | bun, `example-messages.ts` on the real code | Holds                                                                                                       |

### Hazard 1: an async translation backend breaks `LangMatchesUrl`

Today `createI18nInstance` passes bundled `resources`, so i18next's `loadResources` calls back synchronously and `changeLanguage` commits before the navigation ends. `package.json` already carries `i18next-http-backend`. If an app built on Spark loads translations through it, TLC finds this order (`AsyncBackend.cfg`):

1. The page is `/ar-sa`, `i18n.language` is `ar-sa`.
2. The user selects `English`. `$lang` `beforeLoad` sees `i18n.language !== 'en-sa'` and calls `changeLanguage('en-sa')`, which waits for the backend.
3. Before it loads, the user goes back to `/ar-sa`. The router cancels the first navigation. `beforeLoad` reads `i18n.language`, which is still `ar-sa`, so it does not call `changeLanguage`. The URL commits as `/ar-sa`.
4. The `en-sa` resources arrive. `isLanguageChangingTo` is still `en-sa`, so i18next commits English.
5. Result: URL `/ar-sa`, RTL, English text.

The guard reads the committed `i18n.language`; i18next's own guard compares with `isLanguageChangingTo`. A guard that skips `changeLanguage` only when `i18n.language` equals the target and no change to another language is pending (`isLanguageChangingTo` is unset or equal to the target) closes the gap. `isLanguageChangingTo` is internal to i18next and absent from its type declarations, so code reads it with a cast: `const changingTo = (i18n as typeof i18n & { isLanguageChangingTo?: string }).isLanguageChangingTo;`. With that edit to `Navigate`, `AsyncBackend.cfg` holds (48 distinct states). This skill only reports; nothing ships this path today, so it is recorded as a hazard and the check expects the violation.

## Coverage record

Sync commit: `10ee4fa95e58e0b645460d4274ae3848baa513e0`. At that commit the model and the script were compared with these files. `check.sh` stores each file's git blob hash and the installed i18next version, and prints `STALE` when one differs. The hashes are authoritative; after a squash merge the commit is only a pointer.

| Code                                                                                                                                                | Covered by                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `Route` `beforeLoad` in `src/routes/index.tsx` (redirect `/` to `localeDefault`)                                                                    | `Navigate` with `Resolve`                                                  |
| `Route` `beforeLoad` in `src/routes/$lang/route.tsx` (`getSupportedLanguage`, redirect, `i18n.language !== supported`, `await i18n.changeLanguage`) | `Navigate`                                                                 |
| `getSupportedLanguage`, `localesSupported`, `localeDefault` in `src/libraries/i18next/resource.ts`                                                  | `Locales`, `Default`, `Resolve`                                            |
| `createI18nInstance` in `src/libraries/i18next/client.ts` (`lng` from the path, bundled `resources`)                                                | `Init`, `AsyncLoad = FALSE`                                                |
| `getRouter` in `src/router.tsx` (one i18n instance per router)                                                                                      | one `lang` variable                                                        |
| i18next 26.5.11 `changeLanguage` and `loadResources` (`isLanguageChangingTo` guard)                                                                 | `changingTo`, `pending`, `Loaded`                                          |
| TanStack Router cancelling an older navigation                                                                                                      | `Navigate` replaces `nav`                                                  |
| `createExampleSchema` in `src/modules/example/schemas/example.schema.ts`                                                                            | `example-messages.ts` runs it                                              |
| `getValidationMessage` `case` labels in `src/modules/example/components/example-form.tsx`                                                           | `example-messages.ts` reads them from the file                             |
| `validation` namespace in `src/libraries/i18next/locales.ts`                                                                                        | `example-messages.ts` imports it (not hashed: the run reads the real text) |

## Run the check

```bash
.agents/skills/formal-starter/check.sh
```

It needs `tlc` and `sany` on `PATH` (tla2tools 1.7.4 with Java 21 was used), `bun` 1.4.4 and installed dependencies (`bun install --frozen-lockfile`). It takes about 4 seconds. TLC reports go to `.agents/skills/formal-starter/out/<cfg>.txt`, which is gitignored. Each line is one of:

- `PASS`: the property holds in every reachable state, or for every input in the bounded domain.
- `FINDING`: the model violates a property as recorded above.
- `CHANGED`: a result differs from the record.
- `COUNTEREXAMPLE` then `FAIL`: the form schema produced a message the form or a locale cannot show.
- `STALE`: a covered file or the i18next version changed after the sync commit.
- `ERROR`: TLC did not finish. Read the report.

Exit `0` means every result matches the record and nothing is stale. `example-messages.ts` can also run alone: `bun .agents/skills/formal-starter/example-messages.ts`.

## When a change touches the covered code

1. Run `check.sh`. Expect `STALE` for the file you changed.
2. Read your diff against the coverage table. For routing or i18n changes, edit the matching action in `LocaleSync.tla` so it does what the new code does. Code between two `await`s is one action; an `await` that can wait on I/O splits an action in two (that is what `AsyncLoad` models).
3. For schema or form changes, nothing in the script needs editing unless you add a field: add it to `fields` with a domain that crosses every bound in the schema.
4. Run `check.sh` again. Read every `CHANGED` or `FINDING` trace with the `/statechart` skill, which writes the shortest violating path as plain steps. Name each step with the function in the coverage table.
5. Decide whether the result is a real bug or a modeling error:
   - Real bug: every step in the trace matches something the code can do, in that order. Report it in code terms. Do not weaken the property to make it pass.
   - Modeling error: a step does something the code cannot do. Fix the model to match the code, then run again.
6. When a change fixes hazard 1 on purpose, set `AsyncBackend` in `expected()` to `holds` and its row above to `Holds`.
7. After the model matches the new code, update the hashes in `check.sh` with `git hash-object <file>` (and `I18NEXT` after a version bump, once you reread `changeLanguage`) and set the sync commit here.

## Proof that it can fail

Run on the sync commit, transcript kept with the PR proof:

- Changing the title's `min` message to `validation:required` (a key the form has no `case` for) printed `STALE` for `example.schema.ts`, then 3 counterexamples (`title=""`, `"a"`, `"aa"`), exit 1.
- Removing the unsupported-locale redirect in `$lang/route.tsx` printed `STALE`. Mirroring it in the model (`Resolve(seg) == seg`) made TLC violate `UrlSupported` in two steps (`url = "xx-yy"`).
- After reverting both, the check printed two `PASS` lines and the recorded `FINDING`, exit 0.

## Scope and bounds

- TLC bounds: locales `ar-sa`, `en-sa`, one unsupported segment `xx-yy`, at most 4 navigations, one tab. A pass covers these bounds.
- Segments are modeled in lowercase. `getSupportedLanguage` lowercases, so `/AR-SA/example` is accepted and the URL keeps `AR-SA` while i18next and `<html lang>` get `ar-sa`. The model's `url` is that lowercase form; `UrlSupported` says nothing about the segment's letter case.
- Preload (`defaultPreload: 'intent'`) runs `beforeLoad` with `preload = true`, which never calls `changeLanguage`, so it cannot change `lang`; it is not modeled. The home page's switch link sets `preload={false}`.
- Server rendering, hydration and `<html lang dir>` timing are not modeled; `verify-spark` checks them in a browser (`initial-html`, `home-language`).
- `example-messages.ts` covers string lengths 0 to 102 (title) and 0 to 502 (description), and 24 email strings chosen around zod's email rules. It checks the message keys, not the interpolated `{{min}}`/`{{max}}` values.
- The example list's data comes from the local fixture adapter; it has no state to model. The `ExampleErrorState` path is covered by `__tests__/integration/example-query.test.tsx`.
- Manager token handling in `src/api/client` belongs to `verify-manager-token`.
