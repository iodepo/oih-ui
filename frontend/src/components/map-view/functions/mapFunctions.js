import { useState, useEffect, useRef } from "react";
import { initMap } from "../utils/initMap";

import data from "../data/spatial.geojson.json";
import maplibregl from "maplibre-gl";
import polygonH3_2 from "../data/poligonToH3_2.json";
import polygonH3_3 from "../data/poligonToH3_3.json";
import geojson2h3 from "geojson2h3";
import { latLngToCell } from "h3-js";
import {
  HEATMAP_POINTS,
  HEATMAP_POINTS_SOURCE,
  HEXAGON,
  HEXAGON_LAYER,
  HEXAGON_SOURCE,
  POINTS_LAYER,
  POINTS_SOURCE,
  HEATMAP_REGIONS_LAYER,
  HEATMAP_REGIONS_SOURCE,
  HEATMAP_REGIONS,
  HEATMAP_POINTS_LAYER,
  REGIONS_LAYER,
  REGIONS_SOURCE,
  ID_EMODNET,
  ID_ARCGIS,
  ID_USGS,
  EMODNET,
  ARCGIS,
  USGS,
} from "../utils/constants";
import { fetchDetail } from "utilities/generalUtility";

export function calculateH3Resolution(currentZoom) {
  if (currentZoom < 6) {
    return 2;
  } else {
    return 3;
  }
}

export function fixTransmeridianCoord(coord) {
  const lng = coord[0];
  coord[0] = lng < 0 ? lng + 360 : lng;
}

export function fixTransmeridianLoop(loop) {
  let isTransmeridian = false;
  for (let i = 0; i < loop.length; i++) {
    // check for arcs > 180 degrees longitude, flagging as transmeridian
    if (Math.abs(loop[0][0] - loop[(i + 1) % loop.length][0]) > 180) {
      isTransmeridian = true;
      break;
    }
  }
  if (isTransmeridian) {
    loop.forEach(fixTransmeridianCoord);
  }
}

export function fixTransmeridianPolygon(polygon) {
  polygon.forEach(fixTransmeridianLoop);
}

export function fixTransmeridian(feature) {
  const { type } = feature;
  if (type == "FeatureCollection") {
    feature.features.map(fixTransmeridian);
    return;
  }
  const { type: geometryType, coordinates } = feature.geometry;
  switch (geometryType) {
    case "LineString":
      fixTransmeridianLoop(coordinates);
      return;
    case "Polygon":
      fixTransmeridianPolygon(coordinates);
      return;
    case "MultiPolygon":
      coordinates.forEach(fixTransmeridianPolygon);
      return;
    default:
      throw new Error(`Unknown geometry type: ${geometryType}`);
  }
}

export function pointsToH2(point_polygon_data, layer, h3Resolution) {
  point_polygon_data.forEach((point) => {
    let hexagon = latLngToCell(
      point.geometry.coordinates[0],
      point.geometry.coordinates[1],
      h3Resolution
    );
    // var hexagons = geojson2h3.featureToH3Set(point, h3Resolution)
    layer[hexagon] = layer[hexagon] ? layer[hexagon] + 1 : 1;
  });
  return layer;
}

export function polygonsToH3(polygon_polygon_data, layer, h3Resolution) {
  polygon_polygon_data.forEach((polygon) => {
    var hexagons = geojson2h3.featureToH3Set(polygon, h3Resolution);
    hexagons.forEach((h3Index) => {
      layer[h3Index] = layer[h3Index] ? layer[h3Index] + 1 : 1;
    });
  });

  // fs.writeFile('../data/poligonToH3_'+h3Resolution+'.txt', layer, (err) => {
  //     if (err) {
  //         console.log('Error writing file:', err);
  //     } else {
  //         console.log('Successfully wrote file');
  //     }
  // });

  return layer;
}

function getIdLayer(baseLayer) {
  let idLayer;
  switch (baseLayer) {
    case EMODNET:
      idLayer = ID_EMODNET;
      break;
    case ARCGIS:
      idLayer = ID_ARCGIS;
      break;
    case USGS:
      idLayer = ID_USGS;
      break;
    default:
      break;
  }
  return idLayer;
}

export function manageChangeOpacity(map, baseOpacity, baseLayer) {
  if (map) {
    let idLayer = getIdLayer(baseLayer);
    if (map.getStyle()) {
      var layers = map.getStyle().layers;

      layers.forEach((l) => {
        if (l.id == idLayer) {
          map.setPaintProperty(l.id, "raster-opacity", baseOpacity);
        }
      });
    }
  }
}

export function manageLayers(
  map,
  clustering,
  hexOpacity,
  heatOpacity,
  showPoints,
  showRegions,
  h3Resolution,
  geoJson,
  changeSelectedElem
) {
  if (geoJson) {
    var polygon_data = geoJson["features"].filter(
      (shape) => shape["geometry"]["type"] == "Polygon"
    );
    var point_polygon_data = geoJson["features"].filter(
      (shape) => shape["geometry"]["type"] == "Point"
    );

    // latLngToCell(37.3615593, -122.0553238, 7);

    // console.log(polygon_data.length)
    // console.log(point_polygon_data)

    if (showRegions) {
      remove_regions(map);
      draw_regions(map, polygon_data, changeSelectedElem);
    } else {
      remove_regions(map);
    }

    if (showPoints) {
      remove_points(map);
      draw_points(map, point_polygon_data, changeSelectedElem);
    } else {
      remove_points(map);
    }
  }

  switch (clustering) {
    case HEXAGON:
      removeLayersAndSources(map, HEXAGON_LAYER, HEXAGON_SOURCE);
      removeLayersAndSources(map, HEATMAP_POINTS_LAYER, HEATMAP_POINTS_SOURCE);
      removeLayersAndSources(
        map,
        HEATMAP_REGIONS_LAYER,
        HEATMAP_REGIONS_SOURCE
      );

      if (!map.getSource(HEXAGON_SOURCE)) {
        hexagon_clustering(h3Resolution, map, polygon_data, hexOpacity);
      } else {
        map.setPaintProperty(HEXAGON_LAYER, "fill-opacity", hexOpacity);
      }
      break;

    case HEATMAP_POINTS:
      removeLayersAndSources(map, HEXAGON_LAYER, HEXAGON_SOURCE);
      removeLayersAndSources(
        map,
        HEATMAP_REGIONS_LAYER,
        HEATMAP_REGIONS_SOURCE
      );
      removeLayersAndSources(map, HEATMAP_POINTS_LAYER, HEATMAP_POINTS_SOURCE);
      if (!map.getSource(HEATMAP_POINTS_SOURCE)) {
        heatmap_clustering(
          map,
          point_polygon_data,
          HEATMAP_POINTS_SOURCE,
          HEATMAP_POINTS_LAYER
        );
      }
      break;

    case HEATMAP_REGIONS:
      removeLayersAndSources(map, HEXAGON_LAYER, HEXAGON_SOURCE);
      removeLayersAndSources(map, HEATMAP_POINTS_LAYER, HEATMAP_POINTS_SOURCE);
      removeLayersAndSources(
        map,
        HEATMAP_REGIONS_LAYER,
        HEATMAP_REGIONS_SOURCE
      );

      if (!map.getSource(HEATMAP_REGIONS_SOURCE)) {
        heatmap_clustering(
          map,
          polygon_data,
          HEATMAP_REGIONS_SOURCE,
          HEATMAP_REGIONS_LAYER
        );
      } else {
        //map.setPaintProperty(HEATMAP_REGIONS_LAYER, "fill-opacity", heatOpacity);
      }
      break;

    default:
      removeLayersAndSources(map, HEXAGON_LAYER, HEXAGON_SOURCE);
      removeLayersAndSources(map, HEATMAP_POINTS_LAYER, HEATMAP_POINTS_SOURCE);
      removeLayersAndSources(
        map,
        HEATMAP_REGIONS_LAYER,
        HEATMAP_REGIONS_SOURCE
      );
      break;
  }
}

function removeLayersAndSources(map, layer, source) {
  if (map.getLayer(layer)) {
    map.removeLayer(layer);
    if (map.getSource(source)) {
      map.removeSource(source);
    }
  }
}

export function heatmap_clustering(map, geometry_data, source, layer) {
  // 'https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson'
  map.addSource(source, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: geometry_data,
    },
  });

  map.addLayer({
    id: layer,
    type: "heatmap",
    source: source,
    maxzoom: 9,
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.2,
        "rgb(103,169,207)",
        0.4,
        "rgb(209,229,240)",
        0.6,
        "rgb(253,219,199)",
        0.8,
        "rgb(239,138,98)",
        1,
        "rgb(178,24,43)",
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
    },
  });
}

export function remove_regions(map) {
  if (map.getLayer(REGIONS_LAYER)) {
    map.removeLayer(REGIONS_LAYER);
    if (map.getSource(REGIONS_SOURCE)) {
      map.removeSource(REGIONS_SOURCE);
    }
  }
}

export function remove_points(map) {
  if (map.getLayer("selected-point")) {
    map.removeLayer("selected-point");
    map.removeSource("selected-point");
  }
  if (map.getLayer(POINTS_LAYER)) {
    map.removeLayer(POINTS_LAYER);
    if (map.getSource(POINTS_SOURCE)) {
      map.removeSource(POINTS_SOURCE);
    }
  }
}

export function draw_regions(map, polygon_data, changeSelectedElem) {
  if (!map.getSource(REGIONS_SOURCE) && !map.getLayer(REGIONS_LAYER)) {
    map.addSource(REGIONS_SOURCE, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: polygon_data,
      },
    });
    var selectedId = 1;
    map.addLayer({
      id: REGIONS_LAYER,
      type: "fill",
      source: REGIONS_SOURCE,
      filter: [
        "all",
        ["==", ["geometry-type"], "Polygon"],
        ["has", "geom_length"],
        [
          "<",
          ["number", ["get", "geom_length"]],
          ["/", 350, ["^", 2, ["zoom"]]],
        ],
        [
          ">",
          ["number", ["get", "geom_length"]],
          ["/", 15, ["^", 2, ["zoom"]]],
        ], // ~.7 px/deg @zoom=0
      ],
      paint: {
        "fill-outline-color": [
          "step",
          ["zoom"],
          "rgba(0,0,0,0)",
          2.5,
          [
            "case",
            ["==", ["get", "id"], selectedId ?? null],
            "green",
            "rgba(0,0,225,.5)",
          ],
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["get", "geom_length"],
          0,
          1,
          10,
          0.2,
          100,
          0.1,
        ],
        "fill-color": [
          "case",
          ["==", ["get", "id"], selectedId ?? null],
          "rgba(0,225,0,.5)",
          "rgba(0,0,225,.1)",
        ],
      },
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", REGIONS_LAYER, async (e) => {
      map.getCanvas().style.cursor = "pointer";

      const coordinates = e.lngLat;
      const id = e.features[0].properties.id;

      const details = await fetchDetail(id).then((d) => d);
      popup.setLngLat(coordinates).setHTML(details.name).addTo(map);

      setTimeout(() => {
        popup.remove();
      }, 4000);
    });

    map.on("mouseleave", REGIONS_LAYER, () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("click", REGIONS_LAYER, async (e) => {
      popup.remove();
      const id = e.features[0].properties.id;

      const details = await fetchDetail(id).then((d) => d);

      map.setPaintProperty(REGIONS_LAYER, "fill-color", [
        "case",
        ["==", ["get", "id"], id],
        "rgba(0,225,0,.5)",
        "rgba(0,0,225,.1)",
      ]);

      changeSelectedElem(details);
    });
  }
}

export function draw_points(map, point_polygon_data, changeSelectedElem) {
  if (!map.getSource(POINTS_SOURCE) && !map.getLayer(POINTS_LAYER)) {
    map.addSource(POINTS_SOURCE, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: point_polygon_data,
      },
    });

    map.addLayer({
      id: POINTS_LAYER,
      type: "symbol", // Change layer type to symbol for using icons
      source: POINTS_SOURCE,
      layout: {
        "icon-image": "custom-marker", // Use the custom SVG icon as the marker
        "icon-size": 0.2, // Adjust icon size if necessary
        "icon-anchor": "center",
        // Adjust icon anchor if necessary
      },
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", POINTS_LAYER, async (e) => {
      map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const id = e.features[0].properties.id;

      const details = await fetchDetail(id).then((d) => d);

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(details.name).addTo(map);

      setTimeout(() => {
        popup.remove();
      }, 4000);
    });

    map.on("mouseleave", POINTS_LAYER, () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("click", POINTS_LAYER, async (e) => {
      popup.remove();
      const features = e.features[0];
      const id = features.properties.id;

      const details = await fetchDetail(id).then((d) => d);
      if (map.getLayer("selected-point")) {
        map.removeLayer("selected-point");
        map.removeSource("selected-point");
      }
      map.addLayer({
        id: "selected-point",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [features],
          },
        },
        layout: {
          "icon-image": "custom-marker-selected",
          "icon-size": 0.2,
          "icon-anchor": "center",
        },
      });

      changeSelectedElem(details);
    });
  }
}

export function hexagon_clustering(
  h3Resolution,
  map,
  polygon_data,
  hexOpacity
) {
  var layer = {};
  layer = polygonsToH3(polygon_data, layer, h3Resolution);
  /*  if (h3Resolution == 2) {
    layer = polygonH3_2;
  } else {
    layer = polygonH3_3;
  }
 */
  console.log(layer);

  const geojson = geojson2h3.h3SetToFeatureCollection(
    Object.keys(layer),
    (hex) => ({ value: layer[hex] })
  );

  fixTransmeridian(geojson);
  // console.log(geojson['features'].slice(2,3))
  // geojson['features'] = geojson['features'].slice(2,3)

  let source = map.getSource(HEXAGON_SOURCE);

  // Add the source and layer if we haven't created them yet
  if (!source) {
    map.addSource(HEXAGON_SOURCE, {
      type: "geojson",
      data: geojson,
    });
    map.addLayer({
      id: HEXAGON_LAYER,
      source: HEXAGON_SOURCE,
      type: "fill",
      interactive: false,
      // paint: {
      // 'fill-outline-color': 'rgba(0,0,0,0)',
      // }
    });

    source = map.getSource(HEXAGON_SOURCE);
    source.setData(geojson);
  }

  // Update the geojson data

  // Update the layer paint properties, using the current config values
  map.setPaintProperty(HEXAGON_LAYER, "fill-color", {
    property: "value",
    stops: [
      [25, "rgba(255, 255, 255, 0)"],

      [50, "#49958b"],

      [75, "#40857c"],

      [100, "#38756e"],

      [200, "#30635d"],
    ],
    // stops: [
    //     [8, '#ffffff'],
    //     [12, '#ff417e'],
    //     [15, '#ff9f50'],
    //     [20, '#ff6f63'],
    //     [200, '#ff417e']
    //   ]
    // stops: [
    //   [10, '#51a79a'],
    //   [20, '#3c7b73'],
    //   [30, '#2f6059'],
    //   [50, '#224340'],
    //   [100, '#1b3733'],
    //   [200, '#142825']
    // ]
  });
  map.setPaintProperty(HEXAGON_LAYER, "fill-opacity", hexOpacity);
}
