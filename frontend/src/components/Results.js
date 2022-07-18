/* global URLSearchParams */

import React, {Component, useEffect, useState, useCallback} from "react";
import {useNavigate, useSearchParams, useParams} from "react-router-dom";

import Expert from './Expert';
import ResultTabs from "./ResultTabs";
import {dataServiceUrl} from '../config/environment';
import {Col, Container, Row} from "react-bootstrap";
import DocumentResult from "./results/DocumentResult";
import CourseResult from "./results/CourseResult";
import VesselResult from "./results/VesselResult";
import ProjectResult from "./results/ProjectResult";
import OrganizationResult from "./results/OrganizationResult";

import FacetsSidebar from "./results/FacetsSidebar";
import ReMap from './map/ReMap';
import Pagination, { ITEMS_PER_PAGE } from "./results/Pagination";

const typeMap = {
    CreativeWork: {
        Component: DocumentResult,
        type: "Document",
    },
    Person: {
        Component: Expert,
        type: "Experts",
    },
    Course: {
        Component: CourseResult,
        type: "Training",
    },
    Vehicle: {
        Component: VesselResult,
        type: "Vessels",
    },
    ResearchProject: {
        Component: ProjectResult,
        type: "Projects",
    },
    Organization: {
        Component: OrganizationResult,
        type: "Organizations",
    },
};


const INITIAL_BOUNDS =  [ { lon:-20, lat:-50},  // w s
                          { lon:320, lat:50}   // e n
                        ];

const DEFAULT_QUERY_BOUNDS = '[-50,-20 TO 50,320]';

const mapboxBounds_toQuery = (mb) => {
      /* convert '{"_sw":{"lng":17.841823484137535,"lat":-59.72391567923438},"_ne":{"lng":179.1301535622635,"lat":49.99895151432449}}'
        to [_sw.lat,_sw.lng TO _ne.lat,_ne.lng] ([-90,-180 TO 90,180])
      */
    const {_sw, _ne} = mb;
    if (!_sw) { return DEFAULT_QUERY_BOUNDS; }
    return `[${_sw.lat},${_sw.lng} TO ${_ne.lat},${_ne.lng}]`;
};

function resolveAsUrl(url) {
    const pattern = /^((http|https):\/\/)/;
    if (!pattern.test(url)) {
        return "http://" + url;
    }
    return url;
}

const useSearchParam = (param, def = undefined) => {
    const [params, setParams] = useSearchParams()
    const setParam = useCallback(value => setParams({ ...Object.fromEntries(params), [param]: value }), [param, params, setParams])
    return [params.has(param) ? params.get(param) : def, setParam]
}

export default function Results() {
    const tabs = [
        {
            title: 'CreativeWork',
            tab_name: 'Documents',
        },
        {
            title: 'Person',
            tab_name: 'Experts',
        },
        {
            title: 'Course',
            tab_name: 'Training',
        },
        {
            title: 'Vehicle',
            tab_name: 'Vessels',
        },
        {
            title: 'ResearchProject',
            tab_name: 'Projects',
        },
        {
            title: 'Organization',
            tab_name: 'Organizations',
        },
        {
            title: 'SpatialData',
            tab_name: 'Spatial Data & Maps',
        },
    ];
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [facets, setFacets] = useState([]);
    const [mapBounds, setMapBounds ] = useState(false);
    const [showMap, setShowMap ] = useState(false);
    
    const navigate = useNavigate();
    const { searchType = 'CreativeWork' } = useParams()
    useEffect(() => setShowMap(searchType === "SpatialData"), [searchType])
    const [searchText, setSearchText] = useSearchParam("search_text", "");
    const [region, setRegion] = useSearchParam("region", "global");
    const [facetQuery, setFacetQuery] = useSearchParam("facet_query");
    const [page, setPage] = useSearchParam("page", 0);

    useEffect(() => {
        if (showMap) {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({
                'facetType': 'the_geom',
                'facetName': mapboxBounds_toQuery(mapBounds),
                'rows': 0,
            });
            if (searchText !== '') {
                params.append('search_text', searchText)
            }
            URI += [params.toString(), facetQuery].filter(e=>e).join("&");

            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setResultCount(json.counts[searchType]);
                    setFacets(json.facets);
                });
        } else {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({'document_type': searchType, 'start': page * ITEMS_PER_PAGE });
            if (searchText !== '') {
                params.append('search_text', searchText)
            }
            if (region.toUpperCase() !== 'GLOBAL') {
                params.append('region', region)
            }
            URI += [params.toString(), facetQuery].filter(e=>e).join("&");

            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setResults(json.docs);
                    setResultCount(json.counts[searchType]);
                    setFacets(json.facets);
                });
        }
    }, [searchText, searchType, facetQuery, showMap, mapBounds, region, page]);

    const calcGeoJsonUrl = (searchText, searchType, facetQuery, mapBounds) => {
        let URI =  `${dataServiceUrl}/spatial.geojson?`;
        const params = new URLSearchParams({
            'search_text': searchText,
            'facetType': 'the_geom',
            'facetName': mapboxBounds_toQuery(mapBounds),
        });
        URI += [params.toString(), facetQuery].filter(e=>e).join("&");
        return URI;
    };

    function mapSearchTypeToProfile(searchType) {
        // could be tabs.filter(e=>e.title===searchType).map(e=>e.tab_name).shift() || 'unknown_type'
        for (const tab of tabs) {
            if (tab['title'] === searchType) {
                return tab['tab_name'];
            }
        }
        return 'unknown type';
    }

    const facetSearch = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const clickedFacetQuery = new URLSearchParams({facetType:event.target.children[selectedIndex].className,
                                                       facetName:event.target.value}).toString();
        setFacetQuery([facetQuery, clickedFacetQuery].filter(e=>e).join("&"));
    };

    const resetDefaultSearchUrl = (type) => {
        navigate(`/results/${type}?${new URLSearchParams({ ...searchText ? { search_text: searchText } : {}, ...region.toUpperCase() !== "GLOBAL" ? { region } : {} })}`)
    }

    const clearFacetQuery = () => {
        resetDefaultSearchUrl(searchType)
    }

    let layers, geoJsonUrl;
    if (showMap) {
        geoJsonUrl = calcGeoJsonUrl(searchText, searchType, facetQuery, mapBounds);
        layers = [{
            id:'search_results_layer',
            label:'Search Results',
            type:'geojson',
            url:geoJsonUrl
        }];
    }

    return (
        <div className="w-100 bg-light">
          {facets.length > 0 && <FacetsSidebar
            facets={facets} clearFacetQuery={clearFacetQuery} facetSearch={facetSearch} />}
          <div className="container py-3 w-50 text-start">
            <ResultTabs tabList={tabs} searchType={searchType} resetDefaultSearchUrl={resetDefaultSearchUrl} />
            <h3 className="text-light-blue">Search Query: {searchText}</h3>
            <h4 className="text-light-blue">{mapSearchTypeToProfile(searchType)}</h4>
            <h6 className="text-light-blue"> Total results found {resultCount || 0}</h6>
            <div>
              <div
                style={{minHeight: "500px"}}
              >
                { showMap ?
                  <ReMap
                    externalLayers={layers}
                    bounds = {INITIAL_BOUNDS}
                    handleBoundsChange={setMapBounds}
                    layersState={[true]}
                  /> :
                  <>
                    <ResultList results={results}/>
                    <Pagination searchType={searchType} resultCount={resultCount} setPage={setPage} page={page}/>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
    );
}

const ResultList = ({results}) =>
      results.map((result) => {
          const {Component} = typeMap[result['type']];
          return (
              <div
                key={result['id']}
                className="border border-info rounded-3 p-3 mb-2">
                <h6>
                    <a href={result['txt_url'] || resolveAsUrl(result['id'])}>
                        {result['name']}
                    </a>
                </h6>
                <Container>
                  <Row>
                    <Col className="col-lg-4">
                      <Component result={result}/>
                    </Col>
                    {'description' in result && result['type'] !== 'Person' &&
                     (
                         <Col>
                           <p>{result['description']}</p>
                         </Col>
                     )
                    }
                  </Row>
                </Container>
              </div>
          );
      });
