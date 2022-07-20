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
import regionBoundsMap  from '../constants'

import FacetsSidebar from "./results/FacetsSidebar";
import ReMap from './map/ReMap';
import Pagination, {ITEMS_PER_PAGE} from "./results/Pagination";
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


const INITIAL_BOUNDS = [{lon: -20, lat: -50},  // w s
    {lon: 320, lat: 50}   // e n
];

const regionMap = {
    Atlantic_Ocean: [{'lon': -110.11658847394503, 'lat': 5.483746321637085}, {'lon': 30.116588473945995, 'lat': 62.204953479609145}],
    Europe: [{'lon': -60, 'lat': 10}, {'lon': 125, 'lat': 73}],
    Pacific_Ocean: [{'lon': 77, 'lat': -21}, {'lon': 278, 'lat': 65}],
    Africa: [{'lon': -58, 'lat': -41}, {'lon': 127, 'lat': 47}],
    Latin_America_and_the_Caribbean: [{'lon': -131.86094382957086, 'lat': -35.97799165355438}, {'lon': -31.1390561704267, 'lat': 14.758199586212825}],
    Mediterranean_Sea: [{'lon': -8, 'lat': 29}, {'lon': 39, 'lat': 48}],
    Indian_Ocean: [{'lon': -19, 'lat': -46}, {'lon': 175, 'lat': 46}],
    Caribbean_Sea: [{'lon': -98, 'lat': 13}, {'lon': -52, 'lat': 35}],
    Asia: [{'lon': 14, 'lat': -12}, {'lon': 199, 'lat': 65}],
    Americas: [{'lon': -170, 'lat': -23}, {'lon': 15, 'lat': 60}],
    Southern_Ocean: [{'lon': -76, 'lat': -75}, {'lon': 109, 'lat': -18}],
    Pacific_Small_Islands: [{'lon': -219, 'lat': -24}, {'lon': -128, 'lat': 24}],
    Arctic_Ocean: [{'lon': -42, 'lat': 64}, {'lon': 140, 'lat': 85}],
    Oceania: [{'lon': 113, 'lat': -45}, {'lon': 204, 'lat': -2}]
}
const DEFAULT_QUERY_BOUNDS = '[-50,-20 TO 50,320]';

const mapboxBounds_toQuery = (mb) => {
    /* convert '{"_sw":{"lng":17.841823484137535,"lat":-59.72391567923438},"_ne":{"lng":179.1301535622635,"lat":49.99895151432449}}'
      to [_sw.lat,_sw.lng TO _ne.lat,_ne.lng] ([-90,-180 TO 90,180])
    */
    const {_sw, _ne} = mb;
    if (!_sw) {
        return DEFAULT_QUERY_BOUNDS;
    }
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
    const {searchType = 'CreativeWork'} = useParams()
    const showMap = searchType === 'SpatialData'
    const [searchText, setSearchText] = useSearchParam("search_text", "");
    const [region, setRegion] = useSearchParam("region", "global");
    const [facetQuery, setFacetQuery] = useSearchParam("facet_query");
    const [page, setPage] = useSearchParam("page", 0);

    useEffect(() => {
        if (showMap) {
            let URI = `${dataServiceUrl}/search?`;
            console.log('mapBounds')
            console.log(mapBounds)
            const params = new URLSearchParams({
                ...searchType !== 'SpatialData' ? {'document_type': searchType} : {},
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
            URI += [params.toString(), facetQuery].filter(e => e).join("&");
            let count;
            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setFacets(json.facets);
                    count = Object.values(json.counts).reduce((x, y) => x + y, 0);
                    setResultCount(count)
                }).then(() => fetch(`${dataServiceUrl}/count?${new URLSearchParams({
                field: 'type',
                ...region.toUpperCase() !== "GLOBAL" ? {region} : {},
                ...searchText ? {search_text: searchText} : {},
            })}`))
                .then(response => response.json())
                .then(json => {
                        let urlRegion = '';
                        if (region && region.toUpperCase() !== 'GLOBAL') {
                            urlRegion = '&region=' + region
                        }
                        fetch(`${dataServiceUrl}/search?facetType=the_geom&facetName=${get_region_bounds()}${urlRegion}`)
                            .then(response => response.json())
                            .then(spatialDataJson => {
                                console.log('spatialDataJson')
                                console.log(spatialDataJson)
                                console.log(Object.values(spatialDataJson.counts).reduce((x, y) => x + y, 0))
                                json.counts.SpatialData = Object.values(spatialDataJson.counts).reduce((x, y) => x + y, 0)
                                setCounts({...json.counts, [searchType]: count})
                            })
                    }
                )
        } else {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({'document_type': searchType, 'start': page * ITEMS_PER_PAGE});
            if (searchText !== '') {
                params.append('search_text', searchText)
            }
            if (region.toUpperCase() !== 'GLOBAL') {
                params.append('region', region)
            }
            URI += [params.toString(), facetQuery].filter(e => e).join("&");

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
                ...region.toUpperCase() !== "GLOBAL" ? {region} : {},
                ...searchText ? {search_text: searchText} : {},
            })}`))
                .then(response => response.json())
                .then(json => {
                        let urlRegion = '';
                        if (region && region.toUpperCase() !== 'GLOBAL') {
                            urlRegion = '&region=' + region
                        }
                        fetch(`${dataServiceUrl}/search?facetType=the_geom&facetName=${get_region_bounds()}${urlRegion}`)
                            .then(response => response.json())
                            .then(spatialDataJson => {
                                json.counts.SpatialData = Object.values(spatialDataJson.counts).reduce((x, y) => x + y, 0)
                                setCounts({...json.counts, [searchType]: count})
                            })
                    }
                )
        }
    }, [searchText, searchType, facetQuery, showMap, mapBounds, region, page]);

    const calcGeoJsonUrl = (searchText, searchType, facetQuery, mapBounds) => {
        let URI = `${dataServiceUrl}/spatial.geojson?`;
        const params = new URLSearchParams({
            ...searchType !== 'SpatialData' ? {'document_type': searchType} : {},
            'search_text': searchText,
            'facetType': 'the_geom',
            'facetName': mapboxBounds_toQuery(mapBounds),
        });
        if (region !== '' && region.toUpperCase() !== 'GLOBAL') {
            params.append('region', region)
        }
        URI += [params.toString(), facetQuery].filter(e => e).join("&");
        return URI;
    };

    const facetSearch = (event) => {
        const selectedIndex = event.target.selectedIndex;
        const clickedFacetQuery = new URLSearchParams({
            facetType: event.target.children[selectedIndex].className,
            facetName: event.target.value
        }).toString();
        setFacetQuery([facetQuery, clickedFacetQuery].filter(e => e).join("&"));
    };

    const resetDefaultSearchUrl = (type) => {
        navigate(`/results/${type}?${new URLSearchParams({...searchText ? {search_text: searchText} : {}, ...region.toUpperCase() !== "GLOBAL" ? {region} : {}})}`)
    }

    const clearFacetQuery = () => {
        resetDefaultSearchUrl(searchType)
    }

    let layers, geoJsonUrl;
    if (showMap) {
        geoJsonUrl = calcGeoJsonUrl(searchText, searchType, facetQuery, mapBounds);
        layers = [{
            id: 'search_results_layer',
            label: 'Search Results',
            type: 'geojson',
            url: geoJsonUrl
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
    
    const get_region_bounds = () => {
        const bounds = regionBoundsMap[region.replaceAll(' ', '_')]
        if (bounds) return bounds
        else return INITIAL_BOUNDS
    }
    
    const initial_bounds = () => {
        const bounds = regionMap[region.replaceAll(' ', '_')]
        if (bounds) return bounds
        else return INITIAL_BOUNDS
    }

    return (
        <>
            <div>
                <div>
                    <ResultTabs counts={counts} tabList={tabs} searchType={searchType}
                                resetDefaultSearchUrl={resetDefaultSearchUrl}/>
                    <div>
                        {facets.length > 0 && <FacetsFullWidth
                            facets={facets} clearFacetQuery={clearFacetQuery} facetSearch={facetSearch}/>}
                    </div>

                    <div className="row w-75 mx-auto">
                        <div className="col-12 mb-3">
                            <h6 className="primary-color text-start"> Total results found {resultCount || 0}</h6>
                        </div>
                        <div>
                            <div
                                style={{minHeight: "500px"}}
                            >
                                {showMap ?
                                    <ReMap
                                        externalLayers={layers}
                                        bounds={initial_bounds()}
                                        handleBoundsChange={setMapBounds}
                                        layersState={[true]}
                                        onMouseEnter={e => setSelectedElem(e.features[0].properties.id)}
                                        onMouseLeave={e => setSelectedElem(undefined)}
                                        popup={detail}
                                    /> :
                                    <>
                                        <ResultList results={results}/>
                                        <Pagination searchType={searchType} resultCount={resultCount} setPage={setPage}
                                                    page={page}/>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

const ResultList = ({results}) =>
    results.map((result) => {
        return <Result result={result} key={result['id']}/>
    });

const Result = ({result}) => {
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
            className="result-item rounded-3 p-3 mb-2"
            id='resultsDiv'
        >
            <h4 className="text-start mb-3">
                <a href={result['txt_url'] || resolveAsUrl(result['id'])}
                   className="result-title" target="_blank">
                    {result['name']}
                </a>
            </h4>
                <Row className="">
                    <div className="col" ref={infoRef}>
                        <Component result={result}/>
                        {'description' in result && result['type'] !== 'Person' &&
                    <div className="col" ref={descRef} >
                        <p className="result-p description-truncate"><b>Description:</b> {result['description']}</p>
                    </div>
                    }
                    </div>
                </Row>
                {'description' in result && truncated && shouldTruncate && <div className="w-100 d-flex">
                    <div class="col col-lg-4"></div>
                    <div class="col d-flex justify-content-center buttonHolder">
                        <button className="btn btn-info btn-sm text-dark" onClick={() => setShouldTruncate(false)}>Show
                            more
                        </button>
                    </div>
                </div>}
        </div>);
}
