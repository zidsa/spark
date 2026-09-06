# Coding Standards

This file defines how Zid Frontent TypeScript and React code is written.
Spark-specific runtime, data, and navigation rules are in [docs/runtime.md](docs/runtime.md); historical Hermes examples below must be adapted to Spark's Zod and router-owned query cache.
Precedence: [Oxc](.oxlintrc.json), [Oxfmt](.oxfmtrc.json), and [TypeScript](tsconfig.json) tooling -> this file -> the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) where this file is silent.

## Contents

- [Direction of travel](#direction-of-travel)
- [General TypeScript and naming](#general-typescript-and-naming)
- [Comments and documentation](#comments-and-documentation)
- [Types and data objects](#types-and-data-objects)
- [Feature modules](#feature-modules)
- [Routes and pages](#routes-and-pages)
- [Components and styling](#components-and-styling)
- [Tables](#tables)
- [Hooks and state](#hooks-and-state)
- [Forms and schemas](#forms-and-schemas)
- [API resources and query hooks](#api-resources-and-query-hooks)
- [Errors](#errors)
- [Internationalization](#internationalization)
- [Feature flags and permissions](#feature-flags-and-permissions)
- [Tests](#tests)
- [Current and deprecated surfaces](#current-and-deprecated-surfaces)
- [Retained team-authored rule-file content](#retained-team-authored-rule-file-content)
- [Anti-patterns](#anti-patterns)

## Direction of travel

The 2026 reference set shares a layered baseline: routes select pages, feature modules own UI and
domain behavior, API resources own HTTP, query hooks own cache policy, and named types describe
boundaries. New work in that set establishes these shifts:

| Current direction                                | Being phased out                            |
| ------------------------------------------------ | ------------------------------------------- |
| `app/api/resources/` plus `app/api/hooks/`       | the removed root service and ZidderJS trees |
| `AppTableV2` for a new table                     | `AppTable` and ag-grid for a new table      |
| literal translation keys with `context`          | keys assembled from open runtime values     |
| constants from `app/global/utils/permissions.ts` | hardcoded manager-permission strings        |
| module `schemas/` directories                    | singular module `schema/` directories       |
| focused root-loader regression tests             | untested redirect and timeout fixes         |

## General TypeScript and naming

### Name values by domain meaning

Name booleans as states or questions, handlers `handle...`, and callback props `on...`. Spell out a
stored value when an abbreviation hides the comparison, unit, or domain action. Conventional local
positions, such as comparator parameters, may stay short.

Reference: [`3b11a7fa0`](https://github.com/zidsa/hermes/commit/3b11a7fa0),
`app/modules/analytics-insights/components/market-payment-gaps/tab.tsx`.

```ts
// Good
const isDescending = sortKey.startsWith('-');
const firstValue = Number(a[field]) || 0;
const secondValue = Number(b[field]) || 0;
return isDescending ? secondValue - firstValue : firstValue - secondValue;

// Bad: app/modules/analytics-insights/components/product-performance/tab.tsx
const desc = sortKey.startsWith('-');
const av = Number(a[field]) || 0;
const bv = Number(b[field]) || 0;
return desc ? bv - av : av - bv;
```

## Comments and documentation

### Explain invariants, not authors or intentions

Write a comment when it preserves a contract or explains why surprising code is deliberate. Keep it
beside the constraint. Remove narration, owner names, phase notes, and vague future work.

Reference: [`379022bfd`](https://github.com/zidsa/hermes/commit/379022bfd),
`app/modules/whatsapp-auto-replies/types/use-flow-types.ts`.

```ts
// Good
// Path to the logical action in RHF.
// Duplicated graph instances intentionally share this path.
actionPath?: string;

// Bad: app/modules/five-sales-journey/components/five-sales-journey-card.tsx
// TODO: Replace with actual Zid AI optimization page when available
navigate(`/stores/${storeId}/apps/5979`);
```

## Types and data objects

### Name boundary shapes and model variants explicitly

Give request, response, form, component, and domain objects named types. Keep API shapes beside the
resource. Use a discriminated union when one field selects the valid fields of a variant. A short,
one-use component props type may stay beside its component.

Reference: [`379022bfd`](https://github.com/zidsa/hermes/commit/379022bfd),
`app/api/resources/manager/whatsapp-flows/types.ts`.

```ts
// Good
interface WhatsAppAutoReplyReplyTextAction {
  type: WhatsAppAutoReplyActionType.ReplyText;
  message: string;
}

interface WhatsAppAutoReplyGotoNodeAction {
  type: WhatsAppAutoReplyActionType.GotoNode;
  target: string;
}

// Bad: app/modules/catalog-inventory-stock-changes/utils/stock-history-helpers.ts
const getActionByLines = (
  row: InventoryLocation,
  t: (key: string) => string,
): { line1: string; line2?: string } => {
  // ...
};
```

## Feature modules

### Extend a module in place; create only the folders it needs

When extending a module, follow its current `components`, `hooks`, `pages`, `schemas`, `types`, and
`utils` boundaries. When creating a module, add only the folders required by the feature. Keep code
local until a second feature proves it is shared.

Reference: [`379022bfd`](https://github.com/zidsa/hermes/commit/379022bfd),
`app/modules/whatsapp-auto-replies/pages/editor.tsx` and its sibling folders.

```ts
// Good
// app/modules/whatsapp-auto-replies/
//   components/  hooks/  pages/  schemas/  types/  utils/

// Bad: app/modules/one-time-offers/utils/offer-helpers.ts
import { queryClient } from '~/api/hooks/client';
import { useQueryOneTimeOffersGetEligible } from '~/api/hooks/one-time-offers';
```

## Routes and pages

### Keep routes thin and pages responsible for composition

Keep URL validation and `beforeLoad` guards in the route; compose feature UI and data in
the module page. TanStack Start automatically splits route components and their imports.
Keep the root route free of feature UI imports, which would pull those features into startup.

Follow [Spark's code-splitting guide](docs/code-splitting.md) for optional UI, SDKs, named
lazy exports, and the production bundle check. Do not wrap every route in `React.lazy`,
add `.lazy.tsx` files by default, or raise the warning limit to hide bundle growth.

```tsx
// src/routes/$lang/example/index.tsx
import { createFileRoute } from '@tanstack/react-router';

import { ExampleListPage } from '~/modules/example/pages/example-list';

export const Route = createFileRoute('/$lang/example/')({
  component: ExampleListPage,
});
```

## Components and styling

### Build on the current UI layer and theme

When extending a component, preserve its public contract and use its existing design-system base.
When creating one, check ZidMUI and `app/ui/` first; use MUI primitives for layout or an unmatched
base. Use theme tokens for application surfaces. Keep literal colors for brand assets,
user-controlled values, embedded SDKs, or fixed chart series.

Reference: [`e1c3d8b90`](https://github.com/zidsa/hermes/commit/e1c3d8b90),
`app/modules/whatsapp-auto-replies/components/editor/flow-nodes/flow-action.tsx`.

```tsx
// Good
const ActionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
}));

// Bad: app/modules/home/components/new-onboarding/zidpay-card.tsx
sx={{ backgroundColor: '#FFF1FB', padding: '16px 24px !important' }}
```

## Tables

### Extend one table engine; create new tables with AppTableV2

Keep a small change to an existing legacy table on its current engine. Do not mix engines inside a
feature. Create a new table with `AppTableV2`; keep columns, filters, ordering, bulk actions, and row
actions in focused neighbors.

Reference: [`379022bfd`](https://github.com/zidsa/hermes/commit/379022bfd),
`app/modules/whatsapp-auto-replies/components/auto-replies/table.tsx`.

```tsx
// Good
<AppTableV2
  table={table}
  loading={flowsQuery.isLoading}
  virtualizerOptions={virtualizerOptions}
/>

// Bad: app/modules/marketplace-connect/components/products/trendyol-rev-share-table.tsx
<AppTable columns={columns} rows={products} getRowId={row => row.id} />
```

## Hooks and state

### Derive state in render and synchronize only with external systems

Run interaction-specific work in its handler. Derive display values from props, query data, form
state, or URL state during render. Use an Effect only to synchronize React with an external
system. When creating reusable state behavior, use a focused hook; keep deterministic mapping in
`utils`.

Reference: [`379022bfd`](https://github.com/zidsa/hermes/commit/379022bfd),
`app/modules/whatsapp-auto-replies/hooks/use-remove-detached-nodes.ts`.

```tsx
// Good: the Effect subscribes to React Hook Form, an external store
useEffect(() => {
  const unsubscribe = subscribe({
    formState: { values: true },
    callback: ({ values: currentFlow }) => {
      pendingFlow = structuredClone(currentFlow);
      if (isCleanupScheduled) return;
      isCleanupScheduled = true;
      queueMicrotask(removeNewlyDetachedNodes);
    },
  });
  return () => {
    isActive = false;
    unsubscribe();
  };
}, [flowId, getValues, setValue, subscribe]);

// Bad, as of abd7c934: app/global/components/app-subscription/packages/ngo-package/package-banner.tsx
useEffect(() => {
  if (packageSubmittingMutation.data?.status === 'success') navigate(`/stores/${id}`);
}, [packageSubmittingMutation.data]);
```

## Forms and schemas

### Keep form values, validation, defaults, and transforms together

Use React Hook Form and Zod v4 for a multi-field form in Spark. When extending a form, update its value type,
schema, defaults, and API transforms together. When creating one, separate field layout from
validation and submission; share form state through form context when sections need it.

Reference: [`379022bfd`](https://github.com/zidsa/hermes/commit/379022bfd),
`app/modules/whatsapp-auto-replies/components/auto-replies/create-flow-dialog.tsx`.

```tsx
// Good
const form = useForm<CreateExampleFormData>({
  defaultValues: { title: '', description: '', email: '' },
  resolver: zodResolver(createExampleSchema),
  mode: 'onSubmit',
});

// Bad: app/modules/marketplace-connect/components/activation/jahez/custom-schedule-dialog.tsx
const [name, setName] = useState(editingTemplate ? editingTemplate.name : '');
const [days, setDays] = useState<Record<JahezDayKey, JahezDaySchedule>>(() =>
  editingTemplate ? buildDaysFromTemplate(editingTemplate) : buildInitialDays(),
);
const isValid = useMemo(() => isScheduleValid(name, days), [name, days]);
```

## API resources and query hooks

### Put transport in resources and cache policy in hooks

When extending an API domain, add the operation beside its resource and query hook. When creating a
domain, add its named wire types, `mainKyClient` resource, and `createQuery` or `createMutation` hook
as one unit. Keep shared invalidation and mutation success work in the query hook.

Reference: [`094d8d61b`](https://github.com/zidsa/hermes/commit/094d8d61b),
`app/api/resources/customer-referrals/program.ts` and `app/api/hooks/customer-referrals.ts`.

```ts
// Good
const create = async (payload: CustomerReferralsTypes.CustomerReferralProgramCreatePayload) => {
  const response = await mainKyClient.post(pathBase, { json: payload });
  const result = await getResponseJSON<CustomerReferralsTypes.CustomerReferralProgram>(response);
  if (!result?.id) throwUnexpectedResponse(response);
  return result;
};

// Bad: app/modules/marketplace-connect/components/products/submit-to-trendyol-modal.tsx
useEffect(() => {
  queryClient.invalidateQueries({ queryKey: useQueryMarketplaceSourceProductsGet.getKey() });
  queryClient.invalidateQueries({ queryKey: useQueryMarketplaceProductsGet.getKey() });
}, [taskQuery.data]);
```

## Errors

### Reject invalid boundaries and preserve unknown failures

Validate the smallest stable response shape at the resource boundary. Handle an expected business
result next to the action that caused it. Let unknown failures reach the shared error path. For
best-effort work, state the reason and provide a deliberate fallback.

Reference: [`094d8d61b`](https://github.com/zidsa/hermes/commit/094d8d61b),
`app/api/resources/customer-referrals/program.ts`.

```ts
// Good
const result = await getResponseJSON<CustomerReferralsTypes.CustomerReferralProgramStats>(response);
if (!result?.currency_code) throwUnexpectedResponse(response);
return result;

// Bad: app/api/resources/manager/one-time-offers/index.ts
const result = await getResponseJSON<ConsumeTypes.ConsumeOfferResponse>(response);
return result;
```

## Internationalization

### Make translation keys statically resolvable

Use literal, namespaced keys. Use `context` and `count` for closed variants and plurals. Add Arabic
and English entries together and list page namespaces in `PageHandle`. For a genuinely open backend
value set, add an explicit mapping or a narrow `preservePatterns` entry.

Reference: [`e1c3d8b90`](https://github.com/zidsa/hermes/commit/e1c3d8b90),
`app/modules/whatsapp-auto-replies/components/editor/flow-nodes/flow-action.tsx`.

```tsx
// Good
t('whatsapp-auto-replies:flowGraph.actionType', {
  context: actionType,
});

// Bad: app/modules/notification-center/components/notification-list-item.tsx
t(`orders:paymentStatus.${paymentStatus}`, { defaultValue: paymentStatus });
```

## Feature flags and permissions

### Guard the widest owned boundary with central identifiers

Guard a whole page or feature at its exported boundary. Check a flag inside a child only when it
changes one control rather than access to the feature. Use manager-permission constants from
`app/global/utils/permissions.ts`; keep policies, package codes, and roles in their own systems.

Reference: [`83dcf0814`](https://github.com/zidsa/hermes/commit/83dcf0814),
`app/modules/reports/pages/reports-list.tsx`.

```tsx
// Good
export const CustomizableReportsReportsListPage = withFeatureGuard(
  withPermissionGuard(CustomizableReportsReportsListPageInternal, {
    checkOne: PERMISSION_ANALYTICS_AND_REPORTS.CUSTOMIZABLE_REPORTS.configsView,
  }),
  { checkOne: { policy: 'customizable_reports' }, hidePreview: true },
);

// Bad: app/modules/customers-questions/pages/customers-questions.tsx
const hasQuestionsPermission = useUserPermissions().checkOne('questions.and.ratings.manage');
```

## Tests

### Ship a focused test for an established contract

Update a focused test when changing a contract that already has coverage. A root or client loader
change that alters routing, timeout, or error behavior ships a focused test. For an untested unit,
add coverage when the behavior has a stable deterministic seam. Copy, assets, static layout, and
mechanical moves may omit a new test when behavior is unchanged. Keep tests beside their units.

Reference: [`a15c42e35`](https://github.com/zidsa/hermes/commit/a15c42e35),
`app/client-loader.test.ts`.

```ts
// Good
it('exits through the route error boundary when a shared profile query never settles', async () => {
  vi.spyOn(queryClient, 'ensureQueryData').mockImplementation(() => new Promise(() => undefined));

  const loaderResultPromise = callRootLoader('http://localhost/ar-sa/stores/12345', {
    lang: 'ar-sa',
    storeId: '12345',
  });
  await vi.advanceTimersByTimeAsync(30_000);
  const result = await loaderResultPromise;

  expect(result.response?.status).toBe(504);
});

// Bad, as of 03a0d1cdb: app/client-loader.ts
// A redirect regression changed behavior without a focused test.
throw redirect(newPath + url.search);
```

## Current and deprecated surfaces

### Use the current surface for new work and contain legacy changes

Start a new API domain in `app/api/`, a new table on `AppTableV2`, and a new module schema in
`schemas/`. When changing a legacy unit, keep a small fix on its current surface or migrate the
changed unit and its direct consumers. Do not expand a deprecated surface or migrate unrelated
code.

Reference: [`094d8d61b`](https://github.com/zidsa/hermes/commit/094d8d61b),
`app/api/resources/customer-referrals/program.ts`.

```ts
// Good: a new domain uses the current API boundary
import { mainKyClient } from '~/api/client/main';
export const customerReferralsProgram = { get, create, update, remove, getStats };

// Bad, as of cdb3b13dd: app/modules/preorder-campaigns/components/campaigns-table/table.tsx
import {
  useQueryPreorderCampaignsList,
  useMutationPreorderCampaignDelete,
} from '~/services/preorder-campaigns';
```

## Retained team-authored rule-file content

The excerpts below preserve, verbatim, every surviving line written by team members in the removed
per-agent rule files. They remain here for ownership preservation; the canonical standards above
govern when an excerpt is outdated, duplicated, or enforced by tooling.

### Former `.claude/rules/architecture.md`

```text
- **API Client**: custom HTTP client built on Ky
- **api/**: Custom HTTP client with interceptors and error handling
- **ui/**: Design system components and utilities
## UI Design System
- Theme configuration at `~/ui/libraries/mui/theme/parcel/`
- Components at `~/ui/components/`
### Building New UI Components
When implementing new components in `~/ui/components/` that require complex state/logic (data grids, comboboxes, date pickers, etc.):
## API Client
- Centralized error handling in `api/client/interceptors.ts`
- Resources: `~/api/resources/manager/`
- Services: `~/api/hooks/`
```

### Former `.claude/rules/code-style.md`

````text
- Order: external > @zidsa > @mui > ~/ui > ~/api > ~/global > ~/
This includes **type re-export files** — files that only do `export type { ... } from './other-file'` to consolidate types from multiple sources into one import path. These are barrel files too.

// ❌ Bad - type re-export barrel file
// my-types.ts
export type { Foo, Bar } from './foo-types';
export type { Baz } from './baz-types';


// ✅ Good - import types from their actual source
import type { Foo, Bar } from './foo-types';
import type { Baz } from './baz-types';
If you encounter an existing barrel file, refactor all consumers to import from the actual source files and delete the barrel.


- Theme location: `~/ui/libraries/mui/theme/parcel/`
## Meaningful Variable Names

**Always use descriptive, self-documenting variable names** — no single-letter variables or cryptic abbreviations. Variable names should clearly convey intent and purpose without needing a comment. This applies to all code: loop variables, destructured values, function parameters, sort comparisons, etc.

```tsx
// ❌ Bad - cryptic, requires mental parsing
const desc = sortKey.startsWith('-');
const av = Number(a[field]) || 0;
const bv = Number(b[field]) || 0;
return desc ? bv - av : av - bv;

// ✅ Good - reads like prose
const isDescending = sortKey.startsWith('-');
const firstValue = Number(a[field]) || 0;
const secondValue = Number(b[field]) || 0;
return isDescending ? secondValue - firstValue : firstValue - secondValue;
```

### Permissions — Use Centralized Constants

**NEVER hardcode permission strings.** All permissions must be imported from `~/global/utils/permissions.ts`.

Permission constants are organized by domain: `PERMISSION_ORDERS`, `PERMISSION_CUSTOMERS`, `PERMISSION_PRODUCTS`, `PERMISSION_ANALYTICS_AND_REPORTS`, `PERMISSION_MARKETING`, etc.

```tsx
// ❌ Bad - hardcoded strings are error-prone and lack type safety
const hasPermission = permissionCheck.checkOne('orders.export');
const canManage = checkPermission.checkOne('core.mazeed.manage');
const canViewAnalytics = checkPermission.checkOne('analytics.view.marketing');

// ✅ Good - type-safe, autocomplete-friendly, single source of truth
import {
  PERMISSION_ORDERS,
  PERMISSION_MAZEED,
  PERMISSION_ANALYTICS_AND_REPORTS,
} from '~/global/utils/permissions';

const hasPermission = permissionCheck.checkOne(PERMISSION_ORDERS.ORDERS.export);
const canManage = checkPermission.checkOne(PERMISSION_MAZEED.manage);
const canViewAnalytics = checkPermission.checkOne(
  PERMISSION_ANALYTICS_AND_REPORTS.ANALYTICS.viewMarketing,
);
```

**Benefits:**

- Type safety and IDE autocompletion
- Single source of truth for all permissions
- Eliminates typos in permission strings
- Makes refactoring easier when permissions change

**Rules:**

- **Do NOT create module-specific permission files** — always add new permissions to the centralized file
- See `~/global/utils/permissions.ts` for all available permission constants

````

### Former `.claude/rules/patterns.md`

```text
routes / products / _index.tsx; // route
routes / products / $id.tsx; // route
routes / products / components / table.tsx;
routes / products / hooks / use - products.tsx;
routes / products / route.tsx;
routes / products / table - component.tsx;
### Working with UI Components
1. Check if component exists in `~/ui/components/`
3. If component doesn't exist, create it in `~/ui/components/`
### Making API Calls with API
1. Check existing resources in `~/api/resources/manager/`
2. Check existing api hooks in `~/api/hooks/`
```

### Former `.kiro/steering/code-conventions.md`

````text
## Avoid inline type definitions

Always extract types into named type aliases. This improves readability, reusability, and makes the code easier to maintain.

```tsx
// Good - use enums for string literal unions
enum StatusColor {
  Success = 'success',
  Neutral = 'neutral',
  Info = 'info',
}

type StatusConfig = {
  color: StatusColor;
  label: string;
};

const getStatusConfig = (
  status: AutomationStatus | undefined,
  t: (key: string) => string,
): StatusConfig | null => {
  // ...
};

type UserFilters = {
  statuses: number[];
  createdAfter: string;
};

const filterUsers = (filters: UserFilters) => {
  // ...
};

// Bad - inline type definitions and string literal unions
const getStatusConfig = (
  status: AutomationStatus | undefined,
  t: (key: string) => string,
): { color: 'success' | 'neutral' | 'info'; label: string } | null => {
  // ...
};

const filterUsers = (filters: { statuses: number[]; createdAfter: string }) => {
  // ...
};
```

This convention:

- Makes types reusable across the codebase
- Improves code readability by giving types meaningful names
- Makes refactoring easier when types need to change
- Helps with IDE autocompletion and documentation


## Permissions — Use Centralized Constants

**NEVER hardcode permission strings.** All permissions must be imported from `~/global/utils/permissions.ts`.

Permission constants are organized by domain:

- `PERMISSION_ANALYTICS_AND_REPORTS` — Dashboard, analytics, reports
- `PERMISSION_APP_MARKET` — App market, embedded apps
- `PERMISSION_CUSTOMERS` — Customer CRUD, import/export
- `PERMISSION_FEATURE_SETTINGS` — Checkout, metafields, Q&A, automatic messages
- `PERMISSION_INVENTORY_MANAGEMENT` — Locations, stock transfers, stocktaking
- `PERMISSION_MARKETING` — Discounts, loyalty, coupons, campaigns, SEO, blogs
- `PERMISSION_MAZEED` — Mazeed marketplace
- `PERMISSION_ORDERS` — Orders, abandoned carts
- `PERMISSION_PAYMENTS` — Payment options, ZidPay, financing
- `PERMISSION_POS` — Point of sale
- `PERMISSION_PRODUCTS` — Product CRUD, categories, preorder
- `PERMISSION_SHIPPING` — Shipping, delivery, ZidShip
- `PERMISSION_STORE_SETTINGS` — Subscription, domains, VAT, user management
- `PERMISSION_STOREFRONT_AND_THEMES` — Theme customization
- `PERMISSION_WALLET` — Wallet management
- `PERMISSION_ZID_GROWTH` — Zid Growth
- `PERMISSION_STORE_PUSH_NOTIFICATION` — Push notifications
- `PERMISSION_STORE_WHATSAPP` — WhatsApp features

```tsx
// ❌ Bad - hardcoded strings are error-prone and lack type safety
const hasPermission = permissionCheck.checkOne('orders.export');
const canManage = checkPermission.checkOne('core.mazeed.manage');
const canViewAnalytics = checkPermission.checkOne('analytics.view.marketing');

// ✅ Good - type-safe, autocomplete-friendly, single source of truth
import {
  PERMISSION_ORDERS,
  PERMISSION_MAZEED,
  PERMISSION_ANALYTICS_AND_REPORTS,
} from '~/global/utils/permissions';

const hasPermission = permissionCheck.checkOne(PERMISSION_ORDERS.ORDERS.export);
const canManage = checkPermission.checkOne(PERMISSION_MAZEED.manage);
const canViewAnalytics = checkPermission.checkOne(
  PERMISSION_ANALYTICS_AND_REPORTS.ANALYTICS.viewMarketing,
);
```

This convention:

- Provides type safety and IDE autocompletion
- Creates a single source of truth for all permissions
- Eliminates typos in permission strings
- Makes refactoring easier when permissions change
- **Do NOT create module-specific permission files** — always add new permissions to the centralized file

## Translation Keys

Always prefix translation keys with the namespace when using `useTranslation`. This ensures explicit namespace usage and prevents key collisions.

```tsx
// Good
const { t } = useTranslation('whatsapp-main');
t('whatsapp-main:automations.title');
t('whatsapp-main:automations.description');

// Bad - relies on implicit namespace resolution
const { t } = useTranslation('whatsapp-main');
t('whatsapp-main:automations.title');
t('whatsapp-main:automations.description');
```

This convention:

- Makes it clear which namespace a key belongs to
- Prevents accidental key collisions across namespaces
- Makes code easier to search and refactor
````

### Former `.kiro/steering/structure.md`

```text
├── api/               # Custom API client library
└── ui/                # Zid's MUI component extensions
- `routes/create-store+/` — Legacy store creation redirects to registration
├── schemas/          # Yup validation schemas
**Examples:** `orders`, `catalog-products`, `customers`, `marketing-discounts`, `settings-team`
### `app/api/hooks/`
- `api/hooks/orders.ts` — Order-related API calls
- `api/hooks/products.ts` — Product catalog APIs
- `api/hooks/auth.ts` — Authentication APIs
- `api/hooks/client.ts` — React Query client configuration
### `app/ui/`
- `ui/components/` — Extended MUI components (`app-*` prefix)
- `ui/hooks/` — UI-related hooks
- `ui/libraries/` — MUI and Emotion configuration
- `ui/styles/` — Global CSS files
- `ui/utils/` — Formatting utilities (currency, date, etc.)
### `app/api/`
- `api/client/` — Client instance and interceptors
- `api/classes/` — Base resource classes
- `api/resources/` — API resource definitions
- `api/types/` — Request/response types
import { AppButton } from '~/ui/components/app-button';
import { AppButton } from '../../../ui/components/app-button';
**Import order (enforced by oxfmt):**
5. `~/ui/*`
6. `~/api/*`
7. `~/global/*`
8. `~/*` (other internal)
9. Parent/sibling imports
```

### Former `.kiro/steering/tech.md`

```text
- **oxfmt** for code formatting
### Key Oxfmt Rules
- Custom client wrapper in `app/api/`
| Rich Text Editor      | Platejs                                                 |
pnpm lint  # oxlint
pnpm fmt:check  # Check formatting
7. **Tables** — Use `AppTableV2` (`~/ui/components/app-table-v2/`) for all new tables; ag-grid is legacy only
8. **New UI components** — When building components with complex state/logic, use headless libraries for logic ([TanStack](https://tanstack.com/), [Radix UI](https://www.radix-ui.com/), [Downshift](https://www.downshift-js.com/)) and style with MUI/Emotion
```

## Anti-patterns

These entries are real Zid Frontent outliers. A commit identifies the evidence state; every cited path
still exists in the working tree.

### Component communication

#### Document-wide events for local component coordination

Why: A local action and its consumer become coupled through an untyped, application-wide channel.

Do instead: Lift the callback to their closest shared owner or use a scoped React context.

Evidence, as of [`720930367`](https://github.com/zidsa/hermes/commit/720930367),
`app/modules/orders/components/order-details/status-select.tsx`.

```tsx
// Bad
const handleSuccess = () => {
  document.dispatchEvent(new CustomEvent('feature:close'));
};
```

Primary source: [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).

### UI structure

#### New table on the legacy table engine

Why: A new feature takes on the table surface that current Zid Frontent work is replacing.

Do instead: Create the table with `AppTableV2` and its TanStack table hooks.

Evidence: [`0b4b1206a`](https://github.com/zidsa/hermes/commit/0b4b1206a),
`app/modules/marketplace-connect/components/products/trendyol-rev-share-table.tsx`.

```tsx
// Bad
<AppTable columns={columns} rows={rows} getRowId={row => row.id} />
```

Primary source: codebase convention; `AppTableV2` is the new-table surface.

### React lifecycle and cache state

#### Interaction-specific success work in an Effect

Why: Feedback, reset, delay, and navigation are caused by the interaction, not by rendering.

Do instead: Await the mutation in the interaction handler, then run its success work there.

Evidence, as of [`abd7c934a`](https://github.com/zidsa/hermes/commit/abd7c934a),
`app/global/components/app-subscription/packages/ngo-package/package-banner.tsx`. Commit
[`3a26072b2`](https://github.com/zidsa/hermes/commit/3a26072b2) removed it.

```tsx
// Bad
useEffect(() => {
  if (mutation.data?.status === 'success') navigate(successPath);
}, [mutation.data, navigate, successPath]);
```

Primary source: [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

### Internationalization

#### Translation key built from an open backend value

Why: A key built from an open backend string is not statically resolvable and can be removed by
`removeUnusedKeys`.

Do instead: Map the backend value explicitly; for a closed set use a literal key with `context`, and
for an open set configure a narrow `preservePatterns` entry.

Evidence: [`4cdaaf3e0`](https://github.com/zidsa/hermes/commit/4cdaaf3e0),
`app/modules/notification-center/components/notification-list-item.tsx`.

```tsx
// Bad
t(`orders:paymentStatus.${statusFromApi}`, { defaultValue: statusFromApi });
```

Primary source: [i18next-cli: Dynamic keys](https://github.com/i18next/i18next-cli#dynamic-keys).

#### Widened translation-key map

Why: `Record<Variant, string>` erases the literal values that type-aware extraction can expand.

Do instead: Keep a finite map `as const`, call `t` in literal branches, or use `context`.

Evidence, as of [`a8eb85644`](https://github.com/zidsa/hermes/commit/a8eb85644),
`app/modules/one-time-offers/components/offers-list-dialog.tsx`. Commit
[`cee6636f3`](https://github.com/zidsa/hermes/commit/cee6636f3) removed it.

```tsx
// Bad
const TITLE_KEYS: Record<Tier, string> = { basic: 'offers:basic', growth: 'offers:growth' };
t(TITLE_KEYS[tier]);
```

Primary source: [i18next-cli: Dynamic keys](https://github.com/i18next/i18next-cli#dynamic-keys).

### Error handling

#### Empty catch around an API mutation

Why: A failed write loses shared error handling, user feedback, telemetry, and fallback intent.

Do instead: Use the shared error path, show a suitable message, or document a deliberate
best-effort fallback.

Evidence: [`a8eb85644`](https://github.com/zidsa/hermes/commit/a8eb85644),
`app/modules/one-time-offers/hooks/use-one-time-offer-trigger.tsx`.

```tsx
// Bad
try {
  await mutation.mutateAsync(payload);
} catch {}
```

Primary source: codebase convention; unknown API failures use the shared error path.
