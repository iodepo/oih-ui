import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { layers } from "components/map-view/utils/initMap";
import Box from "@mui/material/Box";

const DrawPolygonMap = () => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: layers.ARCGIS,
      center: [-91.874, 42.76],
      zoom: 4,
    });

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
      const answer = document.getElementById("calculated-area");
      if (data.features.length > 0) {
        const area = turf.area(data);
        const roundedArea = Math.round(area * 100) / 100;
        answer.innerHTML = `<p><strong>${roundedArea}</strong></p><p>square meters</p>`;
      } else {
        answer.innerHTML = "";
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
    <>
      <Box id="map" style={{ height: "100vh" }}></Box>
      <Box className="calculation-box">
        <p>Draw a polygon using the draw tools.</p>
        <Box id="calculated-area"></Box>
      </Box>
    </>
  );
};

export default DrawPolygonMap;
