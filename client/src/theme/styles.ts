import { mode, Styles } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: (props) => ({
    body: {
      background: mode("primary.50", "primary.900")(props),
      color: mode("primary.700", "primary.50")(props),
    },
  }),
};

export default styles;
