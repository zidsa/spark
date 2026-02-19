import type {} from '@mui/lab/themeAugmentation';
import { colors } from '@zidsa/zidmui/theme/colors';

import type { ThemeOptions } from '@mui/material/styles';

import { paletteComponents } from './palette-components';

//
//

export const palette: ThemeOptions['palette'] = {
  mode: 'light',
  badge: {
    primary: {
      color: '#8758C6',
      backgroundColor: '#F1EAFF',
    },
  },
  background: {
    default: '#F8F8F8',
    paper: colors.base.white,
    darkBackdrop: '#b1afafcc',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#F8F8F8',
    gray200: '#E4E4E5',
    gray100: '#F2F2F2',
    backgroundDisable: '#F2F2F2',
    Blur: 'rgba(255, 255, 255, 0.8)',
    green: '#9EEC99',
    yellow: '#FAE684',
    royal: '#3E1C56',
    mintGreen: '#84DA7E',
    goldenYellow: '#EAD469',
    lavenderGlow: '#C498FF',
    royalPurple: '#532D6F',
  },
  outlined: {
    outlined: '#E4E4E5',
    'outlined 2': '#F2F2F2',
    outlinedDisable: '#A3A1A6',
  },
  text: {
    primary: '#0E0217',
    secondary: '#1F0433',
    tertiary: '#75727B',
    disabled: '#A3A1A6',
    deepGreen: '#1F541B',
    darkOchre: '#544217',
    contrastText: '#A3A1A6',
    primaryContrastTest: '#FFFFFF',
    _states: {
      focusVisible: 'rgba(0, 0, 0, 0.3)',
    },
  },
  icon: {
    primary: '#0E0217',
    secondary: '#75727B',
    disabled: '#A3A1A6',
    draggable: '#634976',
  },
  tabs: {
    text: {
      secondary: '#1B0D26',
    },
  },
  _states: {
    focus: 'rgba(0, 0, 0, 0.12)',
    hover: 'rgba(96, 203, 203, 0.04)',
    selected: 'rgba(96, 203, 203, 0.08)',
    focusVisible: 'rgba(96, 203, 203, 0.3)',
    outlinedBorder: 'rgba(96, 203, 203, 0.5)',
  },
  primary: {
    main: '#AE72FF',
    dark: '#8758C6',
    light: '#D2B8FF',
    contrastText: '#FFFFFF',
    _states: {
      hover: 'rgba(174, 114, 255, 0.04)',
      selected: 'rgba(174, 114, 255, 0.08)',
      focus: 'rgba(174, 114, 255, 0.12)',
      focusVisible: 'rgba(174, 114, 255, 0.3)',
      outlinedBorder: 'rgba(174, 114, 255, 0.5)',
    },
  },
  secondary: {
    main: '#3C1C54',
    dark: '#2E1641',
    light: '#8A7798',
    contrastText: '#FFFFFF',
    _states: {
      hover: 'rgba(60, 28, 84, 0.04)',
      selected: 'rgba(60, 28, 84, 0.08)',
      focus: 'rgba(60, 28, 84, 0.12)',
      focusVisible: 'rgba(60, 28, 84, 0.3)',
      outlinedBorder: 'rgba(60, 28, 84, 0.5)',
    },
  },
  action: {
    active: 'rgba(31, 4, 51, 0.56)',
    hover: 'rgba(31, 4, 51, 0.04)',
    selected: 'rgba(31, 4, 51, 0.08)',
    focus: 'rgba(31, 4, 51, 0.12)',
    disabled: 'rgba(31, 4, 51, 0.38)',
    disabledBackground: 'rgba(31, 4, 51, 0.12)',
  },
  error: {
    main: '#FA3768',
    _states: {
      hover: 'rgba(250, 55, 104, 0.04)',
      selected: 'rgba(250, 55, 104, 0.08)',
      focusVisible: 'rgba(250, 55, 104, 0.3)',
      outlinedBorder: 'rgba(250, 55, 104, 0.5)',
    },
    dark: '#C22B51',
    light: '#FCA7B4',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F9E683',
    dark: '#DFCE75',
    light: '#FBF0BF',
    contrastText: '#6F673B',
    _states: {
      hover: 'rgba(193, 178, 101, 0.04)',
      selected: 'rgba(193, 178, 101, 0.08)',
      focusVisible: 'rgba(193, 178, 101, 0.3)',
      outlinedBorder: 'rgba(193, 178, 101, 0.5)',
    },
  },
  info: {
    main: '#60CBCB',
    dark: '#449090',
    light: '#95E9E9',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#9EEC98',
    dark: '#649560',
    light: '#DDF8DC',
    contrastText: '#000000',
    _states: {
      outlinedBorder: 'rgba(46, 125, 50, 0.5)',
      focusVisible: 'rgba(46, 125, 50, 0.3)',
      hover: 'rgba(46, 125, 50, 0.04)',
    },
  },
  divider: '#F4F3F5',
  _components: paletteComponents,
  _native: {
    'scrollbar-bg': '#E4E4E5',
  },
  common: {
    black: '#000000',
    white: '#FFFFFF',
    white_states: {
      main: '#FFFFFF',
      focusVisible: 'rgba(255, 255, 255, 0.3)',
      focus: 'rgba(255, 255, 255, 0.12)',
    },
    black_states: {
      focus: 'rgba(0, 0, 0, 0.12)',
      hover: ' rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
    },
  },
  colors,
};
