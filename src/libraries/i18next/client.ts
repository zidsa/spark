import i18next from 'i18next';

import { i18nResources } from '~/libraries/i18next/locales';
import { i18nOptions } from '~/libraries/i18next/options';
import { getSupportedLanguageFromPathname, localeDefault } from '~/libraries/i18next/resource';

export function createI18nInstance() {
  const i18n = i18next.createInstance();
  void i18n.init({
    ...i18nOptions,
    resources: i18nResources,
    lng:
      typeof window === 'undefined'
        ? localeDefault
        : (getSupportedLanguageFromPathname(window.location.pathname) ?? localeDefault),
    initAsync: false,
  });
  return i18n;
}
