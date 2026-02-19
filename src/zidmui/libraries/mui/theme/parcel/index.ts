import type {} from '@mui/lab/themeAugmentation';
import { components } from '@zidsa/zidmui/theme/components';
import { typography } from '@zidsa/zidmui/theme/typography';

import { createTheme } from '@mui/material/styles';

import { palette } from './palette';
import { paletteDark } from './palette-dark';
import { shadows } from './shadows';

//
//

export const themeParcel = createTheme({
  shape: {
    borderRadius: 8,
    standardBorderRadius: 12,
  },
  shadows,
  palette,
  typography,
  components,
});

export const themeParcelDark = createTheme({
  shape: {
    borderRadius: 8,
    standardBorderRadius: 12,
  },
  shadows,
  palette: paletteDark,
  typography,
  components,
});
