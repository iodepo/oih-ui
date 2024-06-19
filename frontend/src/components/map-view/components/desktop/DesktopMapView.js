import React, { useState, useEffect } from "react";
import ToolbarDesktopMapView from "./ToolbarDesktopMapView";
import MapView from "../MapView";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DrawerContainer from "./drawer/DrawerContainer";

const DesktopMapView = (props) => {
  const {
    results,
    setSearchText,
    searchText,
    resultsCount,
    getDataSpatialSearch,
    isLoading,
    handleSubmit,
    setSelectedFacets,
    selectedFacets,
    facetSearch,
    clear,
    open,
    handleDrawer,
    applyZoom,
    facets,
    setRegion,
    facetQuery,
    container,
    baseLayer,
    baseOpacity,
    hexOpacity,
    showPoints,
    showRegions,
    isHome,
    zoom,
    setCenter,
    initCenter,
    clustering,
    region,
    changeBaseLayer,
    changeBaseOpacity,
    changeClustering,
    changeHexOpacity,
    setShowPoints,
    setShowRegions,
    heatOpacity,
    changeHeatOpacity,
    changeMapBounds,
    geoJson,
    changeShowSearchArea,
    showSearchArea,
    changeSelectedElem,
    selectedElem,
    searchThisArea,
    currentURI,
    setInitMapBounds,
    mapBounds,
    initMapBounds,
    changeZoom,
  } = props;

  const palette = "custom.mapView.desktop.";
  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <Drawer
          sx={{
            width: window.innerWidth < 1400 ? "40%" : "30%",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: window.innerWidth < 1400 ? "40%" : "30%",
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerContainer
            results={results}
            setSearchText={setSearchText}
            searchText={searchText}
            resultsCount={resultsCount}
            isLoading={isLoading}
            getDataSpatialSearch={getDataSpatialSearch}
            handleSubmit={handleSubmit}
            setSelectedFacets={setSelectedFacets}
            selectedFacets={selectedFacets}
            facetSearch={facetSearch}
            clear={clear}
            changeSelectedElem={changeSelectedElem}
            selectedElem={selectedElem}
            currentURI={currentURI}
            mapBounds={mapBounds}
            initMapBounds={initMapBounds}
          />
        </Drawer>
        {open ? (
          <IconButton
            sx={{
              position: "absolute",
              bottom: "70%",
              left: window.innerWidth < 1400 ? "40%" : "30%",
              backgroundColor: palette + "bgIconHandleDrawer",
              borderRadius: "0 10px 10px 0",
              paddingLeft: 0,
              paddingRight: 0,
              "&:hover": {
                backgroundColor: palette + "bgIconHandleDrawerHover",
                "& .MuiSvgIcon-root": {
                  color: palette + "colorIconHandleDrawerHover",
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
              backgroundColor: palette + "bgIconHandleDrawer",
              borderRadius: "0 10px 10px 0",
              paddingLeft: 0,
              paddingRight: 0,
              "&:hover": {
                backgroundColor: palette + "bgIconHandleDrawerHover",
                "& .MuiSvgIcon-root": {
                  color: palette + "colorIconHandleDrawerHover",
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
            width: window.innerWidth < 1400 ? "60%" : "70%",
          }),
        }}
      >
        <ToolbarDesktopMapView
          applyZoom={applyZoom}
          facets={facets}
          setRegion={setRegion}
          region={region}
          handleSubmit={handleSubmit}
          facetSearch={facetSearch}
          facetQuery={facetQuery}
          setSelectedFacets={setSelectedFacets}
          selectedFacets={selectedFacets}
          baseLayer={baseLayer}
          changeBaseLayer={changeBaseLayer}
          changeBaseOpacity={changeBaseOpacity}
          baseOpacity={baseOpacity}
          changeClustering={changeClustering}
          clustering={clustering}
          hexOpacity={hexOpacity}
          changeHexOpacity={changeHexOpacity}
          setShowPoints={setShowPoints}
          setShowRegions={setShowRegions}
          showPoints={showPoints}
          showRegions={showRegions}
          heatOpacity={heatOpacity}
          changeHeatOpacity={changeHeatOpacity}
          showSearchArea={showSearchArea}
          searchThisArea={searchThisArea}
        />
        <MapView
          container={container}
          baseLayer={baseLayer}
          baseOpacity={baseOpacity}
          clustering={clustering}
          hexOpacity={hexOpacity}
          showPoints={showPoints}
          showRegions={showRegions}
          isHome={isHome}
          zoom={zoom}
          setCenter={setCenter}
          initCenter={initCenter}
          changeMapBounds={changeMapBounds}
          geoJson={geoJson}
          changeShowSearchArea={changeShowSearchArea}
          showSearchArea={showSearchArea}
          changeSelectedElem={changeSelectedElem}
          selectedElem={selectedElem}
          setInitMapBounds={setInitMapBounds}
          changeZoom={changeZoom}
        />
      </Box>
    </>
  );
};

export default DesktopMapView;
