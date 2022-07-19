/* global URLSearchParams */

import React, {useRef, useLayoutEffect, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

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
    Organization: {
        Component: OrganizationResult,
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
    }
};


const INITIAL_BOUNDS =  [ { lon:-20, lat:-50},  // w s
                          { lon:320, lat:50}   // e n
                        ];

const regionMap = {
    Atlantic_Ocean: [{'lon': -106.13563030191317, 'lat': 7.722279481459125}, {'lon': 26.42965382576412,'lat': 61.34350533443319}],
    Europe: [{'lon': -59.82953110786673, 'lat': 9.73537176688049}, {'lon': 125.28096513056107, 'lat': 72.78086284410605}],
    Pacific_Ocean: [{'lon': 76.73857614555914, 'lat': -21.178040850606266}, {'lon': 278.30266660319285, 'lat': 64.63116525975602}],
    Africa: [{'lon': -58.47073748462185, 'lat': -41.23861790211953}, {'lon': 126.6397587538043, 'lat': 46.766036620731}],
    Latin_America_and_the_Caribbean: [{'lon': -173.69220508441592, 'lat': -51.577191756993656}, {'lon': 11.418291154011712, 'lat': 35.467064391724065}],
    Mediterranean_Sea: [{'lon': -7.586873434119838, 'lat': 28.720668808388652}, {'lon': 38.69136077120598, 'lat': 47.826686423360684}],
    Indian_Ocean: [{'lon': -18.762762768442997, 'lat': -45.51508186280669}, {'lon': 175.32966191266144, 'lat': 45.99771970470985}],
    Caribbean_Sea: [{'lon': -98.13481484232238, 'lat': 12.606950554859594}, {'lon': -51.856580636996, 'lat': 34.91835271849355}],
    Asia: [{'lon': 13.660317850001945, 'lat': -11.50779448134162}, {'lon': 198.75164274038963, 'lat': 65.19790019953217}],
    Americas: [{'lon': -169.9700107694391, 'lat': -22.583449366664766}, {'lon': 15.112192704587642, 'lat': 59.85793058993079}],
    Southern_Ocean: [{'lon': -76.38674878551501, 'lat': -75.09807094038365}, {'lon': 108.69107270098624, 'lat': -17.89209341508294}],
    Pacific_Small_Islands: [{'lon': -219.43150999515905, 'lat': -23.787064763225786}, {'lon': -127.71205617681251, 'lat': 23.551535345665997}],
    Arctic_Ocean: [{'lon': -42.082352373611485, 'lat': 63.55684622830515}, {'lon': 140.45600115936452, 'lat': 85.05112877980659}],
    Oceania: [{'lon': 112.87802443109621, 'lat': -45.30637113220563}, {'lon': 204.1497317515661, 'lat': -2.4250425433680647}]
}
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

const fetchDetail = id => fetch(`${dataServiceUrl}/detail/?id=${id}`).then(r => r.json());

export default function Results() {
    const tabs = [
        {
            title: 'CreativeWork',
            tab_name: 'Documents',
        },
        {
            title: 'Experts',
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
            title: 'SpatialData',
            tab_name: 'Spatial Data & Maps',
        },
    ];
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [counts, setCounts] = useState({})
    const [facets, setFacets] = useState([]);
    const [mapBounds, setMapBounds] = useState(false);

    const navigate = useNavigate();
    const { searchType = 'CreativeWork' } = useParams()
    const showMap = searchType === 'SpatialData'
    const [searchText, setSearchText] = useSearchParam("search_text", "");
    const [region, setRegion] = useSearchParam("region", "global");
    const [facetQuery, setFacetQuery] = useSearchParam("facet_query");
    const [page, setPage] = useSearchParam("page", 0);

    useEffect(() => {
        if (showMap) {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({
                ...searchType !== 'SpatialData' ? { 'document_type': searchType } : {},
                'facetType': 'the_geom',
                'facetName': mapboxBounds_toQuery(mapBounds),
                'rows': 0,
            });
            if (searchText !== '') {
                params.append('search_text', searchText)
            }
            if (region !== '') {
                params.append('region', region)
            }
            URI += [params.toString(), facetQuery].filter(e=>e).join("&");
            let count;
            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setFacets(json.facets);
                    count = Object.values(json.counts).reduce((x, y) => x + y, 0);
                    setResultCount(count)
                }).then( () => fetch(`${dataServiceUrl}/count?${new URLSearchParams({
                    field: 'type',
                    ...region.toUpperCase() !== "GLOBAL" ? { region } : {},
                    ...searchText ? { search_text: searchText } : {},
                })}`))
                .then(response => response.json())
                .then(json => setCounts({ ...json.counts, [searchType]: count }))
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

            let count;
            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setResults(json.docs);
                    count = json.counts[searchType]
                    setResultCount(count);
                    setFacets(json.facets);
                }).then(() => fetch(`${dataServiceUrl}/count?${new URLSearchParams({
                    field: 'type',
                    ...region.toUpperCase() !== "GLOBAL" ? { region } : {},
                    ...searchText ? { search_text: searchText } : {},
                })}`))
                .then(response => response.json())
                .then(json => setCounts({ ...json.counts, [searchType]: count }))
        }
    }, [searchText, searchType, facetQuery, showMap, mapBounds, region, page]);

    const calcGeoJsonUrl = (searchText, searchType, facetQuery, mapBounds) => {
        let URI =  `${dataServiceUrl}/spatial.geojson?`;
        const params = new URLSearchParams({
            ...searchType !== 'SpatialData' ? { 'document_type': searchType } : {},
            'search_text': searchText,
            'facetType': 'the_geom',
            'facetName': mapboxBounds_toQuery(mapBounds),
        });
        if (region !== '' && region.toUpperCase() !== 'GLOBAL') {
            params.append('region', region)
        }
        URI += [params.toString(), facetQuery].filter(e=>e).join("&");
        return URI;
    };

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

    const [selectedElem, setSelectedElem] = useState(undefined);
    const [detail, setDetail] = useState(undefined);
    useEffect(() => {
        fetchDetail(selectedElem).then(d => {
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
    }, [selectedElem, setDetail])

    const initial_bounds = () => {
        const bounds = regionMap[region.replaceAll(' ', '_')]
        if (bounds) return bounds
        else return INITIAL_BOUNDS
    }

    return (
        <div className="w-100 bg-light">
          {facets.length > 0 && <FacetsSidebar
            facets={facets} clearFacetQuery={clearFacetQuery} facetSearch={facetSearch} />}
          <div className="container py-3 w-50 text-start">
            <ResultTabs counts={counts} tabList={tabs} searchType={searchType} resetDefaultSearchUrl={resetDefaultSearchUrl} />
            <h6 className="text-light-blue"> Total results found {resultCount || 0}</h6>
            <div>
              <div
                style={{minHeight: "500px"}}
              >
                { showMap ?
                  <ReMap
                    externalLayers={layers}
                    bounds = {initial_bounds()}
                    handleBoundsChange={setMapBounds}
                    layersState={[true]}
                    onMouseEnter={e => setSelectedElem(e.features[0].properties.id)}
                    onMouseLeave={e => setSelectedElem(undefined)}
                    popup={detail}
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
        return <Result result={result} key={result['id']} />
      });

const Result = ({ result }) => {
    const {Component} = typeMap[result['type']];
    const descRef = useRef();
    const infoRef = useRef();
    const [truncated, setTruncated] = useState(false);
    const [shouldTruncate, setShouldTruncate] = useState(true);
    useLayoutEffect(() => {
        if (!descRef.current || !infoRef.current) return
        const isTruncated = descRef.current.scrollHeight > infoRef.current.clientHeight;
        if (truncated !== isTruncated) {
            setTruncated(isTruncated);
        }
    });
    return (
        <div
            key={result['id']}
            className="border border-info rounded-3 p-3 mb-2"
            id='resultsDiv'
        >
            <h6>
                <a href={result['txt_url'] || resolveAsUrl(result['id'])}>
                    {result['name']}
                </a>
            </h6>
            <Container>
                <Row className="overflow-hidden">
                    <div className="col col-lg-4" ref={infoRef}>
                        <Component result={result}/>
                    </div>
                    {'description' in result && result['type'] !== 'Person' &&
                        <div className="col" ref={descRef} style={shouldTruncate ? {
                            height: 0,
                        } : {}}>
                            <p>{result['description']}</p>
                        </div>
                    }
                </Row>
                {'description' in result && truncated && shouldTruncate && <div className="w-100 d-flex">
                    <div class="col col-lg-4"></div>
                    <div class="col d-flex justify-content-center buttonHolder">
                        <button className="btn btn-info btn-sm text-dark" onClick={() => setShouldTruncate(false)}>Show more</button>
                    </div>
                </div>}
            </Container>
        </div>);
}
