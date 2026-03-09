import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

//
//

export const useI18nNavigate = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (to: string, options?: { replace?: boolean; search?: Record<string, unknown> }) => {
    const localizedPath = prependLocale(to, i18n.language);

    return navigate({ to: localizedPath, ...options });
  };
};

export const prependLocale = (to: string | number, lang: string): string => {
  if (typeof to === 'number') return String(to);
  if (to.startsWith('.')) return to;
  if (/^https?:\/\//.test(to)) return to;

  return '/' + lang + '/' + String(to).replace(/^\//, '');
};
