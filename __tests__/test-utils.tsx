import { render, type RenderOptions } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';

import { AppProviders } from '~/global/components/app-providers';

import type { Locale } from '~/libraries/i18next/resource';
import { getRouter } from '~/router';

interface ProviderRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: Locale;
}

export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en-sa', ...options }: ProviderRenderOptions = {},
) {
  const runtime = getRouter().options.context;
  void runtime.i18n.changeLanguage(locale);
  const wrapper = ({ children }: PropsWithChildren) => (
    <AppProviders {...runtime}>{children}</AppProviders>
  );
  return render(ui, { wrapper, ...options });
}

export { default as userEvent } from '@testing-library/user-event';
