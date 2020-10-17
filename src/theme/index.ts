import { ColorModeOptions, extendTheme } from "@chakra-ui/core";
import styles from "./styles";
import foundation from "./foundation";

import Button from "./components/Button";
import Input from "./components/Input";
import Heading from "./components/Heading";
import Menu from "./components/Menu";

// Hide focus box shadow when not using keyboard
import "focus-visible/dist/focus-visible";

// Color mode settings
const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// Refer to: https://github.com/chakra-ui/chakra-ui/tree/master/packages/theme/src
const theme = extendTheme({
  ...foundation,
  styles,
  config,
  components: {
    Button,
    Input,
    Heading,
    Menu,
  },
});

export type Theme = typeof theme;

export default theme;
