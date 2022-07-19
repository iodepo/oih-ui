import React, {useCallback, useState} from "react";

export default function FacetsSidebar({
  facets,
  clearFacetQuery,
  facetSearch,
}) {
  const [values, setValues] = useState(new Array(facets.length).fill(""))
  const setValue = (i, value) => setValues(values => [...values.slice(0, i), value, ...values.slice(i + 1, values.length)])
  const clear = useCallback(e => {
    setValues(new Array(facets.length).fill(""))
    clearFacetQuery()
  }, [clearFacetQuery, setValue])
  return (
    <div className="m-4 p-3 float-start narrow w-100 border rounded-3">
      <div className="d-flex">
        <h5 className="text-start">
          Filter By:
        </h5>
        <button className="btn btn-secondary ms-auto" onClick={clear}>
          Clear
        </button>
      </div>
      {facets.map((facet, i) => {
        return (
          <div key={i}>
            <h6>{facet.name.substring(4)}</h6>
            <select
              className="form-select form-select-md mb-3"
              onChange={e => {
                setValue(i, e.target.value);
                facetSearch(e)
              }}
              value={values[i]}
              defaultValue=""
            >
              <option value="">--- Select to search facet ---</option>
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
        );
      })}
    </div>
  );
}
