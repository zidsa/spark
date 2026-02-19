import { colors } from '@zidsa/zidmui/theme/colors';

import type { ComponentsPalette } from './types-components';

export const paletteComponents: ComponentsPalette = {
  sliderIndicator: {
    background: 'rgba(255, 255, 255, 0.2)',
    active: 'rgba(255, 255, 255, 1)',
    inactive: 'rgba(255, 255, 255, 0.8)',
  },
  cardContent: {
    selected: {
      background: '#FBF9FF',
      border: '#E2D2FF',
    },
  },
  emptyState: {
    imageBackground: 'rgba(0, 0, 0, 0.04)',
  },
  navbar: {
    wallet: {
      background: '#F8F5FF',
      border: '#EBE8ED',
      text: '#1B0D26',
    },
    search: {
      searchBorder: '#EFEFF1',
      searchBackground: '#FBFBFB',
    },
  },
  avatar: {
    fill: '#A3A1A6',
  },
  input: {
    _states: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      focusVisible: 'rgba(0, 0, 0, 0.3)',
    },
    outlined: {
      enabledBorder: '#EBE8ED',
      hoverBorder: '#D8D2DD',
    },
  },
  switch: {
    knobFillEnabled: '#F8F8F8',
    slideFill: '#C6C6C8',
    knowFillDisabled: '#F2F2F2',
    shadow: '#E4E4E5',
    color: '#AE72FF',
    background: '#FFFFFF',
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
    desert: '#FDF5D6',
  },
  backdrop: {
    fill: 'rgba(0, 0, 0, 0.1)',
  },
  appBar: {
    defaultFill: '#F2F2F2',
  },
  alert: {
    error: {
      color: '#70192F',
      border: '#FDC9D0',
      background: '#FFF3F4',
    },
    warning: {
      color: '#6F673B',
      border: '#FAEBA4',
      background: '#FEFDF5',
    },
    info: {
      color: '#306666',
      border: '#B5EFEF',
      background: '#F4FCFC',
    },
    success: {
      color: '#476A44',
      border: '#CAF4C8',
      background: '#F7FDF7',
    },
  },
  stepper: {
    connector: '#A3A1A6',
  },
  button: {
    disabledText: '#A3A1A6',
    disabledBorder: '#E4E4E5',
    primaryDarkText: {
      disabled: '#F2F2F2',
      text: '#8758C6',
      loadingText: '#8758C6',
    },
    primary: {
      contained: colors.primary[1000],
      hover: colors.primary[900],
      focused: colors.primary[900],
      pressed: colors.primary[600],
      disabled: '#F2F2F2',
      border: '#EBE8ED',
      text: colors.base.white,
      loadingText: '#4E3372',
    },
    secondary: {
      contained: '#F4F3F5',
      hover: '#F4F3F5',
      focused: '#F1EAFF',
      pressed: '#EBE8ED',
      disabled: '#F2F2F2',
      border: '#D8D2DD',
      text: '#1B0D26',
      loadingText: '#1B0D26',
    },
    tertiary: {
      contained: colors.base.white,
      hover: colors.primary[200],
      focused: colors.primary[200],
      pressed: colors.primary[300],
      disabled: '#F2F2F2',
      text: '#1B0D26',
      loadingText: '#1B0D26',
      outlinedHover: '#E0D3FF',
      outlinedText: '#4E3372',
    },
    error: {
      contained: '#FEE5E9',
      hover: '#FDC9D0',
      focused: '#FA3768',
      pressed: '#FDC9D0',
      disabled: '#F2F2F2',
      border: '#FCA7B4',
      text: '#70192F',
      outlinedHover: '#FFF3F4',
      outlinedText: '#C22B51',
      activeBorder: '#E0315D',
      loadingText: '#1B0D26',
    },
  },
  iconButton: {
    default: {
      hover: '#0000001f',
    },
    primary: {
      text: '#4E3372',
      focused: '#ae72ff4d',
      hover: '#FBF9FF',
      focusedIcon: '#ae72ff',
    },
    secondary: {
      text: '#1B0D26',
      focused: '#3c1c544d',
      hover: '#F4F3F5',
      focusedIcon: '#ae72ff',
    },
    error: {
      text: '#1B0D26',
      focused: '#fa37684d',
      hover: '#F4F3F5',
      focusedIcon: '#ae72ff',
    },
  },
};
