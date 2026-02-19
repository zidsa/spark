import { colors } from '@zidsa/zidmui/theme/colors';

import type { ComponentsPalette } from './types-components';

export const paletteDarkComponents: ComponentsPalette = {
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
};
