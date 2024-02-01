import React, { useReducer } from "react";
import { SecondaryTheme, PrimaryTheme } from "../portability/themes";
import reducer from "./reducers/AppThemeReducer";
import useCookies from "./useCookies";
import { AppThemeUIStore } from "./context/AppTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

function AppThemeProvider(props) {
  const { children } = props;
  let theme;
  let themeKind;

  if (useCookies.getCookie("theme") === "secondary") {
    theme = SecondaryTheme;
    themeKind = "secondary";
  } else {
    theme = PrimaryTheme;
    themeKind = "primary";
  }

  const initialState = {
    theme: theme,
    themeKind: themeKind,
    setTheme: setTheme,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  function setTheme(themeKind) {
    let theme = SecondaryTheme;

    switch (themeKind) {
      case "secondary":
        theme = SecondaryTheme;
        break;
      case "primary":
        theme = PrimaryTheme;
        break;
      default:
        theme = SecondaryTheme;
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
