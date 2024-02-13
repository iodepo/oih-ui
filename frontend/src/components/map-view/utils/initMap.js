import maplibregl from "maplibre-gl";

export const layers = {
  DEMO_TILES: "https://demotiles.maplibre.org/style.json",
  NATURAL_EARTH_TILES: {
    version: 8,
    metadata: "Made with liquid💦: RobLabs.com/xyz",
    name: "Natural Earth Tiles",
    bearing: 0,
    pitch: 0,
    zoom: 2,
    center: [-117.3, 32.6, 2],
    sources: {
      imagery: {
        tilejson: "3.0.0",
        version: "1.0.0",
        name: "Natural Earth Tiles",
        description: "",
        attribution: "",
        bounds: [-180, -85.051129, 180, 85.051129],
        center: [-117.3, 32.6, 2],
        minzoom: 0,
        maxzoom: 24,
        scheme: "xyz",
        volatile: false,
        type: "raster",
        tileSize: 256,
        tiles: [
          "https://naturalearthtiles.roblabs.com/tiles/natural_earth_cross_blended_hypso_shaded_relief.raster/{z}/{x}/{y}.png",
        ],
      },
    },
    id: "Natural Earth Tiles",
    layers: [
      {
        metadata: "",
        id: "Natural Earth Tiles",
        source: "imagery",
        minzoom: 0,
        maxzoom: 24,
        type: "raster",
        "raster-opacity": 1,
        layout: { visibility: "visible" },
      },
    ],
  },
  OPENSTREETMAP: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap Contributors",
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm", // This must match the source key above
      },
    ],
  },
  ARCGIS: {
    version: 8,
    metadata: "Made with liquid💦: RobLabs.com/xyz",
    name: "ArcGIS World Imagery",
    bearing: 0,
    pitch: 0,
    zoom: 9,
    center: [-117.3, 32.6, 9],
    sources: {
      imagery: {
        tilejson: "3.0.0",
        version: "1.0.0",
        name: "ArcGIS World Imagery",
        description: "",
        attribution: "",
        bounds: [-180, -85.051129, 180, 85.051129],
        center: [-117.3, 32.6, 9],
        minzoom: 0,
        maxzoom: 24,
        scheme: "xyz",
        volatile: false,
        type: "raster",
        tileSize: 256,
        tiles: [
          "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
      },
    },
    id: "ArcGIS World Imagery",
    layers: [
      {
        metadata: "",
        id: "ArcGIS World Imagery",
        source: "imagery",
        minzoom: 0,
        maxzoom: 24,
        type: "raster",
        "raster-opacity": 1,
        layout: { visibility: "visible" },
      },
    ],
  },
  EMODNET: {
    version: 8,
    sources: {
      emodnet: {
        type: "raster",
        tiles: [
          "https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap Contributors",
        maxzoom: 40,
      },
    },
    layers: [
      {
        id: "emodnet",
        type: "raster",
        source: "emodnet", // This must match the source key above
      },
    ],
  },
  USGS: {
    version: 8,
    sources: {
      usgs: {
        type: "raster",
        tiles: [
          "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
        ],

        tileSize: 256,
        attribution: "&copy; OpenStreetMap Contributors",
        maxzoom: 40,
      },
    },
    layers: [
      {
        id: "usgs",
        type: "raster",
        source: "usgs", // This must match the source key above
      },
    ],
  },
};

export const initMap = (container, coords, baseLayer, baseOpacity, zoom) => {
  var map = new maplibregl.Map({
    container: "map",
    style: layers[baseLayer],
    center: coords, // starting position [lng, lat]
    zoom: zoom, // starting zoom
  });
  return map;
};

// export const initMapMapBox = (container, coords) => {

//     const map = new Map({
//         container,
//         // style: 'mapbox://styles/mapbox/outdoors-v12',
//         style: 'mapbox://styles/mapbox/light-v11',
//         // pitchWithRotate: false,
//         center: coords,
//         zoom: 2,
//         accessToken: 'pk.eyJ1IjoiaW9kZXBvIiwiYSI6ImNsNWM3OW5wMjBlbXkzY21zMTVvdXljejUifQ.mHqzrnpLdsKcUDTIsKNrkw',
//         // doubleClickZoom: false,
//         // projection: 'mercator'
//     });
//     return map
// }
