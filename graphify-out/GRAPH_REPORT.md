# Graph Report - .  (2026-08-06)

## Corpus Check
- Corpus is ~21,848 words - fits in a single context window. You may not need a graph.

## Summary
- 441 nodes · 526 edges · 64 communities (22 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.63)
- Token cost: 33,239 input · 1,594 output

## Community Hubs (Navigation)
- Providers and Queries
- Package Dependencies
- Locale Navigation
- Package Scripts
- TypeScript Settings
- Example Tests and UI
- Repository Tooling Config
- API Client Hooks
- Import Ordering
- API Response Types
- API Error Types
- Runtime Dependencies
- Web App Manifest
- Project Guidance
- Request Headers
- Query Formatting
- Search Parameters
- README and Logos
- Date Formatting
- Architecture and Theme
- Cloudflare Deployment
- Emotion Styling
- Task and CI Links
- Form Resolver
- I18next Runtime
- Language Detection
- MUI Lab
- MUI Material
- Snackbar UI
- PostHog Client
- PostHog React
- React Runtime
- React DOM
- Form Handling
- React I18n
- Query Hooks
- Sentry Monitoring
- Stylis Processor
- RTL Styling
- TanStack Matchers
- React Devtools
- TanStack Forms
- TanStack Query
- Query Devtools
- TanStack Router
- Router Devtools
- Router SSR Query
- TanStack Start
- TanStack Table
- Router Plugin
- Vite Path Resolver
- ZidMUI Components
- Zod Validation
- Prettier Configuration
- Stylis Type Declaration
- Vite Configuration
- Project Setup Prompt
- Pull Request Template
- Claude CI Workflow
- Theme Work Plan

## God Nodes (most connected - your core abstractions)
1. `scripts` - 20 edges
2. `compilerOptions` - 18 edges
3. `ignorePatterns` - 16 edges
4. `groups` - 12 edges
5. `ZidderError` - 10 edges
6. `getLangDirection()` - 7 edges
7. `FileRoutesByPath` - 6 edges
8. `Spark — Zid TanStack Start Boilerplate` - 6 edges
9. `sortImports` - 5 edges
10. `getResponseJSON()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `React Logo 192px` --conceptually_related_to--> `Spark README`  [INFERRED]
  public/logo192.png → README.md
- `React Logo 512px` --conceptually_related_to--> `Spark README`  [INFERRED]
  public/logo512.png → README.md
- `TanStack Circle Logo` --conceptually_related_to--> `Spark README`  [INFERRED]
  public/tanstack-circle-logo.png → README.md
- `Spark — Zid TanStack Start Boilerplate` --references--> `Architecture Rules`  [EXTRACTED]
  AGENTS.md → .claude/rules/architecture.md
- `Spark — Zid TanStack Start Boilerplate` --references--> `Backend Rules`  [EXTRACTED]
  AGENTS.md → .claude/rules/backend.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Spark Technology Stack** — agents, architecture, readme, claude_prompts_init [EXTRACTED 1.00]

## Communities (64 total, 42 thin omitted)

### Community 0 - "Providers and Queries"
Cohesion: 0.07
Nodes (30): queryClient, PostHogProvider(), PostHogProviderProps, TanStackQueryProvider(), getInitialLanguage(), i18nInstance, i18nResources, i18nOptions (+22 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.04
Nodes (47): @commitlint/cli, @commitlint/config-conventional, globals, jsdom, lefthook, msw, oxfmt, oxlint (+39 more)

### Community 2 - "Locale Navigation"
Cohesion: 0.08
Nodes (29): I18nLink, I18nLinkProps, prependLocale(), useI18nNavigate(), getContext(), getRouter(), Register, @tanstack/react-router (+21 more)

### Community 3 - "Package Scripts"
Cohesion: 0.07
Nodes (28): engines, bun, node, npm, name, packageManager, private, scripts (+20 more)

### Community 4 - "TypeScript Settings"
Cohesion: 0.07
Nodes (28): DOM, DOM.Iterable, ES2022, prettier.config.js, **/*.ts, **/*.tsx, vite/client, vite.config.js (+20 more)

### Community 5 - "Example Tests and UI"
Cohesion: 0.13
Nodes (19): PageContainer(), PageContainerProps, ExampleCard(), ExampleCardProps, statusColors, ExampleForm(), ExampleFormProps, mockItems (+11 more)

### Community 6 - "Repository Tooling Config"
Cohesion: 0.08
Nodes (24): arrowParens, bracketSameLine, bracketSpacing, ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson (+16 more)

### Community 7 - "API Client Hooks"
Cohesion: 0.13
Nodes (18): authTokenInterceptor(), authTokenResponseHandler(), errorHandler(), getToken(), guestEndpoints, loginEndpoints, parseErrorHandler(), removeToken() (+10 more)

### Community 8 - "Import Ordering"
Cohesion: 0.12
Nodes (16): sortImports, customGroups, groups, newlinesBetween, order, ~/api, builtin, external (+8 more)

### Community 9 - "API Response Types"
Cohesion: 0.14
Nodes (14): ZidderMessageType, ZidderPayload, ZidderPayloadCodes, ZidderPayloadEmpty, ZidderPayloadError, ZidderPayloadList, ZidderPayloadListPagination, ZidderPayloadMessage (+6 more)

### Community 10 - "API Error Types"
Cohesion: 0.29
Nodes (9): ZidderBadRequest, ZidderError, ZidderErrorForbidden, ZidderErrorNotFound, ZidderErrorServer, ZidderErrorTimeout, ZidderErrorTooManyRequests, ZidderErrorUnauthorized (+1 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.22
Nodes (9): @emotion/cache, @emotion/react, i18next-http-backend, ky, dependencies, @emotion/cache, @emotion/react, i18next-http-backend (+1 more)

### Community 12 - "Web App Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 13 - "Project Guidance"
Cohesion: 0.29
Nodes (6): Spark — Zid TanStack Start Boilerplate, Architecture Rules, Backend Rules, Code Style Rules, Environment Rules, Routing Rules

### Community 14 - "Request Headers"
Cohesion: 0.40
Nodes (3): ZidderHeaders, mappedHeaders, mappedRoles

### Community 15 - "Query Formatting"
Cohesion: 0.40
Nodes (3): AllPropsAreParamValue, ParamPrimitive, ParamValue

### Community 16 - "Search Parameters"
Cohesion: 0.40
Nodes (3): AllPropsAreParamValue, ParamPrimitive, ParamValue

### Community 17 - "README and Logos"
Cohesion: 0.50
Nodes (4): React Logo 192px, React Logo 512px, TanStack Circle Logo, Spark README

## Knowledge Gaps
- **225 isolated node(s):** `$schema`, `arrowParens`, `bracketSameLine`, `bracketSpacing`, `.claude` (+220 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Package Scripts`, `Emotion Styling`, `Form Resolver`, `I18next Runtime`, `Language Detection`, `MUI Lab`, `MUI Material`, `Snackbar UI`, `PostHog Client`, `PostHog React`, `React Runtime`, `React DOM`, `Form Handling`, `React I18n`, `Query Hooks`, `Sentry Monitoring`, `Stylis Processor`, `RTL Styling`, `TanStack Matchers`, `React Devtools`, `TanStack Forms`, `TanStack Query`, `Query Devtools`, `TanStack Router`, `Router Devtools`, `Router SSR Query`, `TanStack Start`, `TanStack Table`, `Router Plugin`, `Vite Path Resolver`, `ZidMUI Components`, `Zod Validation`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Package Dependencies` to `Package Scripts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **What connects `$schema`, `arrowParens`, `bracketSameLine` to the rest of the system?**
  _225 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Providers and Queries` be split into smaller, more focused modules?**
  _Cohesion score 0.0700354609929078 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Locale Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07807807807807808 - nodes in this community are weakly interconnected._
- **Should `Package Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
