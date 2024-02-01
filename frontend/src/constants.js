import { boundsToQuery } from "utilities/mapUtility";

/* Bounds for regions on the map.

  This is just the initial bounds of the map that's shown, it doesn't
  ultimately restrict the data found for a region, that's determined by the
  data in the regions.geojson on the indexing side
*/

const regionMap = {
  Atlantic_Ocean: [
    { lon: -145.33369569979607, lat: 5.7780686247193955 },
    { lon: 65.33369569979615, lat: 62.066727156861674 },
  ],
  Europe: [
    { lon: -107.21562733091812, lat: 10.386093118754701 },
    { lon: 172.21562733091304, lat: 72.88493065790703 },
  ],
  Pacific_Ocean: [
    { lon: 25.14332118708481, lat: -20.600103232733574 },
    { lon: 329.8566788129159, lat: 64.81860042660293 },
  ],
  Africa: [
    { lon: -118.02145202451882, lat: -44.18474414265481 },
    { lon: 187.02145202451686, lat: 49.8700945525558 },
  ],
  Latin_America_and_the_Caribbean: [
    { lon: -124.03735675657782, lat: -33.51530089927659 },
    { lon: 8.227832109604293, lat: 10.748842293271764 },
  ],
  Mediterranean_Sea: [
    { lon: -19.175769130926653, lat: 29.08511838451858 },
    { lon: 50.17576913092529, lat: 47.934811919266906 },
  ],
  Indian_Ocean: [
    { lon: 4.611960795272864, lat: -24.930713744413936 },
    { lon: 151.3880392047286, lat: 24.930713744412643 },
  ],
  Caribbean_Sea: [
    { lon: -101.68655517385125, lat: 8.788708601074305 },
    { lon: -33.02212937918131, lat: 31.247251757013444 },
  ],
  Asia: [
    { lon: -32.57437113373925, lat: -11.617780311256865 },
    { lon: 245.57437113373646, lat: 64.83446350500856 },
  ],
  Americas: [
    { lon: -138.71527918710268, lat: 4.417188266974804 },
    { lon: -16.284720812897746, lat: 42.759998884317014 },
  ],
  Southern_Ocean: [
    { lon: -138.37738386680476, lat: -72.89917595362476 },
    { lon: 166.66552158747544, lat: -1.5028371719127875 },
  ],
  Pacific_Small_Islands: [
    { lon: 137.7987913220781, lat: -22.648871272548476 },
    { lon: 191.6507377069418, lat: -4.358367103401818 },
  ],
  Arctic_Ocean: [
    { lon: -70.49476004780959, lat: 57.59504163647418 },
    { lon: 167.15987076394447, lat: 82.24618124542548 },
  ],
  Oceania: [
    { lon: 98.10431027925404, lat: -42.80102387015745 },
    { lon: 218.8956897207459, lat: -5.0462279577076 },
  ],
};

const INITIAL_BOUNDS = [
  { lon: -20, lat: -50 }, // w s
  { lon: 320, lat: 50 }, // e n
];

export { regionMap, INITIAL_BOUNDS };
