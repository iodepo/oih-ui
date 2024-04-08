/* eslint-disable */

const trackingMatomo = (action, category, name) => {
  _paq.push(["trackEvent", category, action, name.replace(",", "[COMMA]")]);
};

const defaultMatomoPageView = () => {
  _paq.push(["trackPageView"]);
};

export { trackingMatomo, defaultMatomoPageView };
/* eslint-enable */
