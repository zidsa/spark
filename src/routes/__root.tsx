import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { I18nextProvider } from 'react-i18next';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { ClientCacheProvider } from '~/zidmui/libraries/emotion/client-cache';
import { themeParcel } from '~/zidmui/libraries/mui/theme/parcel';
import fontsCss from '~/zidmui/styles/fonts.css?url';

import PostHogProvider from '~/integrations/posthog/provider';
import TanStackQueryDevtools from '~/integrations/tanstack-query/devtools';
import TanStackQueryProvider from '~/integrations/tanstack-query/root-provider';
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
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nextProvider i18n={i18nInstance}>
          <ClientCacheProvider>
            <ThemeProvider theme={themeParcel}>
              <CssBaseline />
              <PostHogProvider>
                <TanStackQueryProvider>
                  {children}
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
        <Scripts />
      </body>
    </html>
  );
}
