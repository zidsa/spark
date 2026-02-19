import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getSupportedLanguage,
  getLangDirection,
  localeDefault,
} from '~/libraries/i18next/resource';

//
//

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    const supported = getSupportedLanguage(params.lang);

    if (!supported) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router redirect pattern
      throw redirect({ to: '/$lang', params: { lang: localeDefault } });
    }
  },
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }

    const dir = getLangDirection(lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang, i18n]);

  return <Outlet />;
}
