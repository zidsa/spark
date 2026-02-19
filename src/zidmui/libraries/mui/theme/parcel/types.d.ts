import '@mui/material';

import type { ComponentsPalette } from './types-components';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    primaryDark: true;
    primaryLight: true;
    tertiary: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsSizeOverrides {
    extraSmall: true;
  }
}
declare module '@mui/material/Radio' {
  interface RadioPropsSizeOverrides {
    small: true;
    medium: true;
    large: true;
  }
}

declare module '@mui/lab' {
  interface TimelineProps {
    noOppositeContent?: boolean;
  }
}

declare module '@mui/material/styles' {
  interface CommonColors {
    black_states: {
      hover: string;
      selected: string;
      focus: string;
    };
    white_states: {
      main: string;
      focusVisible: string;
      focus: string;
    };
  }
  interface Theme {
    shape: {
      borderRadius: number;
      standardBorderRadius: number;
    };
  }
  interface ThemeOptions {
    shape?: {
      borderRadius: number;
      standardBorderRadius: number;
    };
  }

  interface CustomPalette {
    badge: {
      primary: {
        color: string;
        backgroundColor: string;
      };
    };
    outlined?: {
      outlined?: string;
      'outlined 2'?: string;
      outlinedDisable?: string;
    };
    tabs: {
      text: {
        secondary: string;
      };
    };
    icon: {
      primary: string;
      secondary: string;
      disabled: string;
      draggable: string;
    };
    _states: {
      focus: string;
      hover: string;
      selected: string;
      focusVisible: string;
      outlinedBorder: string;
    };

    _components: ComponentsPalette;
    _native: {
      'scrollbar-bg': string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- MUI module augmentation
  interface PaletteOptions extends CustomPalette {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- MUI module augmentation
  interface Palette extends CustomPalette {}

  //

  type ColorShadesKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
  interface Colors {
    base: {
      white: string;
      neutral: string;
      silver: string;
      black: string;
    };
    primary: { [key in ColorShadesKey]: string };
    secondary: { [key in ColorShadesKey]: string };
    neutral: { [key in ColorShadesKey]: string };
    green: { [key in ColorShadesKey]: string };
    blue: { [key in ColorShadesKey]: string };
    yellow: { [key in ColorShadesKey]: string };
    orange: { [key in ColorShadesKey]: string };
    red: { [key in ColorShadesKey]: string };
  }

  //

  interface Palette {
    colors: Colors;
  }

  interface PaletteOptions {
    colors: Colors;
  }

  //
  interface TypeText {
    tertiary: string;
    deepGreen: string;
    darkOchre: string;
    contrastText: string;
    primaryContrastTest: string;
    _states: {
      focusVisible: string;
    };
  }

  interface CommonColors {
    white_states: {
      main: string;
      focusVisible: string;
    };
    black_states: {
      focus: string;
    };
  }
  interface TypeBackground {
    white: string;
    black: string;
    gray: string;
    gray200: string;
    gray100: string;
    backgroundDisable: string;
    darkBackdrop: string;
    Blur: string;
    green: string;
    yellow: string;
    royal: string;
    mintGreen: string;
    goldenYellow: string;
    lavenderGlow: string;
    royalPurple: string;
  }
  interface SimplePaletteColorOptions {
    _states?: {
      hover?: string;
      selected?: string;
      focus?: string;
      focusVisible?: string;
      outlinedBorder?: string;
    };
  }
  interface PaletteColor {
    _states?: {
      hover?: string;
      selected?: string;
      focus?: string;
      focusVisible?: string;
      outlinedBorder?: string;
    };
  }
}
