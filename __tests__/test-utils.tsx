import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { themeParcel } from '~/zidmui/libraries/mui/theme/parcel';

import { i18nInstance } from '~/libraries/i18next/client';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

interface ProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: ProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ThemeProvider theme={themeParcel}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options });

export { default as userEvent } from '@testing-library/user-event';
