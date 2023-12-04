import createTheme from "@mui/material/styles/createTheme";

const font = "Montserrat, sans-serif, Roboto, Arial";
const DarkTheme = createTheme({
  palette: {
    mode: "dark",
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
    custom: {
      darkBlue: "#172B4D",
      azure: "#40AAD3",
    },
  },
  typography: {
    allVariants: {
      fontFamily: font,
    },
  },
});

export { DarkTheme, LightTheme };
