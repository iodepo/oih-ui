import React, { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import { initMap } from "../utils/initMap";
import {
  calculateH3Resolution,
  manageChangeOpacity,
  manageLayers,
} from "../functions/mapFunctions";

const MapView = (props) => {
  const {
    container,
    clustering,
    hexOpacity,
    showPoints,
    showRegions,
    baseLayer,
    baseOpacity,
    isHome,
    zoom,
    setCenter,
    initCenter,
    heatOpacity,
    changeMapBounds,
    geoJson,
    changeSelectedElem,
    changeShowSearchArea,
    selectedElem,
    setInitMapBounds,
    changeZoom,
  } = props;
  const mapInitRef = useRef(null);
  var h3Resolution = 2;

  useEffect(() => {
    if (container.current) {
      mapInitRef.current &&
        manageLayers(
          mapInitRef.current,
          clustering,
          hexOpacity,
          heatOpacity,
          showPoints,
          showRegions,
          h3Resolution,
          geoJson,
          changeSelectedElem
        );
    }
  }, [clustering, hexOpacity, showPoints, showRegions, geoJson]);

  useEffect(() => {
    if (mapInitRef.current && zoom) {
      const currentZoom = mapInitRef.current.getZoom();
      if (currentZoom < zoom) {
        mapInitRef.current.zoomTo(zoom);
      } else {
        changeZoom(zoom + 1);
      }
    }
  }, [zoom]);

  useEffect(() => {
    if (!selectedElem && mapInitRef.current) {
      if (mapInitRef.current.getLayer("selected-point")) {
        mapInitRef.current.removeLayer("selected-point");
        mapInitRef.current.removeSource("selected-point");
      }
      manageLayers(
        mapInitRef.current,
        clustering,
        hexOpacity,
        heatOpacity,
        showPoints,
        showRegions,
        h3Resolution,
        geoJson,
        changeSelectedElem
      );
    }
  }, [selectedElem, mapInitRef]);

  useEffect(() => {
    manageChangeOpacity(mapInitRef.current, baseOpacity, baseLayer);
  }, [baseOpacity]);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
      let initZoom = zoom;
      if (mapInitRef.current && !isHome) {
        initZoom = mapInitRef.current.getZoom();
      }
      mapInitRef.current = initMap(
        container.current,
        initCenter,
        baseLayer,
        baseOpacity,
        initZoom
      );
      setInitMapBounds(mapInitRef.current.getBounds());
      manageChangeOpacity(mapInitRef.current, baseOpacity, baseLayer);

      mapInitRef.current.on("moveend", function () {
        if (mapInitRef.current && !isHome) {
          setCenter([
            mapInitRef.current.getCenter().lng,
            mapInitRef.current.getCenter().lat,
          ]);
          changeShowSearchArea(true);
          changeMapBounds(mapInitRef.current.getBounds());
        }
      });
    }
  }, [baseLayer, initCenter]);
  /* 
  useEffect(() => {
    mapInitRef.current &&
      mapInitRef.current.on("zoom", () => {
        const currentZoom = mapInitRef.current && mapInitRef.current.getZoom();
        let h3ResNew = calculateH3Resolution(currentZoom);

        if (h3ResNew !== h3Resolution) {
          h3Resolution = h3ResNew;
          mapInitRef.current &&
            !isHome &&
            manageLayers(
              mapInitRef.current,
              clustering,
              hexOpacity,
              heatOpacity,
              showPoints,
              showRegions,
              h3Resolution,
              geoJson,
              changeSelectedElem
            );
        }
      });
  }, [clustering, hexOpacity, showPoints, showRegions, geoJson]); */

  return (
    <Box
      ref={container}
      id="map"
      className="map"
      sx={{
        ...(isHome && {
          borderRadius: "20px",
        }),
        height: "100% !important",
        overflow: "hidden",
      }}
    />
  );
};

export default MapView;
