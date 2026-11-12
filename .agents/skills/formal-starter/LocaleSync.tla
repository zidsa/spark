---------------------------- MODULE LocaleSync ----------------------------
\* Spark's locale routing: the URL locale and the i18next language across every
\* order of navigations and language loads. Code map: formal-starter/SKILL.md.
EXTENDS Naturals, FiniteSets

CONSTANTS
    Locales,       \* localesSupported in src/libraries/i18next/resource.ts
    Default,       \* localeDefault
    Unsupported,   \* path segments getSupportedLanguage rejects, e.g. "xx-yy"
    AsyncLoad,     \* FALSE: resources bundled (client.ts today), changeLanguage commits at once.
                   \* TRUE: a backend loads resources, changeLanguage commits later.
    MaxNavs        \* bound on navigations

NONE == "none"
Segments == Locales \cup Unsupported
Idle == [to |-> NONE, waits |-> NONE]

VARIABLES
    url,           \* lowercase locale segment of the committed router location
    lang,          \* i18n.language
    changingTo,    \* i18n.isLanguageChangingTo
    pending,       \* changeLanguage calls whose loadResources callback has not run
    nav,           \* in-flight navigation [to, waits]; Idle when none
    navs

vars == <<url, lang, changingTo, pending, nav, navs>>

Init ==
    \* createI18nInstance: lng = locale of window.location.pathname, else Default.
    /\ url \in Locales
    /\ lang = url
    /\ changingTo = NONE
    /\ pending = {}
    /\ nav = Idle
    /\ navs = 0

\* `/` and `/$lang` beforeLoad: an unsupported segment redirects to Default.
Resolve(seg) == IF seg \in Locales THEN seg ELSE Default

\* The user follows a link or types a URL. TanStack Router cancels an older
\* in-flight navigation, so the new one replaces nav. `/$lang` beforeLoad runs:
\*   if (!preload && i18n.language !== supported) await i18n.changeLanguage(supported)
\* The guard reads the committed i18n.language, not isLanguageChangingTo.
Navigate(seg) ==
    LET to == Resolve(seg) IN
    /\ navs < MaxNavs
    /\ navs' = navs + 1
    /\ IF lang = to
         THEN \* no language change: the navigation commits.
              /\ url' = to
              /\ nav' = Idle
              /\ UNCHANGED <<lang, changingTo, pending>>
         ELSE IF ~AsyncLoad
         THEN \* bundled resources: loadResources calls back synchronously, done() commits.
              /\ lang' = to
              /\ url' = to
              /\ nav' = Idle
              /\ UNCHANGED <<changingTo, pending>>
         ELSE \* changeLanguage sets isLanguageChangingTo and waits for loadResources.
              /\ changingTo' = to
              /\ pending' = pending \cup {to}
              /\ nav' = [to |-> to, waits |-> to]
              /\ UNCHANGED <<url, lang>>

\* loadResources calls back for changeLanguage(l): done() commits l only when it is
\* still the latest requested language. The navigation awaiting l then commits.
Loaded(l) ==
    /\ l \in pending
    /\ pending' = pending \ {l}
    /\ IF changingTo = l
         THEN lang' = l /\ changingTo' = NONE
         ELSE UNCHANGED <<lang, changingTo>>
    /\ IF nav.waits = l
         THEN url' = nav.to /\ nav' = Idle
         ELSE UNCHANGED <<url, nav>>
    /\ UNCHANGED navs

Next ==
    \/ \E seg \in Segments : Navigate(seg)
    \/ \E l \in pending : Loaded(l)

Spec == Init /\ [][Next]_vars

Settled == nav = Idle /\ pending = {}

\* The router never commits a locale outside localesSupported.
UrlSupported == url \in Locales

\* Once nothing is in flight, the page text is in the URL's language.
\* RootShell derives <html lang dir> from the URL, so a mismatch shows English
\* text in an RTL Arabic page or the reverse.
LangMatchesUrl == Settled => lang = url
=============================================================================
