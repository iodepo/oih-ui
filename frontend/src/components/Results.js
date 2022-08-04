/* global URLSearchParams */

import React, {useRef, useLayoutEffect, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import Expert from './Expert';
import ResultTabs from "./ResultTabs";
import {dataServiceUrl} from '../config/environment';
import {Row} from "react-bootstrap";
import DocumentResult from "./results/DocumentResult";
import CourseResult from "./results/CourseResult";
import VesselResult from "./results/VesselResult";
import ProjectResult from "./results/ProjectResult";
import OrganizationResult from "./results/OrganizationResult";
import Dataset from "./results/Dataset";
import regionBoundsMap  from '../constants'

import ReMap from './map/ReMap';
import Pagination, {ITEMS_PER_PAGE} from "./results/Pagination";
import {Popup} from 'react-map-gl';
import FacetsFullWidth from "./results/FacetsFullWidth";

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
        type: "Institutions",
    },
    Course: {
        Component: CourseResult,
        type: "Training",
    },
    Vehicle: {
        Component: VesselResult,
        type: "Vessels",
    },
    Dataset: {
        Component: Dataset,
        type: "Dataset",
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
    Atlantic_Ocean: [{'lon': -145.33369569979607, 'lat': 5.7780686247193955}, {'lon': 65.33369569979615, 'lat': 62.066727156861674}],
    Europe: [{'lon': -107.21562733091812, 'lat': 10.386093118754701}, {'lon': 172.21562733091304, 'lat': 72.88493065790703}],
    Pacific_Ocean: [{'lon': 25.14332118708481, 'lat': -20.600103232733574}, {'lon': 329.8566788129159, 'lat': 64.81860042660293}],
    Africa: [{'lon': -118.02145202451882, 'lat': -44.18474414265481}, {'lon': 187.02145202451686, 'lat': 49.8700945525558}],
    Latin_America_and_the_Caribbean: [{'lon': -124.03735675657782, 'lat': -33.51530089927659}, {'lon': 8.227832109604293, 'lat': 10.748842293271764}],
    Mediterranean_Sea: [{'lon': -19.175769130926653, 'lat': 29.08511838451858}, {'lon': 50.17576913092529, 'lat': 47.934811919266906}],
    Indian_Ocean: [{'lon': 4.611960795272864, 'lat': -24.930713744413936}, {'lon': 151.3880392047286, 'lat': 24.930713744412643}],
    Caribbean_Sea: [{'lon': -101.68655517385125, 'lat': 8.788708601074305}, {'lon': -33.02212937918131, 'lat': 31.247251757013444}],
    Asia: [{'lon': -32.57437113373925, 'lat': -11.617780311256865}, {'lon': 245.57437113373646, 'lat': 64.83446350500856}],
    Americas: [{'lon': -138.71527918710268, 'lat': 4.417188266974804}, {'lon': -16.284720812897746, 'lat': 42.759998884317014}],
    Southern_Ocean: [{'lon': -138.37738386680476, 'lat': -72.89917595362476}, {'lon': 166.66552158747544, 'lat': -1.5028371719127875}],
    Pacific_Small_Islands: [{'lon': 137.7987913220781, 'lat': -22.648871272548476}, {'lon': 191.6507377069418, 'lat': -4.358367103401818}],
    Arctic_Ocean: [{'lon': -70.49476004780959, 'lat': 57.59504163647418}, {'lon': 167.15987076394447, 'lat': 82.24618124542548}],
    Oceania: [{'lon': 98.10431027925404, 'lat': -42.80102387015745}, {'lon': 218.8956897207459, 'lat': -5.0462279577076}]
}
const DEFAULT_QUERY_BOUNDS = '[-50,-20 TO 50,320]';

const get_region_bounds = (region=null) => {
    let bounds;
    if (region) bounds = regionBoundsMap[region.replaceAll(' ', '_')]
    if (bounds) return bounds
    else return DEFAULT_QUERY_BOUNDS
}

const mapboxBounds_toQuery = (mb, region=null) => {
    /* convert '{"_sw":{"lng":17.841823484137535,"lat":-59.72391567923438},"_ne":{"lng":179.1301535622635,"lat":49.99895151432449}}'
      to [_sw.lat,_sw.lng TO _ne.lat,_ne.lng] ([-90,-180 TO 90,180])
    */
    const {_sw, _ne} = mb;
    if (!_sw) {
        return get_region_bounds(region);
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
            title: 'Person',
            tab_name: 'Experts',
        },
        {
            title: 'Organization',
            tab_name: 'Institutions',
        },
        {
            title: 'Dataset',
            tab_name: 'Datasets',
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
            tab_name: 'Spatial Data',
        },
    ];
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [resultMapCount, setResultMapCount] = useState(0);
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
    const [facetValues, setFacetFacetValues] = useState(new Array(facets.length).fill(""))

    useEffect(() => {
        if (showMap) {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({
                ...searchType !== 'SpatialData' ? {'document_type': searchType} : {},
                'facetType': 'the_geom',
                'facetName': mapboxBounds_toQuery(mapBounds, region),
                'rows': 0,
            });
            if (searchText !== '') {
                params.append('search_text', searchText)
            }
            if (region && region.toUpperCase() !== 'GLOBAL') {
                params.append('region', region)
            }
            URI += [params.toString(), facetQuery].filter(e => e).join("&");
            let count;
            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    // setFacets(json.facets);
                    count = Object.values(json.counts).reduce((x, y) => x + y, 0);
                    setResultMapCount(count)
                }).then(() => fetch(`${dataServiceUrl}/count?${new URLSearchParams({
                field: 'type',
                ...region.toUpperCase() !== "GLOBAL" ? {region} : {},
                ...searchText ? {search_text: searchText} : {},
            })}`))
                .then(response => response.json())
                .then(json => setCounts({...json.counts, [searchType]: count}))
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
                        const params = new URLSearchParams({
                            'facetType': 'the_geom',
                            'facetName': get_region_bounds(),
                            'rows': 0,
                        });
                        if (region && region.toUpperCase() !== 'GLOBAL') {
                            params.append('region', region)
                        }
                        if (searchText) {
                            params.append('search_text', searchText)
                        }
                        fetch(`${dataServiceUrl}/search?${params.toString()}`)
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
            'facetName': mapboxBounds_toQuery(mapBounds, region),
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
        setFacetFacetValues(new Array(facets.length).fill(""))
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
        else return DEFAULT_QUERY_BOUNDS
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
                                resetDefaultSearchUrl={resetDefaultSearchUrl} clearFacetQuery={clearFacetQuery}/>
                    <div>

                        {facets.length > 0 && <FacetsFullWidth
                            facets={facets} clearFacetQuery={clearFacetQuery} facetSearch={facetSearch} facetValues={facetValues} setFacetFacetValues={setFacetFacetValues}/>}
                    </div>

                    <div className="row w-75 mx-auto">
                        <div className="col-12 mb-3">
                            {showMap ?
                                <h6 className="primary-color text-start pt-3"> Total results
                                    found {resultMapCount || 0}</h6> :
                                <h6 className="primary-color text-start pt-3"> Total results
                                    found {resultCount || 0}</h6>
                            }
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
                <a href={result['type'] === 'Person' || result['type'] === 'Organization' ? resolveAsUrl(result['id']) :
                    result['txt_url'] || resolveAsUrl(result['id'])}
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
