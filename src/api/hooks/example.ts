import { createQuery } from 'react-query-kit';

import { exampleResource } from '~/api/resources/example';
import type { ExampleItem, ExampleListVariables } from '~/api/resources/example';

//
//

export const useQueryExampleList = createQuery<ExampleItem[], ExampleListVariables>({
  queryKey: ['example', 'list'],
  fetcher: (variables, { signal }) => exampleResource.getList(variables, { signal }),
});
