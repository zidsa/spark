import type {} from '@mui/lab/themeAugmentation';
import { colors } from '@zidsa/zidmui/theme/colors';

import type { ThemeOptions } from '@mui/material/styles';

import { paletteDarkComponents } from './palette-dark-components';

//
//

export const paletteDark: ThemeOptions['palette'] = {
  mode: 'dark',
  badge: {
    primary: {
      color: '#D2B8FF',
      backgroundColor: '#2E1641',
    },
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    darkBackdrop: '#000000cc',
    white: '#1E1E1E',
    black: '#FFFFFF',
    gray: '#1E1E1E',
    gray200: '#333333',
    gray100: '#2A2A2A',
    backgroundDisable: '#2A2A2A',
    Blur: 'rgba(0, 0, 0, 0.8)',
    green: '#1B3A19',
    yellow: '#3A3520',
    royal: '#3E1C56',
    mintGreen: '#1B3A19',
    goldenYellow: '#3A3520',
    lavenderGlow: '#4E3372',
    royalPurple: '#2E1641',
  },
  outlined: {
    outlined: '#333333',
    'outlined 2': '#2A2A2A',
    outlinedDisable: '#666666',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#808080',
    disabled: '#666666',
    deepGreen: '#9EEC98',
    darkOchre: '#F9E683',
    contrastText: '#666666',
    primaryContrastTest: '#0E0217',
    _states: {
      focusVisible: 'rgba(255, 255, 255, 0.3)',
    },
  },
  icon: {
    primary: '#FFFFFF',
    secondary: '#808080',
    disabled: '#666666',
    draggable: '#8A7798',
  },
  tabs: {
    text: {
      secondary: '#B3B3B3',
    },
  },
  _states: {
    focus: 'rgba(255, 255, 255, 0.12)',
    hover: 'rgba(96, 203, 203, 0.08)',
    selected: 'rgba(96, 203, 203, 0.16)',
    focusVisible: 'rgba(96, 203, 203, 0.3)',
    outlinedBorder: 'rgba(96, 203, 203, 0.5)',
  },
  primary: {
    main: '#AE72FF',
    dark: '#8758C6',
    light: '#D2B8FF',
    contrastText: '#FFFFFF',
    _states: {
      hover: 'rgba(174, 114, 255, 0.08)',
      selected: 'rgba(174, 114, 255, 0.16)',
      focus: 'rgba(174, 114, 255, 0.12)',
      focusVisible: 'rgba(174, 114, 255, 0.3)',
      outlinedBorder: 'rgba(174, 114, 255, 0.5)',
    },
  },
  secondary: {
    main: '#8A7798',
    dark: '#3C1C54',
    light: '#D2B8FF',
    contrastText: '#FFFFFF',
    _states: {
      hover: 'rgba(138, 119, 152, 0.08)',
      selected: 'rgba(138, 119, 152, 0.16)',
      focus: 'rgba(138, 119, 152, 0.12)',
      focusVisible: 'rgba(138, 119, 152, 0.3)',
      outlinedBorder: 'rgba(138, 119, 152, 0.5)',
    },
  },
  action: {
    active: 'rgba(255, 255, 255, 0.56)',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    focus: 'rgba(255, 255, 255, 0.12)',
    disabled: 'rgba(255, 255, 255, 0.38)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
  error: {
    main: '#FA3768',
    dark: '#C22B51',
    light: '#FCA7B4',
    contrastText: '#FFFFFF',
    _states: {
      hover: 'rgba(250, 55, 104, 0.08)',
      selected: 'rgba(250, 55, 104, 0.16)',
      focusVisible: 'rgba(250, 55, 104, 0.3)',
      outlinedBorder: 'rgba(250, 55, 104, 0.5)',
    },
  },
  warning: {
    main: '#F9E683',
    dark: '#DFCE75',
    light: '#FBF0BF',
    contrastText: '#6F673B',
    _states: {
      hover: 'rgba(193, 178, 101, 0.08)',
      selected: 'rgba(193, 178, 101, 0.16)',
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
      hover: 'rgba(46, 125, 50, 0.08)',
    },
  },
  divider: '#333333',
  _components: paletteDarkComponents,
  _native: {
    'scrollbar-bg': '#333333',
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
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
    },
  },
  colors,
};
