import { TanStackDevtools } from '@tanstack/react-devtools';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ClientCacheProvider } from '~/ui/libraries/emotion/client-cache';
import { themeParcelOptions } from '~/ui/libraries/theme/parcel';

import { PostHogProvider } from '~/integrations/posthog/provider';
import { tanStackQueryDevtools } from '~/integrations/tanstack/devtools';
import { TanStackQueryProvider } from '~/integrations/tanstack/root-provider';
import { i18nInstance } from '~/libraries/i18next/client';
import { getLangDirection } from '~/libraries/i18next/resource';

export function RootComponent() {
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
                  tanStackQueryDevtools,
                ]}
              />
            </TanStackQueryProvider>
          </PostHogProvider>
        </ThemeProvider>
      </ClientCacheProvider>
    </I18nextProvider>
  );
}
