export interface ComponentsPalette {
  sliderIndicator: {
    background: string;
    active: string;
    inactive: string;
  };
  cardContent: {
    selected: {
      background: string;
      border: string;
    };
  };
  emptyState: {
    imageBackground: string;
  };
  navbar: {
    wallet: {
      background: string;
      border: string;
      text: string;
    };
    search: {
      searchBorder: string;
      searchBackground: string;
    };
  };
  avatar: {
    fill: string;
  };
  input: {
    _states: {
      hover: string;
      selected: string;
      focusVisible: string;
    };
    outlined: {
      enabledBorder: string;
      hoverBorder: string;
    };
  };
  switch: {
    knobFillEnabled: string;
    slideFill: string;
    knowFillDisabled: string;
    shadow: string;
    color: string;
    background: string;
    primary: {
      activeBackground: string;
      pressedBackground: string;
      shadow: string;
    };
    error: {
      activeBackground: string;
      pressedBackground: string;
      shadow: string;
    };
  };
  chip: {
    desert: string;
  };
  backdrop: {
    fill: string;
  };
  appBar: {
    defaultFill: string;
  };
  alert: {
    error: {
      color: string;
      border: string;
      background: string;
    };
    warning: {
      color: string;
      border: string;
      background: string;
    };
    info: {
      color: string;
      border: string;
      background: string;
    };
    success: {
      color: string;
      border: string;
      background: string;
    };
  };
  stepper: {
    connector: string;
  };
  button: {
    disabledText: string;
    disabledBorder: string;
    primaryDarkText: {
      disabled: string;
      text: string;
      loadingText: string;
    };
    primary: {
      contained?: string;
      hover: string;
      focused: string;
      pressed: string;
      disabled: string;
      border: string;
      text: string;
      loadingText: string;
    };
    secondary: {
      contained?: string;
      hover: string;
      focused: string;
      pressed: string;
      disabled: string;
      border: string;
      text: string;
      loadingText: string;
    };
    tertiary: {
      contained: string;
      hover: string;
      focused: string;
      pressed: string;
      disabled: string;
      text: string;
      outlinedHover: string;
      outlinedText: string;
      loadingText: string;
    };
    error: {
      contained?: string;
      hover: string;
      focused: string;
      pressed: string;
      disabled: string;
      border: string;
      text: string;
      outlinedHover: string;
      outlinedText: string;
      activeBorder: string;
      loadingText: string;
    };
  };
  iconButton: {
    default: {
      hover: string;
    };
    primary: {
      text: string;
      focused: string;
      hover: string;
      focusedIcon: string;
    };
    secondary: {
      text: string;
      focused: string;
      hover: string;
      focusedIcon: string;
    };
    error: {
      text: string;
      focused: string;
      hover: string;
      focusedIcon: string;
    };
  };
}
