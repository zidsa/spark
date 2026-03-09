import type { Locale, Language } from './resource';

export type { Locale, Language };

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
  }
}
