import createTheme from "@mui/material/styles/createTheme";
import { backgroundImage, primaryPalette } from "./constants";

const font = "Montserrat, sans-serif, Roboto, Arial";
const PrimaryTheme = createTheme({
  palette: {
    mode: "light",
    custom: primaryPalette,
  },
  typography: {
    allVariants: {
      fontFamily: font,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: backgroundImage,
    },
  },
});
const SecondaryTheme = createTheme({
  palette: {
    mode: "dark",
  },

  typography: {
    allVariants: {
      fontFamily: font,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: backgroundImage,
    },
  },
});

export { SecondaryTheme, PrimaryTheme };
