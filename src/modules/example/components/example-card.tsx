import { useTranslation } from 'react-i18next';

import { AppStatus } from '@zidsa/zidmui/components/app-status';
import { AppTypography } from '@zidsa/zidmui/components/app-typography';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import type { ExampleItem } from '~/api/resources/example';

//
//

interface ExampleCardProps {
  item: ExampleItem;
}

const statusColors = {
  active: 'success' as const,
  inactive: 'error' as const,
  draft: 'warning' as const,
};

export const ExampleCard = ({ item }: ExampleCardProps) => {
  const { t } = useTranslation('pages');

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <AppTypography variant="h6">{item.title}</AppTypography>
          <AppStatus
            label={t('pages:example.status', { context: item.status })}
            color={statusColors[item.status]}
            size="small"
          />
        </Box>
        <AppTypography variant="body2" color="text.secondary">
          {item.description}
        </AppTypography>
      </CardContent>
    </Card>
  );
};
