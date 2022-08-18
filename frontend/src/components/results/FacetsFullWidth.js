import React, {useCallback, useState} from "react";

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


    const fieldNameMap = {
        "includedindatacatalog": "Catalog",
        "jobtitle": "Job Title",
        "knowsabout": "Knows About",
        "knowslanguage": "Language",
        "memberof": "Within Directory",
    };

    const format_facet_name = (facet_name) => {
        // strip off id_/txt_ from the leading bit.
        const field_name = facet_name.substring(facet_name.indexOf('_')+1);

        const lower_field_name = field_name.toLowerCase();
        if (fieldNameMap[lower_field_name]) {
            return fieldNameMap[lower_field_name];
        }
        return field_name.charAt(0).toUpperCase() + field_name.slice(1);
    };

    return (
        <div className="mt-4 w-75 mx-auto">
          <div className="ps-3 pe-3 w-75 mx-auto">
          </div>
          <div className="row">
            {facets.map((facet, i) => {
                return (
                    <div className="col">
                      <div key={i}>
                        <select
                          className="form-select form-select-md mb-3"
                          onChange={e => {
                              setValue(i, e.target.value);
                              facetSearch(e)
                          }}
                          value={facetValues[i]}
                          defaultValue=""
                        >
                          <option value="">{format_facet_name(facet.name)}</option>
                          {facet.counts.map((facetCount) => (
                              <option
                                key={facetCount.name}
                                className={facet.name}
                                value={facetCount.name}
                              >
                                {facetCount.name} ({facetCount.count})
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>
                );
            })}
            <div className="col-1 pt-2">
              <button className="clear-btn text-uppercase fw-bold" onClick={clear}>
                Clear
              </button>
            </div>
          </div>
        </div>
    );
}
