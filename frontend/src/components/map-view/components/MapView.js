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
    setMapBounds,
    geoJson,
    changeSelectedElem,
    changeShowSearchArea,
  } = props;
  const mapInitRef = useRef(null);
  var h3Resolution = 2;

  useEffect(() => {
    if (container.current && !isHome) {
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
  }, [clustering, hexOpacity, showPoints, showRegions]);

  useEffect(() => {
    if (zoom > 0) {
      mapInitRef.current.zoomIn();
    } else if (zoom < 0) {
      mapInitRef.current.zoomOut();
    }
  }, [zoom]);

  useEffect(() => {
    manageChangeOpacity(mapInitRef.current, baseOpacity, baseLayer);
  }, [baseOpacity]);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
      let zoom = 4;
      if (mapInitRef.current && !isHome) {
        zoom = mapInitRef.current.getZoom();
      }
      mapInitRef.current = initMap(
        container.current,
        initCenter,
        baseLayer,
        baseOpacity,
        zoom
      );

      mapInitRef.current.on("load", function () {
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
        mapInitRef.current &&
          manageChangeOpacity(mapInitRef.current, baseOpacity, baseLayer);
      });

      mapInitRef.current.on("moveend", function () {
        if (mapInitRef.current && !isHome) {
          setCenter([
            mapInitRef.current.getCenter().lng,
            mapInitRef.current.getCenter().lat,
          ]);

          changeShowSearchArea(true);

          setMapBounds(mapInitRef.current.getBounds());
        }
      });
    }
  }, [baseLayer, initCenter]);

  useEffect(() => {
    mapInitRef.current &&
      mapInitRef.current.on("zoom", () => {
        const currentZoom = mapInitRef.current && mapInitRef.current.getZoom();
        let h3ResNew = calculateH3Resolution(currentZoom);

        if (h3ResNew != h3Resolution) {
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
  }, [clustering, hexOpacity, showPoints, showRegions]);

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
