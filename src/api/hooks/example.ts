import { createQuery } from 'react-query-kit';

import { exampleResource } from '~/api/resources/example';

//
//

export const useQueryExampleList = createQuery({
  queryKey: ['example', 'list'],
  fetcher: () => exampleResource.getList(),
});

export const useQueryExampleById = createQuery<unknown, { id: string }>({
  queryKey: ['example', 'detail'],
  fetcher: ({ id }) => exampleResource.getById(id),
});
