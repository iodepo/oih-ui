import React from "react";
import MapView from "../MapView";
import Box from "@mui/material/Box";
import ToolbarMobileMapView from "./ToolbarMobileMapView";

const MobileMapView = (props) => {
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
    changeBaseLayer,
  } = props;
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
        }}
      >
        <ToolbarMobileMapView
          setSearchText={setSearchText}
          searchText={searchText}
          handleSubmit={handleSubmit}
          applyZoom={applyZoom}
          facets={facets}
          setRegion={setRegion}
          region={region}
          facetSearch={facetSearch}
          facetQuery={facetQuery}
          setSelectedFacets={setSelectedFacets}
          selectedFacets={selectedFacets}
          baseLayer={baseLayer}
          changeBaseLayer={changeBaseLayer}
          clear={clear}
          resultsCount={resultsCount}
          results={results}
          isLoading={isLoading}
          getDataSpatialSearch={getDataSpatialSearch}
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

export default MobileMapView;
