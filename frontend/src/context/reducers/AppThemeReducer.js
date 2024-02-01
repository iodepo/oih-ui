const AppThemeAction = {
  updateTheme: "UPDATE_THEME",
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case AppThemeAction.updateTheme:
      return {
        ...state,
        theme: payload.theme,
        themeKind: payload.themeKind,
      };

    default:
      return state;
  }
}

export default reducer;
