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
    changeBaseOpacity,
    changeClustering,
    changeHexOpacity,
    setShowPoints,
    setShowRegions,
    geoJson,
    setMapBounds,
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
          geoJson={geoJson}
          setMapBounds={setMapBounds}
        />
      </Box>
    </>
  );
};

export default MobileMapView;