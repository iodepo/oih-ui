import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useAppTranslation } from "context/context/AppTranslation";
import SearchMapMobile from "./SearchMapMobile";
import FilterMapMobile from "./FilterMapMobile";
import LayerMapMobile from "./LayerMapMobile";
import ResultsMapMobile from "./ResultsMapMobile";

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
  } = props;
  const translationState = useAppTranslation();

  const [filteredFacets, setFilteredFacets] = useState(facets);

  const [openPopoverFilter, setOpenPopoverFilter] = useState(null);

  const [openSwipeDrawer, setOpenSwipeDrawer] = useState(false);
  const [openLayerDrawer, setOpenLayerDrawer] = useState(false);

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
      const pairs = facetQuery.split("&");

      const extractedPairs = [];

      for (let i = 0; i < pairs.length; i += 2) {
        const facetType = pairs[i].split("=")[1];
        const facetName = decodeURIComponent(
          pairs[i + 1].split("=")[1].replaceAll("+", " ")
        );

        extractedPairs.push({ name: facetType, value: facetName });
      }

      setSelectedFacets(extractedPairs);
    }
  }, [facetQuery]);

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
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 9,
          width: "100%",
          paddingLeft: "8px",
          paddingRight: "8px",
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
          <LayerMapMobile
            setOpenLayerDrawer={setOpenLayerDrawer}
            applyZoom={applyZoom}
            openLayerDrawer={openLayerDrawer}
            changeBaseLayer={changeBaseLayer}
            baseLayer={baseLayer}
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
          />
        </Stack>
      </Box>
    </>
  );
};

export default ToolbarMobileMapView;
