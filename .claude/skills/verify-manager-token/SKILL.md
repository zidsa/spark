---
name: verify-manager-token
description: Model-check Spark's manager token handling (getToken, saveToken, removeToken and the 401 reload in src/api/client/interceptors.ts) with TLA+ across every order of concurrent requests, sign-ins, 401 responses, token expiry and page reloads. Use before you merge a change to src/api/client/interceptors.ts or to the hooks, retry or error settings of mainKyClient in src/api/client/main.ts.
---

# Verify manager token handling

The browser keeps one manager token in `localStorage` key `_t`. Several requests can be in flight at once. Each request reads the token when it starts, a sign-in response saves a new token, and any 401 response deletes the token and reloads the page. Tests run these steps one after another. This check runs every order of them, in a small model, with TLC.

## Properties

| Property               | Plain meaning                                                               | Harm when broken                                                                                                                | Status at sync commit |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `NoStaleLogout`        | A 401 for one request never deletes a token that the backend still accepts. | A manager signs in, and an older request that started before the sign-in returns 401 and signs them out.                        | Violated: finding 1   |
| `NoAnonymousReload`    | A 401 never reloads the page when no token is stored.                       | A page that calls a protected endpoint without a token reloads, sends the same request, gets 401 and reloads again without end. | Violated: finding 2   |
| `GuestNeverSendsToken` | A request to `/v1/managers/login` never carries `x-manager-token`.          | A stale token goes to the sign-in endpoint.                                                                                     | Holds                 |

### Finding 1: a stale 401 signs out a new session

1. A request to a protected endpoint starts with no token stored (or with a token that later expires).
2. The manager signs in. `authTokenResponseHandler` saves the new token `t1`.
3. The first request returns 401. `errorHandler` calls `removeToken()`, which deletes `t1`, and reloads the page.
4. The manager is signed out although `t1` is valid.

A throwaway Vitest run against the real `mainKyClient` confirmed this order: after the late 401, `_t` was `null` and `reload` had run once.

### Finding 2: a 401 without a token reloads the page

1. A request to a protected endpoint starts with no token stored.
2. It returns 401. `errorHandler` calls `removeToken()` and `window.location.reload()`.
3. After the reload the page sends the same request with no token, so the steps repeat.

Today's shipped routes call only the local example adapter, which never returns 401, so no Spark page shows these findings yet. They apply to every app built on this client. The model confirms that a handler that deletes the token and reloads only when the stored token equals the token that the failed request sent satisfies all three properties. Fixing product code is a separate change; this skill only reports.

## Coverage record

Sync commit: `6c3af359dcd2592880719460b5a2a48fdc7884d5`. At that commit, the model below was compared line by line with these files. `check.sh` stores each file's git blob hash and prints `STALE` when a file differs. The hashes are authoritative; after a squash merge the commit is only a pointer.

| Code                                                                                     | Model action in `AuthToken.tla`                     |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `authTokenInterceptor`, `getToken`, `guestEndpoints` in `src/api/client/interceptors.ts` | `Send`                                              |
| `authTokenResponseHandler`, `saveToken`, `loginEndpoints`                                | `Succeed` for `kind = "login"`                      |
| `errorHandler`, `removeToken`, `window.location.reload()`                                | `Unauthorized`, then `Unload`                       |
| `hooks` and `retry` in `mainKyClient`, `src/api/client/main.ts`                          | A ky retry is another `Send`; ky does not retry 401 |
| Backend token expiry or revocation                                                       | `Expire`                                            |

Move the sync commit and the hashes in `check.sh` forward only after you compare the changed code with the model and update the model where they differ.

## Run the check

```bash
.claude/skills/verify-manager-token/check.sh
```

It needs `tlc` and `sany` on `PATH` (tla2tools 1.7.4 with Java 21 was used). It takes about 5 seconds. It writes each TLC report to `.claude/skills/verify-manager-token/out/<Property>.txt`, which is gitignored. Each line of output is one of:

- `PASS`: the property holds in every reachable state.
- `FINDING`: the property is violated, as recorded in the table above.
- `CHANGED`: the result differs from the table. A property that held is now violated, or a finding is now fixed.
- `STALE`: a covered file changed after the sync commit. The model can be out of date.
- `ERROR`: TLC did not finish. Read the report.

Exit code `0` means every property matches the table and no covered file changed.

## When a change touches the covered code

1. Run `check.sh`. Expect `STALE` for the file you changed.
2. Read your diff against the coverage table. For each changed step, edit the matching action in `AuthToken.tla` so that it does what the new code does. One hook body is one action, because JavaScript runs a synchronous hook without interruption. An `await` inside a hook splits it into two actions.
3. Run `check.sh` again.
4. Read every `CHANGED` or `FINDING` trace with the `/statechart` skill. It writes the shortest violating path as plain steps. Name each step with the function in the coverage table.
5. Decide whether the result is a real bug or a modeling error:
   - Real bug: every step in the trace matches something the code can do, in that order. Report it with the steps in code terms. Do not weaken the property to make it pass.
   - Modeling error: a step does something the code cannot do, such as a 401 for a request whose token the backend accepts. Fix the model to match the code, then run again.
6. When the change fixes a finding on purpose, change its row to `Holds` and its line in the `expected` function in `check.sh` to `holds`. When a property breaks on purpose, record it as a new finding.
7. After the model matches the new code, update the hashes in `check.sh` with `git hash-object <file>` and set the sync commit here to the commit you checked.

When the check passes, `/statechart` can also draw how the token moves between states.

## Scope and bounds

- Bounds: two tokens (`t1`, `t2`), two concurrent requests (`r1`, `r2`), at most two reloads. Constants are in the `.cfg` files. A pass covers these bounds only.
- One browser tab. Other tabs share `localStorage` and are not modeled.
- The backend returns 401 only for a token it does not accept, and a sign-in always succeeds. Sign-in failures and their status codes are not modeled.
- `storeId`, the `role` and `store-id` headers, `accept-language`, server rendering (where `window` is undefined and no token is read) and error class mapping in `parseErrorHandler` are out of scope.
- The model does not check that the new token is the one in the response body; the integration test in `__tests__/integration/api-client.test.ts` covers that.
