import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
      <Typography variant="h3" gutterBottom>
        {t('pages:home.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('pages:home.subtitle')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" color="primary" component={I18nLink} to="/example">
          {t('common:navigation.example')}
        </Button>
        <Button variant="outlined" component="a" href={'/' + otherLocale + '/'}>
          {t('common:actions.switchLanguage')}
        </Button>
      </Box>
    </Box>
  );
}
