/* global URLSearchParams */

import React, {useEffect, useState, useMemo, useCallback} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useSearchParam from "../useSearchParam";

import ResultTabs from "./ResultTabs";
import {dataServiceUrl} from '../config/environment';
import {Row} from "react-bootstrap";
import { regionMap, regionBoundsMap, INITIAL_BOUNDS, DEFAULT_QUERY_BOUNDS }  from '../constants';
import throttle from "lodash/throttle";

import ReMap from './map/ReMap';
import Pagination, {ITEMS_PER_PAGE} from "./results/Pagination";
import {Popup} from 'react-map-gl';
import FacetsFullWidth from "./results/FacetsFullWidth";

import typeMap from './results/types/';

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

const fetchDetail = id => fetch(`${dataServiceUrl}/detail?id=${id}`).then(r => r.json());

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

    useEffect(() => {
        fetch(`${dataServiceUrl}/search?${new URLSearchParams({
            rows: 0,
            include_facets: false,
            ...region.toUpperCase() !== "GLOBAL" ? { region } : {},
            ...searchText ? { search_text: searchText } : {},
        })}`)
            .then(response => response.json())
            .then(json => setCounts(prev => ({ ...json.counts, [searchType]: prev[searchType], SpatialData: prev.SpatialData })))
    }, [region, searchText, searchType])

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
        fetch(URI)
            .then(response => response.json())
            .then(json => {
                setResults(json.docs);
                setFacets(json.facets.filter(facet => facet.counts.length > 0));
                const count = json.count;
                setResultCount(count);
                setCounts(prev => ({ ...prev, [searchType]: count }));
            })
    }, 1000), [dataServiceUrl, searchText, searchType, region, facetQuery])

    useEffect(() => {
        if (showMap) {
            mapSearch(mapBounds, page);
        } else {
            let URI = `${dataServiceUrl}/search?`;
            const params = new URLSearchParams({'document_type': searchType, 'start': page * ITEMS_PER_PAGE, rows: ITEMS_PER_PAGE});
            if (searchText !== '') {
                params.append('search_text', searchText)
            }
            if (region.toUpperCase() !== 'GLOBAL') {
                params.append('region', region)
            }
            URI += [params.toString(), facetQuery].filter(e => e).join("&");

            fetch(URI)
                .then(response => response.json())
                .then(json => {
                    setResults(json.docs);
                    const count = json.count;
                    setResultCount(count);
                    setCounts(prev => ({ ...prev, [searchType]: count }));
                    setFacets(json.facets.filter(facet => facet.counts.length > 0));
                })

            const geoParams = new URLSearchParams({
                'facetType': 'the_geom',
                'facetName': get_region_bounds(),
                include_facets: false,
                'rows': 0,
            });
            if (region && region.toUpperCase() !== 'GLOBAL') {
                geoParams.append('region', region)
            }
            if (searchText) {
                geoParams.append('search_text', searchText)
            }
            fetch(`${dataServiceUrl}/search?${geoParams.toString()}`)
                .then(response => response.json())
                .then(json => setCounts(prev => ({ ...prev, SpatialData: Object.values(json.counts).reduce((x, y) => x + y, 0)})))
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
    const [viewport, setViewport] = useState({});

    const updateMapBounds = useCallback((bounds, viewport) => {
        setViewport(viewport);
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
    }, [showMap, dataServiceUrl, searchType, searchText, region, expandedMapBounds, facetQuery]);

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
            if (!d) {
                setSelectedDetails(undefined);
                return
            }
            let position;
            switch (selectedElem.layer.type) {
                case 'circle':
                    position = /POINT +\((-?\d+\.\d+) +(-?\d+\.\d+)\)/g.exec(d.the_geom)?.map(i => parseFloat(i))?.slice(1)
                    if (position == undefined) {
                        console.log(d.the_geom)
                    }
                    break;
                case 'line':
                    position = undefined;
                    break;
            }
            setSelectedDetails({ detail: d, position })
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


    const maybe_set_selected_element = (eltList) => {
        const { zoom=0 } = viewport;
        if (!eltList || ! eltList.length) { return undefined; }
        if (zoom < 3 ) { return undefined; }
        // // one hit
        // if (eltList.length == 1) {
        //     setSelectedElem(eltList[0]);
        //     return eltList[0];
        // }
        // Priority to points, maybe there's a better option, but choose one of 3
        const points = eltList.filter(e=>e.layer.type == 'circle');
        if (points.length) {
            if (points.length < 3) {
                const elem = points.pop();
                setSelectedElem(elem);
                return elem;
            }
            return undefined;
        }
        if (zoom > 3 && eltList && eltList.length < 100) {
            const elements = eltList.sort((a,b) => a.properties.geom_length - b.properties.geom_length);
            const elem = elements[0];
            setSelectedElem(elem);
            return elem;
        }
        return undefined;
    };

    const {zoom=0} = viewport;

    return (
        <>
          <div id="result-container">
            <div>
              <ResultTabs
                counts={counts}
                tabList={tabs}
                searchType={searchType}
                resetDefaultSearchUrl={resetDefaultSearchUrl}
                clearFacetQuery={clearFacetQuery}
              />
              <div id="result-section">
                <div>
                  {facets.length > 0 &&
                   <FacetsFullWidth
                     facets={facets}
                     clearFacetQuery={clearFacetQuery}
                     facetSearch={facetSearch}
                     facetValues={facetValues}
                     setFacetFacetValues={setFacetFacetValues}
                   />}
                </div>

                <div className="row mx-auto">
                  <div className="col-12 container mb-3">
                    <h6 className="primary-color text-start text-light ps-5 pt-3"> Total results found {resultCount || 0}</h6>
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
                                       maybe_set_selected_element(e.features);
                                       setMousePos(e.lngLat);
                                   }
                               }}
                               onClick={e => {
                                   if (selectHold) {
                                       setMousePos(e.lngLat);
                                       const selected = maybe_set_selected_element(e.features);
                                       setSelectHold(Boolean(selected));
                                   } else if (selectedElem) {
                                       setSelectHold(true);
                                   }
                               }}
                               popup={tooltip}
                               selectedId={selectedElem?.properties?.id}
                             />
                             <div>
                               Note: Geometries that are larger than the map display area will not be displayed. <br/>
                               Search results corresponding to the map area show below. <br/>
                               <span>{(zoom <= 3) && "Zoom in to hover over areas to see the objects associated with them."}</span><br/>
                             </div>

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
    const [truncate, setTruncate] = useState(true);
    const jsonLdParams = new URLSearchParams({id:result['id']}).toString();
    return (
        <div
                key={result['id']}
                className="result-item container rounded-3 p-3 mb-2"
                id="resultsDiv">
            <h4 className="text-start mb-3">
                <a
                        href={result['type'] === 'Person' || result['type'] === 'Organization' ? resolveAsUrl(result['id']) : result['txt_url'] || resolveAsUrl(result['id'])}
                        className="result-title"
                        target="_blank">
                    {result['name']}
                </a>
            </h4>
            <Row className="">
                <div className="col">
                    <Component result={result} />
                    {'description' in result && result['type'] !== 'Person' &&
                    <div className="col" >
                        <p className={`result-p ${truncate ? 'description-truncate' : ''}`} onClick={() => setTruncate(!truncate)} >
                            <b>Description:</b> {result['description']}
                        </p>
                    </div>
                    }
                </div>
            </Row>
            <a
                    href={`${dataServiceUrl}/source?${jsonLdParams}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-align-start float-start text-decoration-none"
                    style={{ fontSize: 'x-small' }}>
                View JSONLD source
            </a>
        </div>
    );
}
