import { SupportedLangugesEnum } from "TranslationsManager/AppTranslationProvider";
import { useAppTranslation } from "TranslationsManager/context/AppTranslation";
import useCookies from "TranslationsManager/useCookies";

export default function Footer() {
    const translationState = useAppTranslation();

    const changeTranslation = (languageCode) => {
        translationState.updateTranslation(languageCode);
    };
    return (
        <div className="mt-auto ml-5 pt-5 mb-0 pb-5 text-light footer__container w-25">
            <select
                className="form-select w-50 rounded-0"
                value={
                    useCookies.getCookie("language")
                        ? useCookies.getCookie("language")
                        : SupportedLangugesEnum.En
                }
                name="languageChoice"
                onChange={(e) => changeTranslation(e.target.value)}
            >
                <option key={SupportedLangugesEnum.En} value={SupportedLangugesEnum.En}>
                    {SupportedLangugesEnum.En}
                </option>
                <option key={SupportedLangugesEnum.Es} value={SupportedLangugesEnum.Es}>
                    {SupportedLangugesEnum.Es}
                </option>
                <option key={SupportedLangugesEnum.Ru} value={SupportedLangugesEnum.Ru}>
                    {SupportedLangugesEnum.Ru}
                </option>
                <option key={SupportedLangugesEnum.Fr} value={SupportedLangugesEnum.Fr}>
                    {SupportedLangugesEnum.Fr}
                </option>
            </select>
        </div>
    );
}
