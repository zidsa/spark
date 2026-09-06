import { useTranslation } from 'react-i18next';

import { AppAlert } from '@zidsa/zidmui/components/app-alert';
import { AppTypography } from '@zidsa/zidmui/components/app-typography';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useQueryExampleList } from '~/api/hooks/example';

import { PageContainer } from '~/global/components/page-container';

import { getSupportedLanguage, localeDefault } from '~/libraries/i18next/resource';
import { ExampleCard } from '~/modules/example/components/example-card';
import { ExampleForm } from '~/modules/example/components/example-form';
import type { CreateExampleFormData } from '~/modules/example/schemas/example.schema';

//
//

// This demo exercises validation without persisting submitted values.
const handleFormSubmit = (_data: CreateExampleFormData) => undefined;

export const ExampleErrorState = () => {
  const { t } = useTranslation('pages');

  return <AppAlert severity="error" title={t('pages:example.errors.load')} />;
};

export const ExampleListPage = () => {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const locale = getSupportedLanguage(i18n.language) ?? localeDefault;
  const { data: items, isLoading, error } = useQueryExampleList({ variables: { locale } });

  return (
    <PageContainer title={t('pages:example.title')} subtitle={t('pages:example.description')}>
      {/* Form Section */}
      <Box sx={{ mb: 4 }}>
        <AppTypography variant="h6" gutterBottom>
          {t('pages:example.create')}
        </AppTypography>
        <ExampleForm onSubmit={handleFormSubmit} />
      </Box>

      {/* Data Display Section */}
      <AppTypography variant="h6" gutterBottom>
        {t('pages:example.items')}
      </AppTypography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <ExampleErrorState />}

      {items && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map(item => (
            <ExampleCard key={item.id} item={item} />
          ))}
        </Box>
      )}
    </PageContainer>
  );
};
