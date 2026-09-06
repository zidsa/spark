import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { I18nLink } from '~/global/components/i18n-link';
import { useI18nNavigate } from '~/global/hooks/use-i18n-navigate';

// These expressions are checked by tscheck; they never navigate or render.
export function navigationTypes(navigate: ReturnType<typeof useI18nNavigate>) {
  void navigate({ to: '/$lang/example', hash: 'items', replace: true });
  void navigate({ to: '/$lang', params: { lang: 'ar-sa' } });
  // @ts-expect-error Unknown routes must remain a compile-time error.
  void navigate({ to: '/not-a-route' });
  // @ts-expect-error From the root, the destination requires its lang parameter.
  void navigate({ from: '/', to: '/$lang' });
  const valid = <I18nLink to="/$lang/example" hash="items" target="_blank" aria-label="Example" />;
  // @ts-expect-error Unknown routes must remain a compile-time error.
  const invalid = <I18nLink to="/not-a-route" />;
  return { valid, invalid };
}

const root = createRootRoute();
const locale = createRoute({ getParentRoute: () => root, path: '$lang' });
const detail = createRoute({ getParentRoute: () => locale, path: 'example/$id' });
const router = createRouter({ routeTree: root.addChildren([locale.addChildren([detail])]) });

export function parameterizedLinkTypes() {
  const valid = (
    <I18nLink<typeof router, '/$lang/example/$id'> to="/$lang/example/$id" params={{ id: '123' }} />
  );
  // @ts-expect-error Binding lang must not make other route parameters optional.
  const invalid = <I18nLink<typeof router, '/$lang/example/$id'> to="/$lang/example/$id" />;
  return { valid, invalid };
}
