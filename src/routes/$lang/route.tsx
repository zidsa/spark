import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

import { i18nInstance } from '~/libraries/i18next/client';
import {
  getSupportedLanguage,
  getLangDirection,
  localeDefault,
} from '~/libraries/i18next/resource';

//
//

export const Route = createFileRoute('/$lang')({
  beforeLoad: async ({ params }: { params: { lang: string } }) => {
    const supported = getSupportedLanguage(params.lang);

    if (!supported) {
      throw redirect({ to: '/$lang', params: { lang: localeDefault } });
    }

    if (i18nInstance.language !== supported) {
      await i18nInstance.changeLanguage(supported);
    }
  },
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();

  useEffect(() => {
    const dir = getLangDirection(lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  return <Outlet />;
}
