/* eslint-disable */

const trackingMatomo = (action, category, name) => {
  console.log("trackEvent", category, action, name.replace(",", "[COMMA]"));
  _paq.push(["trackEvent", category, action, name.replace(",", "[COMMA]")]);
};

const defaultMatomoPageView = () => {
  var _paq = (window._paq = window._paq || []);
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  (function () {
    var u = "//matomo.trust-it.it/";
    _paq.push(["setTrackerUrl", u + "matomo.php"]);
    _paq.push(["setSiteId", "1"]);
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = u + "matomo.js";
    s.parentNode.insertBefore(g, s);
  })();
};

export { trackingMatomo, defaultMatomoPageView };
/* eslint-enable */
