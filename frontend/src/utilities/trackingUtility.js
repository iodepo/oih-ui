/* eslint-disable */
const trackingMatomoSearch = (searchValue, regionValue, resultCount) => {
  console.log(
    "Search performed.\nSearch: " + searchValue + " \nRegion: " + regionValue
  );
  //trackSiteSearch(keyword, [category], [resultsCount]);
  _paq.push([
    "trackSiteSearch",
    // Search keyword searched for
    searchValue,
    // Search category selected in your search engine. If you do not need this, set to false
    regionValue,
    // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
    resultCount ? resultCount : "false",
  ]);
  _paq.push(["trackEvent", "click", "click_on_search", searchValue]);
};

const trackingMatomoClickResults = (url, cd1, cd2, cd3) => {
  //console.log("Click on search results performed: " + url);
  _paq.push([
    "trackEvent",
    "click",
    "click_on_result",
    url,
    ,
    { dimension1: cd1, dimension2: cd2, dimension3: cd3 },
  ]);
};

const trackingMatomo = (action, category, searchTerm, region) => {
  switch (action) {
    case "simple_search":
      break;
    case "advanced_search":
      break;
    case "sorted_search":
      break;
    case "refined_search":
      break;
    case "change_result_page":
      break;
    case "click_on_result":
      break;
    case "click_on_jsonld":
      break;
    case "page_refresh":
      break;
  }
};

export { trackingMatomoSearch, trackingMatomoClickResults, trackingMatomo };
/* eslint-enable */
