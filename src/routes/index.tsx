import { createFileRoute, redirect } from '@tanstack/react-router';

import { localeDefault } from '~/libraries/i18next/resource';

//
//

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router redirect pattern
    throw redirect({ to: '/$lang', params: { lang: localeDefault } });
  },
  component: () => null,
});
