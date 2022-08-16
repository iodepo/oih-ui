/* global URLSearchParams */

import React, {useEffect, useState, useMemo, useCallback} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import ResultTabs from "./ResultTabs";
import {dataServiceUrl} from '../config/environment';
import {Row} from "react-bootstrap";
import regionBoundsMap  from '../constants';
import throttle from "lodash/throttle";

import ReMap from './map/ReMap';
import Pagination, {ITEMS_PER_PAGE} from "./results/Pagination";
import {Popup} from 'react-map-gl';
import FacetsFullWidth from "./results/FacetsFullWidth";

import typeMap from './results/types/'

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

const INITIAL_BOUNDS = [{lon: -20, lat: -50},  // w s
    {lon: 320, lat: 50}   // e n
];

const expandMapBounds = ({_sw, _ne}) => {
    _sw = {..._sw}
    _ne = {..._ne}
    const size = { lat: Math.abs(_ne.lat - _sw.lat), lng: Math.abs(_ne.lng - _sw.lng) }
    _sw.lat -= Math.abs(size.lat * 0.25)
    if (Math.abs(_sw.lat) > 90) { _sw.lat = 90 * Math.sign(_sw.lat) }
    _sw.lng -= Math.abs(size.lng * 0.25)

    _ne.lat += Math.abs(size.lat * 0.25)
    if (Math.abs(_ne.lat) > 90) { _ne.lat = 90 * Math.sign(_ne.lat) }
    _ne.lng += Math.abs(size.lng * 0.25)
    return { _sw, _ne }
}

const containsMapBounds = (outer, inner) => (
    outer._sw.lat < inner._sw.lat &&
    outer._sw.lng < inner._sw.lng &&
    outer._ne.lat > inner._ne.lat &&
    outer._ne.lng > inner._ne.lng
)

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
    const [facetValues, setFacetFacetValues] = useState(new Array(facets.length).fill(""))

    const mapSearch = useCallback(throttle((mapBounds, page) => {
        let URI = `${dataServiceUrl}/search?`;
        const params = new URLSearchParams({
            ...searchType !== 'SpatialData' ? { 'document_type': searchType } : {},
            'facetType': 'the_geom',
            'facetName': mapboxBounds_toQuery(mapBounds, region),
            'rows': ITEMS_PER_PAGE,
            'start': page * ITEMS_PER_PAGE
        });
        if (searchText !== '') {
            params.append('search_text', searchText);
        }
        if (region && region.toUpperCase() !== 'GLOBAL') {
            params.append('region', region);
        }
        URI += [params.toString(), facetQuery].filter(e => e).join("&");
        let count;
        fetch(URI)
            .then(response => response.json())
            .then(json => {
                setResults(json.docs);
                setFacets(json.facets);
                count = Object.values(json.counts).reduce((x, y) => x + y, 0);
                setResultCount(count);
            }).then(() => fetch(`${dataServiceUrl}/count?${new URLSearchParams({
                field: 'type',
                ...region.toUpperCase() !== "GLOBAL" ? { region } : {},
                ...searchText ? { search_text: searchText } : {},
            })}`))
            .then(response => response.json())
            .then(json => setCounts({ ...json.counts, [searchType]: count }));
    }, 1000), [dataServiceUrl, searchText, searchType, region, facetQuery])

    useEffect(() => {
        if (showMap) {
            mapSearch(mapBounds, page);
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

    const [expandedMapBounds, setExpandedMapBounds] = useState(false)
    const [allowSetMapBounds, ] = useState(true)

    const updateMapBounds = useCallback(bounds => {
        if (allowSetMapBounds) {
            setMapBounds(bounds)
            if (!expandedMapBounds || !containsMapBounds(expandedMapBounds, bounds)) {
                setExpandedMapBounds(expandMapBounds(bounds))
            }
        }
    }, [expandedMapBounds, setMapBounds, setExpandedMapBounds, allowSetMapBounds])

    const geoJsonUrl = useMemo(() => {
        if (showMap) {
            let geoJsonUrl = `${dataServiceUrl}/spatial.geojson?`;
            const params = new URLSearchParams({
                ...searchType !== 'SpatialData' ? {'document_type': searchType} : {},
                'search_text': searchText,
                'facetType': 'the_geom',
                'facetName': mapboxBounds_toQuery(expandedMapBounds, region),
            });
            if (region !== '' && region.toUpperCase() !== 'GLOBAL') {
                params.append('region', region)
            }
            geoJsonUrl += [params.toString(), facetQuery].filter(e => e).join("&");
            return geoJsonUrl
        }
        return null
    }, [showMap, dataServiceUrl, searchType, searchText, region, expandedMapBounds]);

    const layers = useMemo(() => {
        return [
            {
                id: 'search_results_layer',
                label: 'Search Results',
                type: 'geojson',
                url: geoJsonUrl,
                cluster: true
            },
        ];
    }, [geoJsonUrl]);

    const [mousePos, setMousePos] = useState(undefined);
    const [selectedElem, setSelectedElem] = useState(undefined);
    const [selectedDetails, setSelectedDetails] = useState(undefined);
    const [selectHold, setSelectHold] = useState(false)
    useEffect(() => {
        if (selectedElem == undefined) {
            setSelectedDetails(undefined);
            return
        }
        fetchDetail(selectedElem.properties.id).then(d => {
            if (!d || !d[0]) {
                setSelectedDetails(undefined);
                return
            }
            let position;
            switch (selectedElem.layer.type) {
                case 'circle':
                    position = /POINT +\((-?\d+\.\d+) +(-?\d+\.\d+)\)/g.exec(d[0].the_geom)?.map(i => parseFloat(i))?.slice(1)
                    if (position == undefined) {
                        console.log(d[0].the_geom)
                    }
                    break;
                case 'line':
                    position = undefined;
                    break;
            }
            setSelectedDetails({ detail: d[0], position })
        })
    }, [selectedElem?.properties?.id])

    const tooltip = (() => {
        if (!selectedDetails || !selectedElem) return null;
        let [lng, lat] = selectedDetails.position ?? mousePos
        while (lng - mousePos[0] > +180) { lng -= 360.0 }
        while (lng - mousePos[0] < -180) { lng += 360.0 }
        return <Popup
            latitude={lat}
            longitude={lng}
            dynamicPosition={true}
            closeButton={false}
            className="w-25"
        >
            {selectedDetails.detail.name}
        </Popup>
    })()

    const detail = (() => {
        if (!selectedDetails || !selectedElem) return undefined
        return <Result result={selectedDetails.detail} />
    })()
    
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

                    <div className="row mx-auto">
                        <div className="col-12 container mb-3">
                            <h6 className="primary-color text-start"> Total results found {resultCount || 0}</h6>
                        </div>
                        <div>
                            <div
                                style={{minHeight: "500px"}}
                            >
                                {showMap &&
                                    <div className="">
                                        <div className="row">
                                            <div className="container col-6">
                                                <ReMap
                                                    externalLayers={layers}
                                                    bounds={initial_bounds()}
                                                    handleBoundsChange={updateMapBounds}
                                                    layersState={[true]}
                                                    onHover={e => {
                                                        if (!selectHold) {
                                                            setSelectedElem(e.features?.[0])
                                                            setMousePos(e.lngLat)
                                                        }
                                                    }}
                                                    onClick={e => {
                                                        if (selectHold) {
                                                            setSelectedElem(e.features?.[0])
                                                            setMousePos(e.lngLat)
                                                            setSelectHold(Boolean(e.features?.[0]))
                                                        } else if (selectedElem) {
                                                            setSelectHold(true)
                                                        }
                                                    }}
                                                    popup={tooltip}
                                                />
                                            </div>
                                            <div className="container col-3">
                                                {detail}
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                }
                                <div className="container">
                                    <ResultList results={results}/>
                                    <Pagination searchType={searchType} resultCount={resultCount} setPage={setPage} page={page}/>
                                </div>
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
    const [truncate, setTruncate] = useState(true)
    return (
        <div
            key={result['id']}
            className="result-item container rounded-3 p-3 mb-2"
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
                    <div className="col">
                        <Component result={result}/>
                        {'description' in result && result['type'] !== 'Person' &&
                    <div className="col" >
                        <p className={`result-p ${truncate ? 'description-truncate' : ''}`} onClick={() => setTruncate(!truncate)} ><b>Description:</b> {result['description']}</p>
                    </div>
                    }
                    </div>
                </Row>
                <a href={`${dataServiceUrl}/source?id=${result['id']}`} target="_blank" rel="noreferrer noopener" 
                    className="text-align-start float-start text-decoration-none" style={{ fontSize: 'x-small' }}
                >
                    View JSONLD source
                </a>
        </div>);
}
