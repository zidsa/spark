export const languages = ['ar', 'en'] as const;
export type Language = (typeof languages)[number];

export const locales = ['ar-sa', 'en-sa'] as const;
export type Locale = (typeof locales)[number];

export const localeDefault: Locale = 'ar-sa';
export const languagesSupported: Language[] = [...languages];
export const localesSupported: Locale[] = [...locales];

//
//

export const getSupportedLanguage = (val?: string): Locale | undefined => {
  if (!val) return undefined;
  const lang = String(val).toLowerCase() as Locale;

  return localesSupported.includes(lang) ? lang : undefined;
};

export const getSupportedLanguageFromPathname = (pathname: string): Locale | undefined => {
  const pathLang = pathname.split('/')[1];

  return getSupportedLanguage(pathLang);
};

export const getLangDirection = (lang?: string): 'rtl' | 'ltr' =>
  lang && ['ar-sa', 'ar'].includes(String(lang).toLowerCase()) ? 'rtl' : 'ltr';

export const getLanguageFromLocale = (locale: string): Language => {
  const lang = locale.split('-')[0];

  return languages.includes(lang as Language) ? (lang as Language) : 'ar';
};
