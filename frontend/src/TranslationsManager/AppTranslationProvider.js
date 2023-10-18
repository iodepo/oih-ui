import React, { useReducer } from "react";
import reducer from "./reducers/AppTranslationReducer";
import { AppTranslationUIStore } from "./context/AppTranslation";
import EnDataTranslation from "./stores/en.json";
import EsDataTranslation from "./stores/es.json";
import FrDataTranslation from "./stores/fr.json";
import RuDataTranslation from "./stores/ru.json";
import useCookies from "./useCookies";


const SupportedLangugesEnum = {
    Es: "Spanish",
    En: "English",
    Fr: "French",
    Ru: "Russian"
}
function AppTranslationProvider(props) {

    const { children } = props;
    let data;
    let key;

    data = EnDataTranslation;
    key = SupportedLangugesEnum.En;
    if (useCookies.getCookie("language") === "English") {
        data = EnDataTranslation;
        key = SupportedLangugesEnum.En;
    } else if (useCookies.getCookie("language") === "Russian") {
        data = RuDataTranslation;
        key = SupportedLangugesEnum.Ru;
    } else if (useCookies.getCookie("language") === "Spanish") {
        data = EsDataTranslation;
        key = SupportedLangugesEnum.Es;
    } else if (useCookies.getCookie("language") === "French") {
        data = FrDataTranslation;
        key = SupportedLangugesEnum.Fr;
    }

    const initialState = {
        translation: data,
        translationKey: key,
        translationOnCookies: Boolean(useCookies.getCookie("language")),
        updateTranslation: updateTranslation,
        getTranslationKey: getTranslationKey,
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    function updateTranslation(LanguageCode) {
        let translation = EnDataTranslation;
        let translationKey = SupportedLangugesEnum.En;

        switch (LanguageCode) {
            case SupportedLangugesEnum.Es:
                translation = EsDataTranslation;
                translationKey = SupportedLangugesEnum.Es;
                break;

            case SupportedLangugesEnum.En:
                translation = EnDataTranslation;
                translationKey = SupportedLangugesEnum.En;
                break;

            case SupportedLangugesEnum.Fr:
                translation = FrDataTranslation;
                translationKey = SupportedLangugesEnum.Fr;
                break;

            case SupportedLangugesEnum.Ru:
                translation = RuDataTranslation;
                translationKey = SupportedLangugesEnum.Ru;
                break;

            default:
                break;
        }

        useCookies.setCookie("language", translationKey);
        const action = {
            type: "UPDATE_TRANSLATION",
            payload: {
                translation,
                translationKey,
                translationOnCookies: Boolean(useCookies.getCookie("language")),
            },
        };

        // @ts-ignore
        dispatch(action);
    }

    function getTranslationKey() {
        return state.translationKey;
    }

    return (
        <AppTranslationUIStore.Provider
            value={{
                translation: state.translation,
                translationOnCookies: state.translationOnCookies,
                updateTranslation: updateTranslation,
                getTranslationKey: getTranslationKey,
            }}
        >
            {children}
        </AppTranslationUIStore.Provider>
    );
}

export { AppTranslationProvider, SupportedLangugesEnum };
