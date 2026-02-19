import type { ReactNode } from 'react';

import { AppTypography } from '@zidsa/zidmui/components/app-typography';

import Box from '@mui/material/Box';

//
//

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const PageContainer = ({ title, subtitle, children, actions }: PageContainerProps) => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <AppTypography variant="h4" component="h1" gutterBottom>
            {title}
          </AppTypography>

          {subtitle && (
            <AppTypography variant="body1" color="text.secondary">
              {subtitle}
            </AppTypography>
          )}
        </Box>

        {actions && <Box>{actions}</Box>}
      </Box>
      {children}
    </Box>
  );
};
