---------------------------- MODULE AuthToken ----------------------------
(***************************************************************************)
(* Manager token handling in src/api/client/interceptors.ts, as wired by    *)
(* mainKyClient in src/api/client/main.ts. One browser tab, several         *)
(* requests in flight. Each action is one synchronous hook body, which      *)
(* JavaScript runs without interleaving.                                    *)
(***************************************************************************)
EXTENDS Naturals

CONSTANTS
    Tokens,     \* access tokens the backend can issue, for example {"t1", "t2"}
    Reqs,       \* request slots that can be in flight at once
    MaxReloads  \* bound on window.location.reload() calls

None == "none"

VARIABLES
    stored,      \* localStorage "_t": getToken / saveToken / removeToken
    valid,       \* tokens the backend accepts now
    issued,      \* tokens the backend has handed out
    req,         \* req[r] = [state, kind, sent]
    reloading,   \* reload() was called and the page has not unloaded yet
    reloads,     \* number of reload() calls
    staleLogout, \* a 401 removed a token that the backend still accepts
    anonReload,  \* a 401 reloaded the page although no token was stored
    guestLeak    \* a /v1/managers/login request carried x-manager-token

vars == <<stored, valid, issued, req, reloading, reloads, staleLogout, anonReload, guestLeak>>

Kinds == {"api", "login"}
States == {"idle", "inflight"}

TypeOK ==
    /\ stored \in Tokens \cup {None}
    /\ valid \subseteq Tokens /\ issued \subseteq Tokens /\ valid \subseteq issued
    /\ req \in [Reqs -> [state : States, kind : Kinds, sent : Tokens \cup {None}]]
    /\ reloading \in BOOLEAN /\ reloads \in 0..MaxReloads

Init ==
    /\ stored = None
    /\ valid = {} /\ issued = {}
    /\ req = [r \in Reqs |-> [state |-> "idle", kind |-> "api", sent |-> None]]
    /\ reloading = FALSE /\ reloads = 0
    /\ staleLogout = FALSE /\ anonReload = FALSE /\ guestLeak = FALSE

(* authTokenInterceptor (beforeRequest): reads getToken() once per attempt.  *)
(* Requests to guestEndpoints ("/v1/managers/login") return before the token *)
(* header is set. A ky retry runs this hook again, which is another Send.    *)
Send(r, k) ==
    /\ ~reloading
    /\ req[r].state = "idle"
    /\ LET sent == IF k = "login" THEN None ELSE stored
       IN /\ req' = [req EXCEPT ![r] = [state |-> "inflight", kind |-> k, sent |-> sent]]
          /\ guestLeak' = (guestLeak \/ (k = "login" /\ sent # None))
    /\ UNCHANGED <<stored, valid, issued, reloading, reloads, staleLogout, anonReload>>

(* The backend accepts the request: a 2xx response. For a login endpoint,   *)
(* authTokenResponseHandler (afterResponse) saves user.access_token.        *)
Succeed(r) ==
    /\ req[r].state = "inflight"
    /\ req[r].kind = "api" => req[r].sent \in valid
    /\ IF req[r].kind = "login"
       THEN \E t \in Tokens \ issued :
              /\ issued' = issued \cup {t}
              /\ valid' = valid \cup {t}
              /\ stored' = t
       ELSE UNCHANGED <<stored, valid, issued>>
    /\ req' = [req EXCEPT ![r].state = "idle"]
    /\ UNCHANGED <<reloading, reloads, staleLogout, anonReload, guestLeak>>

(* The backend rejects a token it does not accept with 401. errorHandler    *)
(* (beforeError) then calls removeToken() and window.location.reload()      *)
(* without looking at which token the request carried.                      *)
Unauthorized(r) ==
    /\ req[r].state = "inflight"
    /\ req[r].kind = "api"
    /\ req[r].sent \notin valid
    /\ reloads < MaxReloads
    /\ staleLogout' = (staleLogout \/ stored \in valid)
    /\ anonReload' = (anonReload \/ stored = None)
    /\ stored' = None
    /\ reloading' = TRUE
    /\ reloads' = reloads + 1
    /\ req' = [req EXCEPT ![r].state = "idle"]
    /\ UNCHANGED <<valid, issued, guestLeak>>

(* reload() navigates later; until then other responses still run hooks.    *)
Unload ==
    /\ reloading
    /\ reloading' = FALSE
    /\ req' = [r \in Reqs |-> [state |-> "idle", kind |-> "api", sent |-> None]]
    /\ UNCHANGED <<stored, valid, issued, reloads, staleLogout, anonReload, guestLeak>>

(* The backend stops accepting a token: expiry, logout elsewhere, revoke.    *)
Expire(t) ==
    /\ t \in valid
    /\ valid' = valid \ {t}
    /\ UNCHANGED <<stored, issued, req, reloading, reloads, staleLogout, anonReload, guestLeak>>

Next ==
    \/ \E r \in Reqs, k \in Kinds : Send(r, k)
    \/ \E r \in Reqs : Succeed(r) \/ Unauthorized(r)
    \/ Unload
    \/ \E t \in Tokens : Expire(t)

Spec == Init /\ [][Next]_vars

(* A 401 for one request never signs out a session the backend still        *)
(* accepts. Harm: a manager who signs in while an older request is in        *)
(* flight is signed out when that older request returns 401.                 *)
NoStaleLogout == ~staleLogout

(* A 401 never reloads the page when no token was stored. Harm: a page that  *)
(* calls a protected endpoint without a token reloads, sends the same        *)
(* request, gets 401 and reloads again, without end.                         *)
NoAnonymousReload == ~anonReload

(* A sign-in request never carries the stored manager token.                 *)
GuestNeverSendsToken == ~guestLeak
=============================================================================
