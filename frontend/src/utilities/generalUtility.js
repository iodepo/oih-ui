import {
  CATEGORIES,
  SAMPLE_QUERIES,
  fieldNameMap,
  idFacets,
} from "portability/configuration";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { dataServiceUrl } from "config";

const randomSampleQueries = (n) =>
  SAMPLE_QUERIES.map((e) => [Math.random(), e])
    .sort((a, b) => a[0] - b[0])
    .map(([_, e]) => e)
    .slice(0, n);

const fieldTitleFromName = (facet_name) => {
  // strip off id_/txt_ from the leading bit.
  const field_name = facet_name.substring(facet_name.indexOf("_") + 1);

  const lower_field_name = field_name.toLowerCase();
  if (fieldNameMap[lower_field_name]) {
    return fieldNameMap[lower_field_name];
  }
  return field_name.charAt(0).toUpperCase() + field_name.slice(1);
};

function useSearchParam(param, def = undefined) {
  const [params, setParams] = useSearchParams();
  const setParam = useCallback(
    (value) => {
      const updatedParams = { ...Object.fromEntries(params) };
      if (value === "") {
        delete updatedParams[param];
      } else {
        updatedParams[param] = value;
      }
      setParams(updatedParams);
    },
    [param, params, setParams]
  );
  return [params.has(param) ? params.get(param) : def, setParam];
}

const fetchDetail = (id) =>
  fetch(`${dataServiceUrl}/detail?id=${id}`).then((r) => r.json());

const searchAdvanced = (searchAdvancedQuery) => {
  let searchQueryBuild = "{{";
  let facetQuery = "";

  searchQueryBuild +=
    ' ("Topic" is "' + searchAdvancedQuery[0].value + '") AND (';
  /** @type {{id: number, category: string, value: string, operator: string, textfield: string}[][]} */
  const groups = Object.values(searchAdvancedQuery).toSpliced(0, 1);

  const categories = idFacets;

  function valueMapper(text, operator) {
    if (operator.toLowerCase().endsWith("contains")) {
      return `*${text}*`;
    }

    return text;
  }

  let firstGroup = true;
  for (const group of groups) {
    if (firstGroup) {
      facetQuery += "(";
      firstGroup = false;
    } else {
      facetQuery += " AND (";
      searchQueryBuild += " AND (";
    }

    for (const [index, value] of group.entries()) {
      if (group.length > 1) {
        searchQueryBuild +=
          '( "' +
          value.category +
          '" ' +
          value.operator +
          ' "' +
          value.textfield +
          '" )';
      } else {
        searchQueryBuild +=
          '"' +
          value.category +
          '" ' +
          value.operator +
          ' "' +
          value.textfield +
          '"';
      }

      facetQuery +=
        (value.operator.startsWith("Not") ? "-" : "") +
        categories[value.category.toLowerCase()] +
        ':"' +
        valueMapper(value.textfield, value.operator) +
        '"';

      if (index < group.length - 1) {
        facetQuery += " OR ";
        searchQueryBuild += " OR ";
      }
    }
    searchQueryBuild += ")";
    facetQuery += ")";
  }
  searchQueryBuild += " }}";
  return [searchQueryBuild, facetQuery];
};

export {
  randomSampleQueries,
  fieldTitleFromName,
  useSearchParam,
  fetchDetail,
  searchAdvanced,
};
