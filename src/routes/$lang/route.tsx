import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { getSupportedLanguage, localeDefault } from '~/libraries/i18next/resource';

//
//

export const Route = createFileRoute('/$lang')({
  beforeLoad: async ({ params, context: { i18n }, preload }) => {
    const supported = getSupportedLanguage(params.lang);

    if (!supported) {
      throw redirect({ to: '/$lang', params: { lang: localeDefault } });
    }

    if (!preload && i18n.language !== supported) {
      await i18n.changeLanguage(supported);
    }
    return { locale: supported };
  },
  component: Outlet,
});
