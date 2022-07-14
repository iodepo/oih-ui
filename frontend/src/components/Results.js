/* global URLSearchParams */

import React, {Component, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";

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
import {Popup} from 'react-map-gl';

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

const fetchDetail = id => fetch(`${dataServiceUrl}/detail/?id=${id}`).then(r => r.json())

export default function Results({searchText, setSearchText, region, setRegion, isLoadingFromSharableURL,
                                    searchType, setSearchType}) {

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
    const [facetQuery, setFacetQuery] = useState('');
    const [showMap, setShowMap ] = useState(false);
    const [mapBounds, setMapBounds ] = useState(false);

    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        const fetchResultList = (searchText, searchType, facetQuery) => {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({'document_type': searchType});
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
                    if (json.docs.some(doc => doc.has_geom) && !showMap) {
                        setShowMap(true);
                    }
                });
        };

        const fetchFacets = (searchText, searchType, facetQuery, mapBounds) => {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({
                'search_text': searchText,
                'document_type': searchType,
                'facetType': 'the_geom',
                'facetName': mapboxBounds_toQuery(mapBounds),
                'rows': 0,
            });
            URI += [params.toString(), facetQuery].filter(e=>e).join("&");

            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setResultCount(json.counts[searchType]);
                    setFacets(json.facets);
                });
        };

        const checkParams = async () => {
            if (isLoadingFromSharableURL) {
                const params = decodeURIComponent(location['pathname'].replace('/results/', ''))
                let facetParams = ''
                for (const url_parameter of params.split('/')) {
                    if (url_parameter.startsWith('search_text')) {
                        setSearchText(url_parameter.replace('search_text=', ''))
                    } else if (url_parameter.startsWith('document_type')) {
                        setSearchType(url_parameter.replace('document_type=', ''))
                    } else if (url_parameter.startsWith('facetSearch=')) {
                        setFacetQuery(url_parameter.replace('facetSearch=', ''))
                    }  else if (url_parameter.startsWith('selected_region=')) {
                        const region = url_parameter.replace('selected_region=', '')
                        if (region.toUpperCase() !== 'GLOBAL'){
                            setRegion(region)
                        }
                        facetParams += url_parameter.replace('facetSearch=', '')
                    }
                }
                if (facetParams) {
                    setFacetQuery(facetParams)
                }
            }
        }

        checkParams().then(() => {
            if (showMap) {
                fetchFacets(searchText, searchType, facetQuery, mapBounds);
            } else {
                fetchResultList(searchText, searchType, facetQuery);
            }
        })

    }, [searchText, searchType, facetQuery, showMap, mapBounds, region]);

    const calcGeoJsonUrl = (searchText, searchType, facetQuery, mapBounds) => {
        let URI =  `${dataServiceUrl}/spatial.geojson?`;
        const params = new URLSearchParams({
            'search_text': searchText,
            'document_type': searchType,
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
        setFacetQuery([facetQuery , clickedFacetQuery].filter(e=>e).join("&"));
        navigate(`${location['pathname'].replace('/results/', '')}/facetSearch=${clickedFacetQuery}`)
    };

    const resetDefaultSearchUrl = (searchType) => {
        let region_search = ''
        if (region !== 'GLOBAL') {
             region_search = `/selected_region=${region}`
        }
        navigate(`/results/search_text=${searchText}/document_type=${searchType}${region_search}`)
    }

    const clearFacetQuery = () => {
        setFacetQuery('')
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

    const [hoverElem, setHoverElem] = useState(undefined);
    const [detail, setDetail] = useState(undefined);
    useEffect(() => {
        fetchDetail(hoverElem).then(d => {
            if (!d || !d[0]) {
                setDetail(undefined);
                return
            }
            const matches = /POINT \((-?\d+\.\d+) (-?\d+\.\d+)\)/g.exec(d[0].the_geom)
            const [_, lng, lat] = matches.map(i => parseFloat(i))
            setDetail(
                <Popup
                    latitude={lat}
                    longitude={lng}
                    dynamicPosition={true}
                    closeButton={false}
                >
                        {d[0].name}
                </Popup>)
        })
    }, [hoverElem, setDetail])

    return (
        <div id='resultsMain'>
          <FacetsSidebar
            facets={facets} clearFacetQuery={clearFacetQuery} facetSearch={facetSearch} />
          <div id="resultsBackground">
            <ResultTabs tabList={tabs} setSearchType={setSearchType} searchType={searchType} clearFacetQuery={clearFacetQuery} resetDefaultSearchUrl={resetDefaultSearchUrl}/>
            <h3 className="resultsHeading">Search Query: {searchText}</h3>
            <h4 className="resultsHeading">{mapSearchTypeToProfile(searchType)}</h4>
            <h6 className="resultsHeading"> Total results found {resultCount || 0}</h6>
            <div>
              <div
                id="resultsInfo"
                style={{minHeight: "500px"}}
              >
                { showMap ?
                  <ReMap
                    externalLayers={layers}
                    bounds = {INITIAL_BOUNDS}
                    handleBoundsChange={setMapBounds}
                    layersState={[true]}
                    onMouseEnter={e => setHoverElem(e.features[0].properties.id)}
                    onMouseLeave={e => {
                        setHoverElem(undefined)
                    }}
                    popup={detail}
                  /> :
                  <ResultList results={results} />
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
                className="expertDetails">
                <h6>Name:
                  <a
                    href={result['txt_url'] || resolveAsUrl(result['id'])}
                  >
                    {result['name']}
                  </a>
                </h6>
                <Container>
                  <Row>
                    <Col className="topBubbleRow col col-lg-4">
                      <Component result={result}/>
                    </Col>
                    {'description' in result && result['type'] !== 'Person' &&
                     (
                         <Col id="topBubbleBottom">
                           <p>{result['description']}</p>
                         </Col>
                     )
                    }
                  </Row>
                </Container>
              </div>
          );
      });
