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

    const format_facet_name = (facet_name) => {
        if (facet_name.toUpperCase().includes('INCLUDEDINDATACATALOG')) {
            return "Catalog"
        }
        if (facet_name.toUpperCase().includes('JOBTITLE')) {
            return "Job Title"
        }
        if (facet_name.toUpperCase().includes('KNOWSABOUT')) {
            return "Knows About"
        }
        if (facet_name.toUpperCase().includes('KNOWSLANGUAGE')) {
            return "Language"
        }
        if (facet_name.toUpperCase().includes('MEMBEROF')) {
            return "Within Directory"
        }
        if (facet_name.startsWith('id_')) {
            const name = facet_name.substring(3)
            return name.charAt(0).toUpperCase() + name.slice(1)
        }
        const name = facet_name.substring(4)
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    return url == "SpatialData" ? null : (
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
