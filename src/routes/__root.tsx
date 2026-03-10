import { useMemo } from 'react';

import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { I18nextProvider, useTranslation } from 'react-i18next';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ClientCacheProvider } from '~/ui/libraries/emotion/client-cache';
import { themeParcelOptions } from '~/ui/libraries/theme/parcel';
import { getLangDirection } from '~/libraries/i18next/resource';
import fontsCss from '~/ui/styles/fonts.css?url';

import PostHogProvider from '~/integrations/posthog/provider';
import TanStackQueryDevtools from '~/integrations/tanstack/devtools';
import TanStackQueryProvider from '~/integrations/tanstack/root-provider';
import { i18nInstance } from '~/libraries/i18next/client';
import appCss from '~/styles.css?url';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Spark',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: fontsCss,
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  ssr: false,
  shellComponent: RootShell,
  pendingComponent: RootPending,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootPending() {
  return <div id="root-pending" />;
}

function RootComponent() {
  const { i18n } = useTranslation();
  const dir = getLangDirection(i18n.language);
  const theme = useMemo(() => createTheme({ ...themeParcelOptions, direction: dir }), [dir]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ClientCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PostHogProvider>
            <TanStackQueryProvider>
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
                  TanStackQueryDevtools,
                ]}
              />
            </TanStackQueryProvider>
          </PostHogProvider>
        </ThemeProvider>
      </ClientCacheProvider>
    </I18nextProvider>
  );
}
