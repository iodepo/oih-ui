import { useRef, useReducer, useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ToolbarHome from "./components/ToolbarHome";
import ToolbarMapView from "./components/ToolbarMapView";
import { EMODNET, NO_CLUSTER } from "./utils/constants";
import { reducer } from "./utils/reducer";
import MapView from "./components/MapView";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DrawerContent from "./components/DrawerContent";
import { ITEMS_PER_PAGE } from "portability/configuration";
import { dataServiceUrl } from "config/environment";
import { mapLibreBounds_toQuery } from "utilities/mapUtility";
import { throttle } from "lodash";
import { useSearchParam } from "utilities/generalUtility";

const MapContainer = (props) => {
  const { isHome } = props;
  const [params] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, {
    baseLayer: EMODNET,
    clustering: NO_CLUSTER,
    hexOpacity: 0.4,
    baseOpacity: 0.4,
    showPoints: false,
    showRegions: false,
    zoom: 0,
    isLoading: false,
    center: [65.468754, 44.57875],
  });

  //Maybe move inside useReducer? Discuss

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
  const [mapBounds, setMapBounds] = useState(false);
  const [open, setOpen] = useState(true);
  const [facets, setFacets] = useState([]);

  const mapRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const lng = searchParams.get("lng");
    const lat = searchParams.get("lat");

    if (lng && lat) setCenter([lng, lat]);
  }, []);

  const hrefFor = (region, query) =>
    `/map-viewer?${new URLSearchParams({
      ...(query ? { search_text: query } : {}),
      ...(region && region.toUpperCase() !== "GLOBAL" ? { region } : {}),
    })}`;

  const handleSubmit = useCallback(
    () => navigate(hrefFor(region, searchText)),
    [navigate, searchText, region]
  );
  const changeBaseLayer = (layer) => {
    dispatch({ type: "setBaseLayer", baseLayer: layer });
  };

  const applyZoom = (zoomType) => {
    let value;
    if (zoomType === "out") {
      if (state.zoom >= 0) {
        value = -1;
      } else if (state.zoom < 0) {
        value = state.zoom - 1;
      }
    } else if (zoomType === "in") {
      if (state.zoom <= 0) {
        value = 1;
      } else if (state.zoom > 0) {
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

  useEffect(() => {
    getDataSpatialSearch();
  }, [navigate, params]);

  const getDataSpatialSearch = throttle((page = 1) => {
    page === 1 && setLoading(true);
    let URI = `${dataServiceUrl}/search?`;
    const params = new URLSearchParams({
      facetType: "the_geom",
      facetName: mapLibreBounds_toQuery(mapBounds, region),
      rows: ITEMS_PER_PAGE * page,
      start: 0,
    });
    if (searchText !== "") {
      params.append("search_text", searchText);
    }
    if (region && region.toUpperCase() !== "GLOBAL") {
      params.append("region", region);
    }
    URI += [params.toString()].filter((e) => e).join("&");

    fetch(URI)
      .then((response) => response.json())
      .then((json) => {
        setResults(json.docs);
        const count = json.count;
        setResultsCount(count);
        setFacets(json.facets.filter((facet) => facet.counts.length > 0));
        page === 1 && setLoading(false);
      });
  }, 1000);

  const palette = "custom.container.map.";

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
          centerMap={state.center}
        />
      )}

      {state && !isHome && (
        <Box>
          <Box display={"flex"} alignItems={"center"}>
            <Drawer
              sx={{
                width: "35%",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: "35%",
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerContent
                results={results}
                setSearchText={setSearchText}
                searchText={searchText}
                resultsCount={resultsCount}
                mapBounds={mapBounds}
                isLoading={state.loading}
                getDataSpatialSearch={getDataSpatialSearch}
                handleSubmit={handleSubmit}
              />
            </Drawer>
            {open ? (
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: "70%",
                  left: "35%",
                  background: "white",
                  borderRadius: "0 10px 10px 0",
                  paddingLeft: 0,
                  paddingRight: 0,
                  "&:hover": {
                    background: "#2B498C",
                    "& .MuiSvgIcon-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
                onClick={() => handleDrawer(false)}
              >
                <ChevronLeftIcon />
              </IconButton>
            ) : (
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: "70%",
                  left: "0%",
                  background: "white",
                  borderRadius: "0 10px 10px 0",
                  paddingLeft: 0,
                  paddingRight: 0,
                  "&:hover": {
                    background: "#2B498C",
                    "& .MuiSvgIcon-root": {
                      color: "#FFFFFF",
                    },
                  },
                }}
                onClick={() => handleDrawer(true)}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              height: "100vh",
              ...(!open && { position: "absolute", zIndex: -1, width: "100%" }),
              ...(open && {
                position: "absolute",
                zIndex: -1,
                right: 0,
                width: "65%",
              }),
            }}
          >
            <ToolbarMapView
              applyZoom={applyZoom}
              facets={facets}
              setRegion={setRegion}
              region={region}
              handleSubmit={handleSubmit}
            />
            <MapView
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
              centerMap={state.center}
            />
          </Box>
        </Box>
      )}
    </>
  );
};
export default MapContainer;
