import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { i18nOptions } from './options';

//
//

const i18nInstance = i18next.createInstance();

void i18nInstance
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    ...i18nOptions,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['path', 'localStorage', 'htmlTag', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

export { i18nInstance };
