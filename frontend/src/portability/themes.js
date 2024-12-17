import createTheme from "@mui/material/styles/createTheme";
import { backgroundImage, primaryPalette } from "./configuration";

const font = "Montserrat, sans-serif, Roboto, Arial";
const PrimaryTheme = createTheme({
  palette: {
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

export { SecondaryTheme, PrimaryTheme };
