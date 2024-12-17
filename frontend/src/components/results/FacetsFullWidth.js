import React, {useCallback, useState} from "react";
import {fieldTitleFromName}  from '../../constants';

export default function FacetsFullWidth({
                                            facets,
                                            clearFacetQuery,
                                            facetSearch,
                                            facetValues, setFacetFacetValues
                                        }) {

    const setValue = (i, value) => setFacetFacetValues(values => [...values.slice(0, i), value, ...values.slice(i + 1, values.length)])
    const clear = useCallback(e => {
        setFacetFacetValues(new Array(facets.length).fill(""))
        clearFacetQuery()
    }, [clearFacetQuery, setValue])



    return (
        <div className="mt-4 w-75 mx-auto">
          <div className="ps-3 pe-3 w-75 mx-auto">
          </div>
          <div className="row">
            {facets.map((facet, i) => (
              <div
                className="col"
                key={i}>
                      <div>
                        <select
                          className="form-select form-select-md mb-3"
                          onChange={e => {
                              setValue(i, e.target.value);
                              facetSearch(e);
                          }}
                          value={facetValues[i]}
                          defaultValue=""
                        >
                          <option value="">{fieldTitleFromName(facet.name)}</option>
                          {facet.counts.map((facetCount) => (
                              <option
                                key={facetCount.name}
                                className={facet.name}
                                value={facetCount.value || facetCount.name}
                              >
                                {facetCount.name} ({facetCount.count})
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>
                )
                       )}
            <div className="col-1 pt-2">
              <button className="clear-btn text-uppercase fw-bold" onClick={clear}>
                Clear
              </button>
            </div>
          </div>
        </div>
    );
}
