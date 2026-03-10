import type {} from '@mui/lab/themeAugmentation';
import { components } from '@zidsa/zidmui/theme/components';
import { typography } from '@zidsa/zidmui/theme/typography';
import { shadows } from '@zidsa/zidmui/theme/shadows';
import { palette } from '@zidsa/zidmui/theme/palette';

import { createTheme } from '@mui/material/styles';

//
//

export const themeParcelOptions = {
  shape: { borderRadius: 8, standardBorderRadius: 12 },
  shadows,
  palette,
  typography,
  components,
};

export const themeParcel = createTheme(themeParcelOptions);
