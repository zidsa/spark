import { createFileRoute, redirect } from '@tanstack/react-router';

import { localeDefault } from '~/libraries/i18next/resource';

//
//

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/$lang', params: { lang: localeDefault } });
  },
  component: () => null,
});
