import { TanStackDevtools } from '@tanstack/react-devtools';
import { Outlet, useRouteContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { AppProviders } from '~/global/components/app-providers';

import { tanStackQueryDevtools } from '~/integrations/tanstack/devtools';

export function RootComponent() {
  const runtime = useRouteContext({ from: '__root__' });

  return (
    <AppProviders {...runtime}>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          tanStackQueryDevtools,
        ]}
      />
    </AppProviders>
  );
}
