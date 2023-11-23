import createTheme from "@mui/material/styles/createTheme";

const font = "Montserrat, sans-serif, Roboto, Arial";
const DarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#662d91",
      dark: "#ff8f00",
    },
    info: {
      main: "#662d91",
      light: "#662d91",
      dark: "#662d91",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*::-webkit-scrollbar": {
          width: "12px",
        },
        "*::-webkit-scrollbar-track": {
          background: "#331a6b",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#382e44",
          borderRadius: "10px",
          outline: "1px solid",
          outlineColor: "#110025",
        },
      },
    },
  },
  typography: {
    allVariants: {
      fontFamily: font,
    },
  },
});
const LightTheme = createTheme({
  palette: {
    mode: "light",
    info: {
      main: "#2f253b",
      light: "#2f253b",
      dark: "#2f253b",
    },
    background: {
      default: "#FFFFFF",
    },
  },
  typography: {
    allVariants: {
      fontFamily: font,
    },
  },
});

export { DarkTheme, LightTheme };
