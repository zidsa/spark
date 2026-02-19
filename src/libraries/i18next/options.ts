import type { InitOptions } from 'i18next';

import { localeDefault, localesSupported } from './resource';

//
//

export const i18nOptions = {
  supportedLngs: localesSupported,
  fallbackLng: localeDefault,
  defaultNS: 'common',
  ns: ['common', 'pages', 'validation'],
  interpolation: {
    escapeValue: false,
  },
  react: { useSuspense: false },
} satisfies InitOptions;
