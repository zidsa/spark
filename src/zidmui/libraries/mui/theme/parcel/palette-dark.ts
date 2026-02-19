import type {} from '@mui/lab/themeAugmentation';
import { colors } from '@zidsa/zidmui/theme/colors';

import type { ThemeOptions } from '@mui/material/styles';

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
  _components: {
    sliderIndicator: {
      background: 'rgba(0, 0, 0, 0.2)',
      active: 'rgba(255, 255, 255, 1)',
      inactive: 'rgba(255, 255, 255, 0.5)',
    },
    cardContent: {
      selected: {
        background: '#2E1641',
        border: '#4E3372',
      },
    },
    emptyState: {
      imageBackground: 'rgba(255, 255, 255, 0.04)',
    },
    navbar: {
      wallet: {
        background: '#2E1641',
        border: '#4E3372',
        text: '#FFFFFF',
      },
      search: {
        searchBorder: '#333333',
        searchBackground: '#1E1E1E',
      },
    },
    avatar: {
      fill: '#666666',
    },
    input: {
      _states: {
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        focusVisible: 'rgba(255, 255, 255, 0.3)',
      },
      outlined: {
        enabledBorder: '#333333',
        hoverBorder: '#4D4D4D',
      },
    },
    switch: {
      knobFillEnabled: '#333333',
      slideFill: '#666666',
      knowFillDisabled: '#2A2A2A',
      shadow: '#333333',
      color: '#AE72FF',
      background: '#1E1E1E',
      error: {
        activeBackground: '#FA3768',
        pressedBackground: '#C22B51',
        shadow: 'rgba(250, 55, 104, 0.5)',
      },
      primary: {
        activeBackground: '#9EEC98',
        pressedBackground: '#649560',
        shadow: 'rgba(46, 125, 50, 0.5)',
      },
    },
    chip: {
      desert: '#3A3520',
    },
    backdrop: {
      fill: 'rgba(0, 0, 0, 0.5)',
    },
    appBar: {
      defaultFill: '#1E1E1E',
    },
    alert: {
      error: {
        color: '#FCA7B4',
        border: '#C22B51',
        background: '#3A1525',
      },
      warning: {
        color: '#F9E683',
        border: '#DFCE75',
        background: '#3A3520',
      },
      info: {
        color: '#95E9E9',
        border: '#449090',
        background: '#1A3333',
      },
      success: {
        color: '#9EEC98',
        border: '#649560',
        background: '#1B3A19',
      },
    },
    stepper: {
      connector: '#666666',
    },
    button: {
      disabledText: '#666666',
      disabledBorder: '#333333',
      primaryDarkText: {
        disabled: '#2A2A2A',
        text: '#D2B8FF',
        loadingText: '#D2B8FF',
      },
      primary: {
        contained: colors.primary[1000],
        hover: colors.primary[900],
        focused: colors.primary[900],
        pressed: colors.primary[600],
        disabled: '#2A2A2A',
        border: '#333333',
        text: colors.base.white,
        loadingText: '#D2B8FF',
      },
      secondary: {
        contained: '#2A2A2A',
        hover: '#333333',
        focused: '#2E1641',
        pressed: '#333333',
        disabled: '#2A2A2A',
        border: '#4D4D4D',
        text: '#FFFFFF',
        loadingText: '#FFFFFF',
      },
      tertiary: {
        contained: '#1E1E1E',
        hover: '#2E1641',
        focused: '#2E1641',
        pressed: '#4E3372',
        disabled: '#2A2A2A',
        text: '#FFFFFF',
        loadingText: '#FFFFFF',
        outlinedHover: '#4E3372',
        outlinedText: '#D2B8FF',
      },
      error: {
        contained: '#3A1525',
        hover: '#C22B51',
        focused: '#FA3768',
        pressed: '#C22B51',
        disabled: '#2A2A2A',
        border: '#C22B51',
        text: '#FCA7B4',
        outlinedHover: '#3A1525',
        outlinedText: '#FA3768',
        activeBorder: '#FA3768',
        loadingText: '#FFFFFF',
      },
    },
    iconButton: {
      default: {
        hover: '#ffffff1f',
      },
      primary: {
        text: '#D2B8FF',
        focused: '#ae72ff4d',
        hover: '#2E1641',
        focusedIcon: '#ae72ff',
      },
      secondary: {
        text: '#FFFFFF',
        focused: '#8a77984d',
        hover: '#2A2A2A',
        focusedIcon: '#ae72ff',
      },
      error: {
        text: '#FFFFFF',
        focused: '#fa37684d',
        hover: '#2A2A2A',
        focusedIcon: '#fa3768',
      },
    },
  },
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
