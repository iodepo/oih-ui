/* eslint-disable */

const trackingMatomo = (action, category, name) => {
  _paq.push(["trackEvent", category, action, name.replace(",", "[COMMA]")]);
};

const defaultMatomoPageView = (isHome = false) => {
  !isHome && _paq.push(["setCustomUrl", window.location.href]);
  _paq.push(["trackPageView"]);
};

export { trackingMatomo, defaultMatomoPageView };
/* eslint-enable */
