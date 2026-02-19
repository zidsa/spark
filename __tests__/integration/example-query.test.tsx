import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExampleListPage } from '~/modules/example/pages/example-list';

import { renderWithProviders } from '../test-utils';

describe('ExampleListPage', () => {
  it('shows loading state initially', () => {
    renderWithProviders(<ExampleListPage />);
    // The page should show a loading spinner
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  it('renders example items after loading', async () => {
    renderWithProviders(<ExampleListPage />);

    // Wait for the mock data to load (500ms delay in the hook)
    await waitFor(
      () => {
        expect(screen.getByText('First Example')).toBeDefined();
      },
      { timeout: 2000 },
    );

    expect(screen.getByText('Second Example')).toBeDefined();
    expect(screen.getByText('Third Example')).toBeDefined();
  });

  it('renders the form section', () => {
    renderWithProviders(<ExampleListPage />);
    // Form should be present
    expect(screen.getByText('Create New')).toBeDefined();
  });
});
