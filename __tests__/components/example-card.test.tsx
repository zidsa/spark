import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExampleCard } from '~/modules/example/components/example-card';
import type { ExampleItem } from '~/modules/example/types/example.types';

import { renderWithProviders } from '../test-utils';

const mockItem: ExampleItem = {
  id: '1',
  title: 'Test Item',
  description: 'Test description for the card component',
  status: 'active',
  createdAt: '2024-01-15T10:30:00Z',
};

describe('ExampleCard', () => {
  it('renders item title', () => {
    renderWithProviders(<ExampleCard item={mockItem} />);
    expect(screen.getByText('Test Item')).toBeDefined();
  });

  it('renders item description', () => {
    renderWithProviders(<ExampleCard item={mockItem} />);
    expect(screen.getByText('Test description for the card component')).toBeDefined();
  });

  it('renders status chip', () => {
    renderWithProviders(<ExampleCard item={mockItem} />);
    expect(screen.getByText('active')).toBeDefined();
  });

  it('renders different statuses', () => {
    const draftItem: ExampleItem = { ...mockItem, status: 'draft' };
    renderWithProviders(<ExampleCard item={draftItem} />);
    expect(screen.getByText('draft')).toBeDefined();
  });
});
