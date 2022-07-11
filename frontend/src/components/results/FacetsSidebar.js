import React from "react";

export default function FacetsSidebar({facets, clearFacetQuery, facetSearch}){
    return (
        <div id="resultsFacets">
          <div id='factsHeading'>
            <h3><b>Filter By:</b></h3>
            <a id='clearFacet' onClick={clearFacetQuery}>Clear</a>
          </div>
          {
              facets.map((facet, i) => {
                  return (
                      <div key={i}>
                        <h6>{facet.name.substring(4)}</h6>
                        <select className="form-select form-select-md mb-3" onChange={facetSearch}>
                          <option>--- Select to search facet ---</option>
                          {facet.counts.map((facetCount) =>
                                            <option key={facetCount.name} className={facet.name} value={facetCount.name}>
                                              {facetCount.name} ({facetCount.count})
                                            </option>
                                           )}
                        </select>
                      </div>
                  );
              })
          }
        </div>
    );
}
