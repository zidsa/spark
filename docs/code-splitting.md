# Code splitting

Load code at the boundary where it is needed. A dynamic import helps only when no eager
import of the same module brings it back into the initial dependency graph.

## Routes

TanStack Start already enables automatic route code splitting. Keep route files thin:

```tsx
import { createFileRoute } from '@tanstack/react-router';

import { ExampleListPage } from '~/modules/example/pages/example-list';

export const Route = createFileRoute('/$lang/example/')({
  component: ExampleListPage,
});
```

The component and its feature imports become a lazy route chunk. `beforeLoad`, route
validation, and loaders stay eager by default so routing and data preloading can start
immediately. Keep large UI imports out of those functions and `src/routes/__root.tsx`,
which is always loaded. Keep the router's intent preloading and i18n navigation wrappers.

Do not add a second router plugin, `autoCodeSplitting` to Start's options, `.lazy.tsx`
files for every route, or a second `React.lazy` wrapper around an automatically split page.

## Optional UI and actions

Use `React.lazy` at module scope for expensive UI that appears only after interaction,
such as an editor or report dialog. Render it conditionally and put `Suspense` around
that feature, with an accessible, translated loading state. Keep source exports named:

```tsx
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';

const ReportDialog = lazy(() =>
  import('~/modules/reports/components/report-dialog').then(module => ({
    default: module.ReportDialog,
  })),
);

interface ReportFeatureProps {
  isOpen: boolean;
}

// Illustrative report feature; add the loading translation to common.
export function ReportFeature({ isOpen }: ReportFeatureProps) {
  const { t } = useTranslation('common');

  return isOpen ? (
    <Suspense fallback={<Box role="status">{t('common:loading')}</Box>}>
      <ReportDialog />
    </Suspense>
  ) : null;
}
```

For an export or another expensive action, put `await import('~/modules/...')` inside
its async event handler. Handle failure through the feature's existing error UI and
error reporting. Lazy UI also needs an error boundary; `Suspense` only handles loading.
Keep network-dependent modules safe to import during SSR, or defer browser-only work
to an effect or client-only boundary.

Keep small components, shared providers, navigation, theme/RTL setup, and the current
small translation resources eager. If translation namespaces grow substantially, load
them through the locale/route loading lifecycle before rendering, including SSR.

## Optional analytics

`src/integrations/posthog/provider.tsx` imports the SDK after mount when
`VITE_POSTHOG_KEY` is set. It keeps children mounted while loading and reports failures
through the browser's `reportError` API. The SDK is not initialized during SSR.

Use Spark's nullable hook for tracking:

```tsx
import { usePostHog } from '~/integrations/posthog/provider';

// Inside a component:
const posthog = usePostHog();
// Inside an interaction handler:
posthog?.capture('report_exported');
```

The client is `undefined` while loading, when disabled, or after a load failure.
Events before readiness are skipped; this provider does not queue them. Preserve
`capture_pageview: false` unless the app explicitly adds a pageview policy.
Do not import `posthog-js` or hooks from `@posthog/react` in feature components: those
eager imports defeat SDK deferral, and Spark's context is separate from the SDK's React
context. Apps needing feature flags or events from the first render must choose an
explicit initialization/bootstrap policy before adopting this optional analytics pattern.

## Production checks

```bash
bun run build
bun run check:bundle
bun run build:ssr
bun run check:bundle
```

The check fails if any emitted client JavaScript chunk exceeds 500 kB before gzip,
or if no chunks exist. CI runs it after both builds. It measures the browser output
in `dist/client/assets`, including the client half of an SSR build. The Pages build
also produces a temporary server build for prerendering; that log heading does not
make a preceding client bundle warning a server deployment issue.

`vite.config.ts` uses Rolldown's `codeSplitting.groups` only in the client environment
to separate the shared React runtime. This improves chunk boundaries and caching;
it does not reduce the bytes needed to start React. Optional imports do reduce the
initial dependency graph. Do not collect all dependencies into a single vendor chunk
or increase `chunkSizeWarningLimit` to hide growth.

When changing a boundary, compare the entry **and its static dependencies**, not just
one chunk. In a production browser, check the home page, direct feature URLs, navigation,
Arabic/English and RTL, plus the first use of deferred UI. Confirm a deferred chunk is
requested only when needed (route intent preloading can request it before a click).
Keep a behavior test for asynchronous initialization and failures.

References: [TanStack code splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting),
[Rolldown chunk groups](https://rolldown.rs/reference/OutputOptions.codeSplitting),
[React lazy](https://react.dev/reference/react/lazy).
