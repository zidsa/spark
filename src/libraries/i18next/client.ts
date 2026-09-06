import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { i18nResources } from './locales';
import { i18nOptions } from './options';
import { getSupportedLanguage, localeDefault } from './resource';

//
//

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const pathLang = window.location.pathname.split('/')[1];

    return getSupportedLanguage(pathLang) ?? localeDefault;
  }

  return localeDefault;
};

const i18nInstance = i18next.createInstance();

void i18nInstance.use(initReactI18next).init({
  ...i18nOptions,
  resources: i18nResources,
  lng: getInitialLanguage(),
  initAsync: false,
});

export { i18nInstance };
