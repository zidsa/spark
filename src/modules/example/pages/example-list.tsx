import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { PageContainer } from '~/global/components/page-container';

import { ExampleCard } from '~/modules/example/components/example-card';
import { ExampleForm } from '~/modules/example/components/example-form';
import { useQueryExampleList } from '~/modules/example/hooks/use-example-query';
import type { CreateExampleFormData } from '~/modules/example/schemas/example.schema';

//
//

export const ExampleListPage = () => {
  const { t } = useTranslation(['pages', 'common']);
  const { data: items, isLoading, error } = useQueryExampleList();

  const handleFormSubmit = (data: CreateExampleFormData) => {
    // eslint-disable-next-line no-console
    console.log('Form submitted:', data);
  };

  return (
    <PageContainer title={t('pages:example.title')} subtitle={t('pages:example.description')}>
      {/* Form Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New
        </Typography>
        <ExampleForm onSubmit={handleFormSubmit} />
      </Box>

      {/* Data Display Section */}
      <Typography variant="h6" gutterBottom>
        Items
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">Failed to load items</Alert>}

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
