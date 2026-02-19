import { Link } from '@tanstack/react-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { prependLocale } from '~/global/hooks/use-i18n-navigate';

//
//

interface I18nLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const I18nLink = memo<I18nLinkProps>(function I18nLink({ to, children, ...rest }) {
  const { i18n } = useTranslation();
  const localizedTo = prependLocale(to, i18n.language);

  return (
    <Link to={localizedTo} style={{ textDecoration: 'none', color: 'inherit' }} {...rest}>
      {children}
    </Link>
  );
});
