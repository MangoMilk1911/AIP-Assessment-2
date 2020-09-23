import { getColor, mode, transparentize } from "@chakra-ui/theme-tools";

function getDefaults(props: Record<string, any>) {
  const { focusBorderColor: fc, errorBorderColor: ec } = props;
  return {
    focusBorderColor: fc || mode("primary.500", "primary.300")(props),
    errorBorderColor: ec || mode("red.500", "red.300")(props),
  };
}

function variantOutline(props: Record<string, any>) {
  const { theme } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  return {
    field: {
      border: "1px solid",
      borderColor: mode("inherit", "whiteAlpha.50")(props),
      bg: mode("white", "whiteAlpha.100")(props),
      _hover: {
        borderColor: mode("primary.200", "whiteAlpha.200")(props),
      },
      _readOnly: {
        boxShadow: "none !important",
        userSelect: "all",
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
      _focus: {
        zIndex: 1,
        borderColor: getColor(theme, fc),
        boxShadow: `0 0 0 1px ${getColor(theme, fc)}`,
      },
      _invalid: {
        borderColor: getColor(theme, ec),
        boxShadow: `0 0 0 1px ${getColor(theme, ec)}`,
      },
    },
    addon: {
      border: "1px solid",
      borderColor: mode("inherit", "whiteAlpha.50")(props),
      bg: mode("gray.100", "whiteAlpha.300")(props),
    },
  };
}

function variantFilled(props: Record<string, any>) {
  const { theme } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  const bg = transparentize("primary.500", 0.2)(theme);
  const bgHover = transparentize("primary.500", 0.3)(theme);

  return {
    field: {
      border: "2px solid",
      borderColor: "transparent",
      bg: mode(bg, "whiteAlpha.100")(props),
      _hover: {
        bg: mode(bgHover, "whiteAlpha.200")(props),
      },
      _readOnly: {
        boxShadow: "none !important",
        userSelect: "all",
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
      _focus: {
        bg: "transparent",
        borderColor: getColor(theme, fc),
      },
      _invalid: {
        borderColor: getColor(theme, ec),
      },
    },
    addon: {
      border: "2px solid",
      borderColor: "transparent",
      bg: mode("gray.100", "whiteAlpha.50")(props),
    },
  };
}

export default {
  variants: {
    filled: variantFilled,
    outline: variantOutline,
  },
  defaultProps: {
    variant: "filled",
  },
};
