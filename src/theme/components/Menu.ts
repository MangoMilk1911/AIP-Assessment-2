import { mode } from "@chakra-ui/theme-tools";

const baseStyle = function (props: Record<string, any>) {
  return {
    list: {
      borderRadius: "lg",
      borderWidth: mode(1, 0)(props),
      boxShadow: mode("lg", "none")(props),
    },
  };
};

export default {
  baseStyle,
};
