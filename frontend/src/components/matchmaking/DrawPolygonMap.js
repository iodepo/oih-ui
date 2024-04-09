import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { layers } from "components/map-view/utils/initMap";
import Box from "@mui/material/Box";
import { centerMap, initZoom } from "portability/configuration";

const DrawPolygonMap = (props) => {
  const { setGeojson, id } = props;

  useEffect(() => {
    const map = new maplibregl.Map({
      container: id,
      style: layers.ARCGIS,
      center: centerMap,
      zoom: initZoom,
    });

    // Personalizzazione dei controlli di MapboxDraw
    MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
    MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
    MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });
    map.addControl(draw);

    map.on("draw.create", updateArea);
    map.on("draw.delete", updateArea);
    map.on("draw.update", updateArea);

    function updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        setGeojson(data);
      } else {
        setGeojson(null);
        if (e.type !== "draw.delete")
          alert("Use the draw tools to draw a polygon!");
      }
    }

    return () => {
      map.removeControl(draw);
      map.remove();
    };
  }, []);

  return (
    <Box sx={{ border: "5px solid black", borderRadius: "4px" }}>
      <Box id={id} style={{ height: "500px" }}></Box>
    </Box>
  );
};

export default DrawPolygonMap;
