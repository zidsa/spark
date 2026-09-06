import { createFileRoute } from '@tanstack/react-router';

import { useQueryExampleList } from '~/api/hooks/example';

import { ExampleErrorState, ExampleListPage } from '~/modules/example/pages/example-list';

//
//

export const Route = createFileRoute('/$lang/example/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(useQueryExampleList.getOptions({ locale: context.locale })),
  errorComponent: ExampleErrorState,
  component: ExampleListPage,
});
