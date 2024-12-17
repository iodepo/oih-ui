import { createContext, useContext } from "react";

const initialState = {};

const AppTranslationUIStore = createContext(initialState);

function useAppTranslation() {
    return useContext(AppTranslationUIStore);
}

export { useAppTranslation, AppTranslationUIStore }