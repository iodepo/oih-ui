import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAppTranslation } from "context/context/AppTranslation";
import SearchMapMobile from "./SearchMapMobile";
import FilterMapMobile from "./FilterMapMobile";
import LayerMapMobile from "./LayerMapMobile";
import ResultsMapMobile from "./ResultsMapMobile";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";

const ToolbarMobileMapView = (props) => {
  const {
    searchText,
    setSearchText,
    handleSubmit,
    region,
    setRegion,
    facets,
    selectedFacets,
    facetQuery,
    setSelectedFacets,
    facetSearch,
    applyZoom,
    baseLayer,
    changeBaseLayer,
    clear,
    resultsCount,
    isLoading,
    results,
    getDataSpatialSearch,
    changeBaseOpacity,
    baseOpacity,
    changeClustering,
    clustering,
    changeHexOpacity,
    hexOpacity,
    setShowPoints,
    setShowRegions,
    showPoints,
    showRegions,
    selectedElem,
    changeSelectedElem,
    searchThisArea,
    showSearchArea,
    currentURI,
    mapBounds,
  } = props;
  const translationState = useAppTranslation();

  const [filteredFacets, setFilteredFacets] = useState(facets);

  const [openPopoverFilter, setOpenPopoverFilter] = useState(null);

  const [openSwipeDrawer, setOpenSwipeDrawer] = useState(false);
  const [openLayerDrawer, setOpenLayerDrawer] = useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, [region]);

  useEffect(() => {
    if (facets) setFilteredFacets(facets);
  }, [facets]);

  const isChecked = (name, value) => {
    return selectedFacets.some(
      (obj) => obj.name === name && obj.value === value
    );
  };

  useEffect(() => {
    if (facetQuery) {
      const pairs = facetQuery.split(" AND ");
      const extractedPairs = [];

      pairs.forEach((p) => {
        const temp = p.replace(/^\(|\)$/g, "");
        const tempPairs = temp.split(" OR ");
        tempPairs.forEach((t) => {
          const splitted = t.split(":");
          const facetType = splitted[0];
          const facetName = splitted[1].replace(/"/g, "");
          extractedPairs.push({ name: facetType, value: facetName });
        });
      });

      setSelectedFacets(extractedPairs);
    }
  }, [facetQuery, setSelectedFacets]);

  const handleInputChange = (value, name) => {
    setFilteredFacets(() => {
      return facets.map((facet) => {
        if (facet.name === name) {
          const filteredCounts = facet.counts.filter((count) =>
            count.name.toLowerCase().includes(value.toLowerCase())
          );
          return {
            ...facet,
            counts: filteredCounts,
          };
        }
        return facet;
      });
    });
  };
  const palette = "custom.mapView.mobile.toolbar.";
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 9,
          width: "100%",
          paddingLeft: "8px",
          paddingRight: "8px",
          zIndex: 2,
        }}
      >
        <Stack spacing={2}>
          <SearchMapMobile
            searchText={searchText}
            setSearchText={setSearchText}
            handleSubmit={handleSubmit}
          />
          <FilterMapMobile
            region={region}
            setRegion={setRegion}
            filteredFacets={filteredFacets}
            setOpenPopoverFilter={setOpenPopoverFilter}
            openPopoverFilter={openPopoverFilter}
            handleInputChange={handleInputChange}
            isChecked={isChecked}
            setSelectedFacets={setSelectedFacets}
            selectedFacets={selectedFacets}
            facetSearch={facetSearch}
          />
          {showSearchArea && (
            <Box
              sx={{
                zIndex: 2,
                position: "absolute",
                right: "32%",
                top: "100px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  textTransform: "unset",
                  backgroundColor: palette + "bgButton",
                  borderRadius: 8,
                  color: palette + "colorButton",
                  "&:hover": {
                    color: palette + "bgButton",
                    backgroundColor: palette + "colorButton",
                    ".MuiSvgIcon-root": {
                      color: palette + "bgButton",
                    },
                  },
                }}
                onClick={() => {
                  searchThisArea();
                  setOpenSwipeDrawer(true);
                }}
                startIcon={
                  <SearchIcon sx={{ color: palette + "colorButton" }} />
                }
              >
                Search this area
              </Button>
            </Box>
          )}

          <LayerMapMobile
            setOpenLayerDrawer={setOpenLayerDrawer}
            applyZoom={applyZoom}
            openLayerDrawer={openLayerDrawer}
            changeBaseLayer={changeBaseLayer}
            baseLayer={baseLayer}
            setOpenSettingsDrawer={setOpenSettingsDrawer}
            openSettingsDrawer={openSettingsDrawer}
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

          <ResultsMapMobile
            openSwipeDrawer={openSwipeDrawer}
            setOpenSwipeDrawer={setOpenSwipeDrawer}
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
            clear={clear}
            facetSearch={facetSearch}
            resultsCount={resultsCount}
            results={results}
            isLoading={isLoading}
            getDataSpatialSearch={getDataSpatialSearch}
            selectedElem={selectedElem}
            changeSelectedElem={changeSelectedElem}
            currentURI={currentURI}
            mapBounds={mapBounds}
          />
        </Stack>
      </Box>
    </>
  );
};

export default ToolbarMobileMapView;
