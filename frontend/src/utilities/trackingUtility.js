/* eslint-disable */

const trackingMatomo = (action, category, name) => {
  console.log("trackEvent", category, action, name.replace(",", "[COMMA]"));
  _paq.push(["trackEvent", category, action, name.replace(",", "[COMMA]")]);
};

export { trackingMatomo };
/* eslint-enable */
