import { useQueryClient } from '@tanstack/react-query';
import { createMemoryHistory, RouterContextProvider } from '@tanstack/react-router';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { expect, it } from 'vitest';

import { useTheme } from '@mui/material/styles';

import { AppProviders } from '~/global/components/app-providers';
import { I18nLink } from '~/global/components/i18n-link';
import { useI18nNavigate } from '~/global/hooks/use-i18n-navigate';

import { getRouter } from '~/router';

it.each(['ar-sa', 'en-sa'])('preserves %s in links and imperative navigation', async locale => {
  const router = getRouter();
  router.update({
    ...router.options,
    history: createMemoryHistory({ initialEntries: [`/${locale}/`] }),
  });
  await router.load();
  function Navigation() {
    const navigate = useI18nNavigate();
    return (
      <>
        <I18nLink to="/$lang/example" hash="items">
          Example
        </I18nLink>
        <button
          onClick={() => void navigate({ to: '/$lang/example', hash: 'items', replace: true })}
        >
          Go
        </button>
      </>
    );
  }
  render(
    <RouterContextProvider router={router}>
      <Navigation />
    </RouterContextProvider>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `/${locale}/example#items`);
  expect(screen.getByRole('link')).toHaveStyle({ textDecoration: 'none' });
  fireEvent.click(screen.getByRole('button'));
  await waitFor(() => expect(router.history.location.href).toBe(`/${locale}/example#items`));
  expect(router.history.length).toBe(1);
});

it('keeps cached data isolated between app runtimes', () => {
  const first = getRouter();
  const second = getRouter();
  first.options.context.queryClient.setQueryData(['private-example'], 'first runtime');

  expect(second.options.context.queryClient.getQueryData(['private-example'])).toBeUndefined();
});

it('isolates locales and keeps preloading from changing the active language', async () => {
  const first = getRouter();
  const second = getRouter();
  first.update({ ...first.options, history: createMemoryHistory({ initialEntries: ['/ar-sa/'] }) });
  second.update({
    ...second.options,
    history: createMemoryHistory({ initialEntries: ['/en-sa/'] }),
  });
  await Promise.all([first.load(), second.load()]);

  expect(first.options.context.i18n.t('pages:home.title')).toBe('مرحبًا بك في سبارك');
  expect(second.options.context.i18n.t('pages:home.title')).toBe('Welcome to Spark');
  await second.preloadRoute({ to: '/$lang', params: { lang: 'ar-sa' } });
  expect(second.options.context.i18n.language).toBe('en-sa');
  second.history.push('/ar-sa/');
  await second.load();
  expect(second.options.context.i18n.language).toBe('ar-sa');
});

it('keeps query and form state while translations, theme and Emotion direction change', async () => {
  const runtime = getRouter().options.context;
  await runtime.i18n.changeLanguage('en-sa');
  runtime.queryClient.setQueryData(['draft'], 'cached draft');
  function Content() {
    const [draft, setDraft] = useState('');
    const { t } = useTranslation('pages');
    const queryClient = useQueryClient();
    const theme = useTheme();
    return (
      <>
        <input aria-label="Draft" value={draft} onChange={event => setDraft(event.target.value)} />
        <span>{t('pages:home.title')}</span>
        <span>{theme.direction}</span>
        <span>{queryClient.getQueryData<string>(['draft'])}</span>
      </>
    );
  }
  const view = render(
    <AppProviders {...runtime}>
      <Content />
    </AppProviders>,
  );
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'keep typing' } });
  await act(() => runtime.i18n.changeLanguage('ar-sa'));
  view.rerender(
    <AppProviders {...runtime}>
      <Content />
    </AppProviders>,
  );
  expect(screen.getByText('مرحبًا بك في سبارك')).toBeVisible();
  expect(screen.getByText('rtl')).toBeVisible();
  expect(screen.getByText('cached draft')).toBeVisible();
  expect(screen.getByRole('textbox')).toHaveValue('keep typing');
});
