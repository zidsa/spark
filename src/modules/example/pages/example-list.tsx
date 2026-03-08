import { useTranslation } from 'react-i18next';

import { AppAlert } from '@zidsa/zidmui/components/app-alert';
import { AppTypography } from '@zidsa/zidmui/components/app-typography';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { PageContainer } from '~/global/components/page-container';

import { ExampleCard } from '~/modules/example/components/example-card';
import { ExampleForm } from '~/modules/example/components/example-form';
import { useMockExampleQuery } from '~/modules/example/hooks/use-mock-example-query';
import type { CreateExampleFormData } from '~/modules/example/schemas/example.schema';

//
//

export const ExampleListPage = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { data: items, isLoading, error } = useMockExampleQuery();

  const handleFormSubmit = (data: CreateExampleFormData) => {
    // oxlint-disable-next-line no-console
    console.log('Form submitted:', data);
  };

  return (
    <PageContainer title={t('pages:example.title')} subtitle={t('pages:example.description')}>
      {/* Form Section */}
      <Box sx={{ mb: 4 }}>
        <AppTypography variant="h6" gutterBottom>
          Create New
        </AppTypography>
        <ExampleForm onSubmit={handleFormSubmit} />
      </Box>

      {/* Data Display Section */}
      <AppTypography variant="h6" gutterBottom>
        Items
      </AppTypography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <AppAlert severity="error" title="Failed to load items" />}

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
