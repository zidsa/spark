import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import type { ExampleItem } from '~/modules/example/types/example.types';

//
//

interface ExampleCardProps {
  item: ExampleItem;
}

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
}));

const statusColors = {
  active: 'success' as const,
  inactive: 'error' as const,
  draft: 'warning' as const,
};

export const ExampleCard = ({ item }: ExampleCardProps) => {
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
          <Typography variant="h6">{item.title}</Typography>
          <StatusChip label={item.status} color={statusColors[item.status]} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
