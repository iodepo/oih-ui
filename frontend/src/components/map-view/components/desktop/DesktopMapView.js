import React, { useState, useEffect } from "react";
import ToolbarDesktopMapView from "./ToolbarDesktopMapView";
import MapView from "../MapView";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DrawerContent from "./DrawerContent";

const DesktopMapView = (props) => {
  const {
    results,
    setSearchText,
    searchText,
    resultsCount,
    mapBounds,
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
  } = props;

  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <Drawer
          sx={{
            width:
              window.innerWidth < 1600 && window.innerWidth > 1400
                ? "20%"
                : "30%",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width:
                window.innerWidth < 1600 && window.innerWidth > 1400
                  ? "20%"
                  : "30%",
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
            isLoading={isLoading}
            getDataSpatialSearch={getDataSpatialSearch}
            handleSubmit={handleSubmit}
            setSelectedFacets={setSelectedFacets}
            selectedFacets={selectedFacets}
            facetSearch={facetSearch}
            clear={clear}
          />
        </Drawer>
        {open ? (
          <IconButton
            sx={{
              position: "absolute",
              bottom: "70%",
              left:
                window.innerWidth < 1600 && window.innerWidth > 1400
                  ? "20%"
                  : "30%",
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
            width:
              window.innerWidth < 1600 && window.innerWidth > 1400
                ? "80%"
                : "70%",
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
        />
      </Box>
    </>
  );
};

export default DesktopMapView;
