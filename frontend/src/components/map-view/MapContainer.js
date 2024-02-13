import { useRef, useReducer, useState, useEffect } from "react";
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

const MapContainer = (props) => {
  const { isHome } = props;
  const [state, dispatch] = useReducer(reducer, {
    baseLayer: EMODNET,
    clustering: NO_CLUSTER,
    hexOpacity: 0.4,
    baseOpacity: 0.4,
    showPoints: false,
    showRegions: false,
    zoom: "none",
    region: "Global",
  });

  //Maybe move inside useReducer? Discuss

  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [resultsCount, setResultsCount] = useState(0);
  const [mapBounds, setMapBounds] = useState(false);

  const mapRef = useRef(null);

  const changeBaseLayer = (layer) => {
    dispatch({ type: "setBaseLayer", baseLayer: layer });
  };

  const applyZoom = (zoomType) => {
    dispatch({ type: "setZoom", zoom: zoomType });
  };
  const stopZoom = () => {
    dispatch({ type: "setZoom", zoom: "none" });
  };
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDataSpatialSearch();
  }, []);

  const getDataSpatialSearch = throttle(() => {
    let URI = `${dataServiceUrl}/search?`;
    const params = new URLSearchParams({
      facetType: "the_geom",
      facetName: mapLibreBounds_toQuery(mapBounds, /* region */ "GLOBAL"),
      rows: ITEMS_PER_PAGE,
      start: 0,
    });
    if (searchText !== "") {
      params.append("search_text", searchText);
    }
    /* if (region && region.toUpperCase() !== "GLOBAL") {
    params.append("region", "GLOBAL");
    } */
    URI += [params.toString()].filter((e) => e).join("&");

    fetch(URI)
      .then((response) => response.json())
      .then((json) => {
        setResults(json.docs);
        const count = json.count;
        setResultsCount(count);
      });
  }, 1000);

  const palette = "custom.container.map.";

  return (
    <>
      {isHome && <ToolbarHome changeBaseLayer={changeBaseLayer} />}
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
          stopZoom={stopZoom}
          isHome={isHome}
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
                resultsCount={resultsCount}
                mapBounds={mapBounds}
                getDataSpatialSearch={getDataSpatialSearch}
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
                onClick={handleDrawerClose}
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
                onClick={handleDrawerOpen}
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
            <ToolbarMapView applyZoom={applyZoom} />
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
              stopZoom={stopZoom}
            />
          </Box>
        </Box>
      )}
    </>
  );
};
export default MapContainer;
