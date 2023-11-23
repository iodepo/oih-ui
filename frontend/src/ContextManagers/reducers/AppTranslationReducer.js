

const AppTranslationAction = {
    updateTranslation: "UPDATE_TRANSLATION"
};

function reducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case AppTranslationAction.updateTranslation:
            return {
                ...state,
                translation: payload.translation,
                translationKey: payload.translationKey,
                translationOnCookies: payload.translationOnCookies,
            };

        default:
            return state;
    }
}

export default reducer;