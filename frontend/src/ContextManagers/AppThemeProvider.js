import React, { useReducer } from "react";
import { DarkTheme, LightTheme } from "./stores/themes";
import reducer from "./reducers/AppThemeReducer";
import useCookies from "./useCookies";
import { AppThemeUIStore } from "./context/AppTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

function AppThemeProvider(props) {
  const { children } = props;
  let theme;
  let themeKind;

  if (useCookies.getCookie("theme") === "dark") {
    theme = DarkTheme;
    themeKind = "dark";
  } else {
    theme = LightTheme;
    themeKind = "light";
  }

  const initialState = {
    theme: theme,
    themeKind: themeKind,
    setTheme: setTheme,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  function setTheme(themeKind) {
    let theme = DarkTheme;

    switch (themeKind) {
      case "dark":
        theme = DarkTheme;
        break;
      case "light":
        theme = LightTheme;
        break;
      default:
        theme = DarkTheme;
        break;
    }
    useCookies.setCookie("theme", themeKind);
    const action = {
      type: "UPDATE_THEME",
      payload: {
        theme: theme,
        themeKind: themeKind,
      },
    };

    // @ts-ignore
    dispatch(action);
  }

  return (
    <AppThemeUIStore.Provider
      value={{
        theme: state.theme,
        themeKind: state.themeKind,
        setTheme: setTheme,
      }}
    >
      <ThemeProvider theme={state.theme}>{children}</ThemeProvider>
    </AppThemeUIStore.Provider>
  );
}

export { AppThemeProvider };
