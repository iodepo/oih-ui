import { createContext, useContext } from "react";

const initialState = {};

const AppThemeUIStore = createContext(initialState);

function useAppTheme() {
  return useContext(AppThemeUIStore);
}

export { useAppTheme, AppThemeUIStore };
