import { createQuery } from 'react-query-kit';

import type { ExampleItem } from '~/modules/example/types/example.types';

//
//

const mockItems: ExampleItem[] = [
  {
    id: '1',
    title: 'First Example',
    description: 'This is a demonstration of the data fetching pattern',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Second Example',
    description: 'Another item showing the card component',
    status: 'draft',
    createdAt: '2024-02-20T14:45:00Z',
  },
  {
    id: '3',
    title: 'Third Example',
    description: 'Inactive item for status demonstration',
    status: 'inactive',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

export const useQueryExampleList = createQuery<ExampleItem[]>({
  queryKey: ['example', 'list'],
  fetcher: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockItems;
  },
});
