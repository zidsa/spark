import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { AppButton } from '@zidsa/zidmui/components/app-button';
import { AppTypography } from '@zidsa/zidmui/components/app-typography';

import Box from '@mui/material/Box';

import { I18nLink } from '~/global/components/i18n-link';

//
//

export const Route = createFileRoute('/$lang/')({
  component: Home,
});

function Home() {
  const { t, i18n } = useTranslation(['common', 'pages']);
  const otherLocale = i18n.language === 'ar-sa' ? 'en-sa' : 'ar-sa';

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <AppTypography variant="h3" gutterBottom>
        {t('pages:home.title')}
      </AppTypography>
      <AppTypography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('pages:home.subtitle')}
      </AppTypography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <I18nLink to="/$lang/example">
          <AppButton variant="contained" color="primary">
            {t('common:navigation.example')}
          </AppButton>
        </I18nLink>
        <I18nLink to="/$lang" params={{ lang: otherLocale }} preload={false}>
          <AppButton variant="outlined">{t('common:actions.switchLanguage')}</AppButton>
        </I18nLink>
      </Box>
    </Box>
  );
}
