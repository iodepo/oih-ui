import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAppTranslation } from "context/context/AppTranslation";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsIcon from "@mui/icons-material/Settings";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import FilterMapDesktop from "./FilterMapDesktop";
import SettingsMapDesktop from "./SettingsMapDesktop";
import LayerMapDesktop from "./LayerMapDesktop";
import {
  HEATMAP_LEGENDA,
  HEATMAP_REGIONS,
  HEXAGON,
  HEXAGON_LEGENDA,
  NO_CLUSTER,
} from "components/map-view/utils/constants";

const ToolbarDesktopMapView = (props) => {
  const {
    applyZoom,
    facets,
    setRegion,
    region,
    handleSubmit,
    facetSearch,
    facetQuery,
    selectedFacets,
    setSelectedFacets,
    baseLayer,
    changeBaseLayer,
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
    heatOpacity,
    changeHeatOpacity,
    showSearchArea,
    searchThisArea,
  } = props;
  const [filteredFacets, setFilteredFacets] = useState(facets);

  const [openPopoverFilter, setOpenPopoverFilter] = useState(null);
  const [openFilterMap, setOpenFilterMap] = useState(false);
  const [openLayerMap, setOpenLayerMap] = useState(false);

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
      const pairs = facetQuery.replace(/^\(|\)$/g, "").split(" OR ");

      const extractedPairs = [];

      for (let i = 0; i < pairs.length; i++) {
        const splitted = pairs[i].split(":");
        const facetType = splitted[0];
        const facetName = splitted[1].replace(/"/g, "");
        extractedPairs.push({ name: facetType, value: facetName });
      }

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

  const translationState = useAppTranslation();
  const palette = "custom.mapView.desktop.toolbar.";
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FilterMapDesktop
            region={region}
            filteredFacets={filteredFacets}
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
            setOpenPopoverFilter={setOpenPopoverFilter}
            openPopoverFilter={openPopoverFilter}
            handleInputChange={handleInputChange}
            isChecked={isChecked}
            setRegion={setRegion}
            facetSearch={facetSearch}
          />
        </Box>
      </Box>
      {showSearchArea && (
        <Box
          sx={{ zIndex: 2, position: "absolute", right: "45%", top: "100px" }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "unset",
              backgroundColor: "white",
              borderRadius: 8,
              color: "#1A2C54",
              "&:hover": {
                color: "white",
                backgroundColor: "#1A2C54",
                ".MuiSvgIcon-root": {
                  color: "white",
                },
              },
            }}
            onClick={() => searchThisArea()}
            startIcon={<SearchIcon sx={{ color: "#1A2C54" }} />}
          >
            Search this area
          </Button>
        </Box>
      )}

      <Stack
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 40,
          paddingLeft: "8px",
          paddingRight: "8px",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 2,
        }}
        direction={"row"}
        spacing={2}
      >
        <Box
          sx={{
            width: "20%",
            height: "250px",
            display: openLayerMap && "none",
          }}
        >
          <Fade in={openFilterMap} mountOnEnter unmountOnExit>
            <Box
              sx={{
                backgroundColor:
                  clustering === NO_CLUSTER
                    ? "transparent"
                    : palette + "bgBox2",
                height: "100%",
                borderRadius: "6px",

                padding: "12px",
              }}
            >
              {clustering !== NO_CLUSTER && (
                <Stack spacing={1.5} sx={{ padding: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    COLOR - POINTS PER{" "}
                    {clustering === HEXAGON ? "HEXAGON" : "HEATMAP"}
                  </Typography>
                  {clustering === HEXAGON &&
                    HEXAGON_LEGENDA.map((h, index) => {
                      const [value, color] = h;
                      return (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              width: `15px`,
                              height: `15px`,
                              backgroundColor: color,
                              position: "relative",
                              clipPath:
                                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            }}
                          />
                          <Typography variant="body2">{value}</Typography>
                        </Box>
                      );
                    })}

                  {clustering === HEATMAP_REGIONS &&
                    HEATMAP_LEGENDA.map((h, index) => {
                      const [value, color] = h;
                      return (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              width: `15px`,
                              height: `15px`,
                              backgroundColor: color,
                              borderRadius: "50%",
                            }}
                          />
                          <Typography variant="body2">{value}</Typography>
                        </Box>
                      );
                    })}
                </Stack>
              )}
            </Box>
          </Fade>
        </Box>

        <Box
          sx={{
            width: openFilterMap && !openLayerMap ? "75%" : "unset",
            height: "250px",
          }}
        >
          {openFilterMap && !openLayerMap && (
            <SettingsMapDesktop
              openFilterMap={openFilterMap}
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
            />
          )}
          {openLayerMap && !openFilterMap && (
            <LayerMapDesktop
              openLayerMap={openLayerMap}
              baseLayer={baseLayer}
              changeBaseLayer={changeBaseLayer}
              baseOpacity={baseOpacity}
              changeBaseOpacity={changeBaseOpacity}
            />
          )}
        </Box>

        <Box
          sx={{
            width: "5%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <IconButton
            sx={{
              backgroundColor: palette + "bgButton",
              borderRadius: 2,
              width: "45px",
              "&:hover": {
                backgroundColor: palette + "colorIcon",
                "& .MuiSvgIcon-root": {
                  color: palette + "bgButton",
                },
              },
            }}
            onClick={() => {
              setOpenFilterMap(!openFilterMap);
              setOpenLayerMap(false);
            }}
          >
            <SettingsIcon sx={{ color: palette + "colorIcon" }} />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: palette + "bgButton",
              borderRadius: 2,
              width: "45px",
              "&:hover": {
                backgroundColor: palette + "colorIcon",
                "& .MuiSvgIcon-root": {
                  color: palette + "bgButton",
                },
              },
            }}
            onClick={() => {
              setOpenFilterMap(false);
              setOpenLayerMap(!openLayerMap);
            }}
          >
            <LayersIcon sx={{ color: palette + "colorIcon" }} />
          </IconButton>
          <ButtonGroup
            orientation="vertical"
            variant="contained"
            sx={{
              backgroundColor: palette + "bgButton",
              borderRadius: 2,
              width: "45px",
              boxShadow: 0,
            }}
          >
            <IconButton onClick={() => applyZoom("in")}>
              <AddIcon sx={{ color: palette + "colorIcon" }} />
            </IconButton>
            <IconButton onClick={() => applyZoom("out")}>
              <RemoveIcon sx={{ color: palette + "colorIcon" }} />
            </IconButton>
          </ButtonGroup>
        </Box>
      </Stack>
    </>
  );
};

export default ToolbarDesktopMapView;
