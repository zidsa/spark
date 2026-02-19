import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { getContext } from '~/integrations/tanstack-query/root-provider';

import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    context: getContext(),

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Default to SPA (client-side rendering). Individual routes can opt into
    // SSR by setting `ssr: true` in their route options.
    defaultRouteOptions: {
      ssr: false,
    },
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
