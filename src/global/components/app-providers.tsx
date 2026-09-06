import { QueryClientProvider } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { i18n } from 'i18next';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { ClientCacheProvider } from '~/ui/libraries/emotion/client-cache';

import { PostHogProvider } from '~/integrations/posthog/provider';

interface AppProvidersProps {
  i18n: i18n;
  queryClient: QueryClient;
  children: ReactNode;
}

export function AppProviders({ i18n, queryClient, children }: AppProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <ClientCacheProvider>
        <PostHogProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </PostHogProvider>
      </ClientCacheProvider>
    </I18nextProvider>
  );
}
