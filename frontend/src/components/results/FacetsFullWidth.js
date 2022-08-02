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

    let url = window.location.href.split('/').slice(3)[1].split('?')[0]

    return url == "SpatialData" ? null : (
        <div className="m-4 p-3">
            <div className="pb-2 ps-3 pe-3 w-75 mx-auto">
            </div>
            <div className="row bg-white pt-5 pb-5 ps-3 pe-3 w-75 mx-auto">
                {facets.map((facet, i) => {
                    return (
                        <div className="col-5">
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
                                    <option value="">--- Select to search {facet.name.substring(4)} facet ---</option>
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
