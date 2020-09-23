import { extendTheme } from "@chakra-ui/core";
import Button from "./components/Button";
import Input from "./components/Input";
import styles from "./styles";

export default extendTheme({
  styles,
  colors: {
    primary: {
      50: "#ffe7eb",
      100: "#f6bdc7",
      200: "#eb949f",
      300: "#e16a74",
      400: "#d84158",
      500: "#be2848",
      600: "#951e40",
      700: "#6b1434",
      800: "#420a22",
      900: "#1c000f",
    },
  },
  components: {
    Button,
    Input,
  },
});
