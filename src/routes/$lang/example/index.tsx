import { createFileRoute } from '@tanstack/react-router';

import { ExampleListPage } from '~/modules/example/pages/example-list';

//
//

export const Route = createFileRoute('/$lang/example/')({
  component: ExampleListPage,
});
