import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { exampleFetch, exampleResource } from '~/api/resources/example';

import { ExampleListPage } from '~/modules/example/pages/example-list';

import { renderWithProviders } from '../test-utils';

afterEach(() => vi.restoreAllMocks());

describe('ExampleListPage', () => {
  it('shows loading state initially', () => {
    renderWithProviders(<ExampleListPage />, { locale: 'en-sa' });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders example items after loading', async () => {
    renderWithProviders(<ExampleListPage />, { locale: 'en-sa' });

    await waitFor(() => expect(screen.getByText('First Example')).toBeInTheDocument());

    expect(screen.getByText('Second Example')).toBeInTheDocument();
    expect(screen.getByText('Third Example')).toBeInTheDocument();
  });

  it('renders localized form labels', () => {
    renderWithProviders(<ExampleListPage />, { locale: 'ar-sa' });

    expect(screen.getByLabelText('العنوان')).toBeInTheDocument();
    expect(screen.getByLabelText('الوصف')).toBeInTheDocument();
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
  });

  it.each(['ar-sa', 'en-sa'] as const)('renders validation errors in %s', async locale => {
    renderWithProviders(<ExampleListPage />, { locale });
    fireEvent.click(screen.getByRole('button'));
    expect(
      await screen.findByText(
        locale === 'en-sa' ? 'Must be at least 3 characters' : 'يجب أن يكون على الأقل 3 أحرف',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(locale === 'en-sa' ? 'Invalid email address' : 'البريد الإلكتروني غير صالح'),
    ).toBeVisible();

    fireEvent.change(screen.getByLabelText(locale === 'en-sa' ? 'Title' : 'العنوان'), {
      target: { value: 'x'.repeat(101) },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(
      await screen.findByText(
        locale === 'en-sa' ? 'Must not exceed 100 characters' : 'يجب ألا يتجاوز 100 أحرف',
      ),
    ).toBeVisible();
  });

  it.each(['malformed', 'http'])(
    'shows %s response failures through the real data path',
    async kind => {
      const getList = exampleResource.getList;
      vi.spyOn(exampleResource, 'getList').mockImplementation((variables, options) =>
        getList(variables, {
          ...options,
          retry: 0,
          fetch: async () =>
            kind === 'http' ? new Response(null, { status: 503 }) : Response.json({ payload: [] }),
        }),
      );
      renderWithProviders(<ExampleListPage />);
      expect(await screen.findByText('Failed to load items')).toBeVisible();
      expect(screen.queryByText('First Example')).not.toBeInTheDocument();
    },
  );
});

describe('example transport', () => {
  it('preserves caller headers alongside the explicit locale', async () => {
    await exampleResource.getList(
      { locale: 'ar-sa' },
      {
        headers: { 'x-request-id': 'example-test' },
        fetch: async input => {
          const request = new Request(input);
          expect(request.headers.get('x-request-id')).toBe('example-test');
          expect(request.headers.get('accept-language')).toBe('ar-sa');
          return exampleFetch(request);
        },
      },
    );
  });
  it('surfaces HTTP failures and rejects unsupported adapter requests', async () => {
    const error = await exampleResource
      .getList(
        { locale: 'en-sa' },
        {
          retry: 0,
          fetch: async () => new Response(null, { status: 503 }),
        },
      )
      .catch(value => value);

    expect(error).toHaveProperty('response.status', 503);
    await expect(
      exampleFetch('https://example.invalid/v1/example/', { method: 'POST' }),
    ).resolves.toHaveProperty('status', 404);
  });
});
