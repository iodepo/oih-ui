import { useRef, useReducer, useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ToolbarHome from "./components/ToolbarHome";
import { EMODNET, NO_CLUSTER } from "./utils/constants";
import { reducer } from "./utils/reducer";
import MapView from "./components/MapView";
import Box from "@mui/material/Box";
import { ITEMS_PER_PAGE, centerMap, initZoom } from "portability/configuration";
import { dataServiceUrl } from "config/environment";
import { mapLibreBounds_toQuery } from "utilities/mapUtility";
import { throttle } from "lodash";
import { useSearchParam } from "utilities/generalUtility";
import DesktopMapView from "./components/desktop/DesktopMapView";
import MobileMapView from "./components/mobile/MobileMapView";
import { useMediaQuery, useTheme } from "@mui/material";

const MapContainer = (props) => {
  const { isHome } = props;
  const [params] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, {
    baseLayer: EMODNET,
    clustering: NO_CLUSTER,
    hexOpacity: 0.4,
    baseOpacity: 1,
    heatOpacity: 0.4,
    showPoints: false,
    showRegions: false,
    zoom: initZoom,
    isLoading: false,
    center: centerMap,
    showSearchArea: false,
    selectedElem: undefined,
    mapBounds: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);

  const [region, setRegion] = useState(
    params.has("region") ? params.get("region") : "Global"
  );
  const [searchText, setSearchText] = useState(
    params.has("search_text") ? params.get("search_text") : ""
  );
  const [resultsCount, setResultsCount] = useState(0);
  const [initMapBounds, setInitMapBounds] = useState(false);
  const [open, setOpen] = useState(true);
  const [facets, setFacets] = useState([]);
  const [currentURI, setCurrentURI] = useState("");
  const [facetQuery, setFacetQuery] = useSearchParam("fq");
  const [selectedFacets, setSelectedFacets] = useState([]);
  const [initCenter, setInitCenter] = useState(centerMap);
  const [geoJson, setGeoJson] = useState();
  const mapRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const lng = searchParams.get("lng");
    const lat = searchParams.get("lat");

    if (lng && lat) setInitCenter([lng, lat]);
  }, []);

  const hrefFor = (region, query, facetQuery) =>
    `/map-viewer?${new URLSearchParams({
      ...(query ? { search_text: query } : {}),
      ...(facetQuery ? { fq: facetQuery } : {}),
      ...(region && region.toUpperCase() !== "GLOBAL" ? { region } : {}),
    })}`;

  const handleSubmit = useCallback(
    () => navigate(hrefFor(region, searchText, facetQuery)),
    [navigate, searchText, region, facetQuery]
  );
  const changeBaseLayer = (layer) => {
    dispatch({ type: "setBaseLayer", baseLayer: layer });
  };
  const changeBaseOpacity = (opacity) => {
    dispatch({ type: "setBaseOpacity", baseOpacity: opacity });
  };
  const changeClustering = (cluster) => {
    dispatch({ type: "setClustering", clustering: cluster });
  };
  const setShowPoints = (showPoints) => {
    dispatch({ type: "setShowPoints", showPoints: showPoints });
  };
  const setShowRegions = (showRegions) => {
    dispatch({ type: "setShowRegions", showRegions: showRegions });
  };
  const changeHexOpacity = (hexOpacity) => {
    dispatch({ type: "setHexOpacity", hexOpacity: hexOpacity });
  };
  const changeHeatOpacity = (heatOpacity) => {
    dispatch({ type: "setHeatOpacity", heatOpacity: heatOpacity });
  };
  const changeShowSearchArea = (showSearchArea) => {
    dispatch({ type: "setShowSearchArea", showSearchArea: showSearchArea });
  };
  const changeSelectedElem = (selectedElem) => {
    dispatch({ type: "setSelectedElem", selectedElem: selectedElem });
  };
  const changeMapBounds = (mapBounds) => {
    dispatch({ type: "setMapBounds", mapBounds: mapBounds });
  };

  const searchThisArea = () => {
    getDataSpatialSearch(state.mapBounds);
  };

  const applyZoom = (zoomType) => {
    let value;
    if (zoomType === "out") {
      if (state.zoom > 0) {
        value = state.zoom - 1;
      }
    } else if (zoomType === "in") {
      if (state.zoom > 0) {
        value = state.zoom + 1;
      }
    }
    dispatch({ type: "setZoom", zoom: value });
  };

  const handleDrawer = (isOpen) => {
    setOpen(isOpen);
  };

  const setLoading = (isLoading) => {
    dispatch({ type: "setLoading", loading: isLoading });
  };

  const setCenter = (center) => {
    dispatch({ type: "setCenter", center: center });
  };

  const facetSearch = (name, value, checked) => {
    let facet = name + ":" + '"' + value + '"';
    let newQuery = facetQuery ? facetQuery.replace(/^\(|\)$/g, "") : "";

    if (checked) {
      newQuery = "(" + [newQuery, facet].filter((e) => e).join(" OR ") + ")";
      setFacetQuery(newQuery);
    } else {
      const facetsDefined = newQuery.split(" OR ").filter((n) => n !== facet);
      newQuery = "(" + facetsDefined.filter((e) => e).join(" OR ") + ")";
      setFacetQuery(newQuery);
    }
  };

  const getGeoJSON = (bounds) => {
    let geoJsonUrl = `${dataServiceUrl}/spatial.geojson?`;
    const params = new URLSearchParams({
      /* ...(searchType !== "SpatialData" ? { document_type: searchType } : {}), */
      search_text: searchText,
      facetType: "the_geom",
      facetName: mapLibreBounds_toQuery(bounds, region),
    });
    if (region !== "" && region.toUpperCase() !== "GLOBAL") {
      params.append("region", region);
    }
    geoJsonUrl += [params.toString(), facetQuery].filter((e) => e).join("&");

    fetch(geoJsonUrl)
      .then((response) => response.json())
      .then((json) => {
        setGeoJson(json);
      });
  };

  const getDataSpatialSearch = throttle((bounds, page = 1) => {
    page === 1 && setLoading(true);
    let URI = `${dataServiceUrl}/search?`;
    const params = new URLSearchParams({
      facetType: "the_geom",
      facetName: mapLibreBounds_toQuery(bounds, region),
      rows: ITEMS_PER_PAGE + 20 * page,
      start: 0,
    });
    if (searchText !== "") {
      params.append("search_text", searchText);
    }
    if (region && region.toUpperCase() !== "GLOBAL") {
      params.append("region", region);
    }
    URI += [params.toString(), facetQuery].filter((e) => e).join("&");
    setCurrentURI(URI);
    fetch(URI)
      .then((response) => response.json())
      .then((json) => {
        setResults(json.docs);
        const count = json.count;
        setResultsCount(count);
        setFacets(json.facets.filter((facet) => facet.counts.length > 0));
        page === 1 && setLoading(false);
        changeShowSearchArea(false);
      });

    getGeoJSON(bounds);
  }, 1000);

  useEffect(() => {
    getDataSpatialSearch(state.mapBounds);
  }, [navigate, params, facetQuery]);

  const clear = () => {
    setSelectedFacets([]);
    setFacetQuery("");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      {isHome && (
        <ToolbarHome changeBaseLayer={changeBaseLayer} center={state.center} />
      )}
      {state && isHome && (
        <MapView
          container={mapRef}
          baseLayer={state.baseLayer}
          baseOpacity={state.baseOpacity}
          clustering={state.clustering}
          hexOpacity={state.hexOpacity}
          showPoints={state.showPoints}
          showRegions={state.showRegions}
          zoom={state.zoom}
          isHome={isHome}
          setCenter={setCenter}
          initCenter={initCenter}
          heatOpacity={state.heatOpacity}
          changeMapBounds={changeMapBounds}
          geoJson={geoJson}
          setInitMapBounds={setInitMapBounds}
        />
      )}

      {state && !isHome && !isMobile && (
        <Box display={{ xs: "none", md: "block" }}>
          <DesktopMapView
            results={results}
            setSearchText={setSearchText}
            searchText={searchText}
            resultsCount={resultsCount}
            isLoading={state.loading}
            mapBounds={state.mapBounds}
            getDataSpatialSearch={getDataSpatialSearch}
            handleSubmit={handleSubmit}
            setSelectedFacets={setSelectedFacets}
            selectedFacets={selectedFacets}
            facetSearch={facetSearch}
            clear={clear}
            open={open}
            handleDrawer={handleDrawer}
            applyZoom={applyZoom}
            facets={facets}
            setRegion={setRegion}
            facetQuery={facetQuery}
            region={region}
            container={mapRef}
            baseLayer={state.baseLayer}
            baseOpacity={state.baseOpacity}
            clustering={state.clustering}
            hexOpacity={state.hexOpacity}
            showPoints={state.showPoints}
            showRegions={state.showRegions}
            isHome={isHome}
            zoom={state.zoom}
            setCenter={setCenter}
            initCenter={initCenter}
            changeBaseLayer={changeBaseLayer}
            changeBaseOpacity={changeBaseOpacity}
            changeClustering={changeClustering}
            changeHexOpacity={changeHexOpacity}
            setShowPoints={setShowPoints}
            setShowRegions={setShowRegions}
            heatOpacity={state.heatOpacity}
            changeHeatOpacity={changeHeatOpacity}
            changeMapBounds={changeMapBounds}
            geoJson={geoJson}
            showSearchArea={state.showSearchArea}
            changeSelectedElem={changeSelectedElem}
            selectedElem={state.selectedElem}
            changeShowSearchArea={changeShowSearchArea}
            searchThisArea={searchThisArea}
            currentURI={currentURI}
            setInitMapBounds={setInitMapBounds}
          />
        </Box>
      )}

      {state && !isHome && isMobile && (
        <Box>
          <MobileMapView
            results={results}
            setSearchText={setSearchText}
            searchText={searchText}
            resultsCount={resultsCount}
            isLoading={state.loading}
            mapBounds={state.mapBounds}
            getDataSpatialSearch={getDataSpatialSearch}
            handleSubmit={handleSubmit}
            setSelectedFacets={setSelectedFacets}
            selectedFacets={selectedFacets}
            facetSearch={facetSearch}
            clear={clear}
            open={open}
            handleDrawer={handleDrawer}
            applyZoom={applyZoom}
            facets={facets}
            setRegion={setRegion}
            facetQuery={facetQuery}
            region={region}
            container={mapRef}
            baseLayer={state.baseLayer}
            baseOpacity={state.baseOpacity}
            clustering={state.clustering}
            hexOpacity={state.hexOpacity}
            showPoints={state.showPoints}
            showRegions={state.showRegions}
            isHome={isHome}
            zoom={state.zoom}
            setCenter={setCenter}
            initCenter={initCenter}
            changeBaseLayer={changeBaseLayer}
            changeBaseOpacity={changeBaseOpacity}
            changeClustering={changeClustering}
            changeHexOpacity={changeHexOpacity}
            setShowPoints={setShowPoints}
            setShowRegions={setShowRegions}
            changeMapBounds={changeMapBounds}
            geoJson={geoJson}
            showSearchArea={state.showSearchArea}
            changeSelectedElem={changeSelectedElem}
            selectedElem={state.selectedElem}
            changeShowSearchArea={changeShowSearchArea}
            searchThisArea={searchThisArea}
            currentURI={currentURI}
            setInitMapBounds={setInitMapBounds}
          />
        </Box>
      )}
    </>
  );
};
export default MapContainer;
