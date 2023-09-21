/* images for icons on home page, see HOME+_PAGE_CATEGORIES */
import diver from "./resources/diving.png";
import lighthouse from "./resources/lighthouse.png";
import thinking from "./resources/thinking.png";
import documents from "./resources/document.png";
import map from "./resources/map.png";
import boat from "./resources/boat.png";
import project_mgmt from "./resources/project-management.png";
import database from "./resources/database.png";

/* Bounds for regions on the map.

  This is just the initial bounds of the map that's shown, it doesn't
  ultimately restrict the data found for a region, that's determined by the
  data in the regions.geojson on the indexing side
*/

const regionMap = {
    Atlantic_Ocean: [{'lon': -145.33369569979607, 'lat': 5.7780686247193955}, {'lon': 65.33369569979615, 'lat': 62.066727156861674}],
    Europe: [{'lon': -107.21562733091812, 'lat': 10.386093118754701}, {'lon': 172.21562733091304, 'lat': 72.88493065790703}],
    Pacific_Ocean: [{'lon': 25.14332118708481, 'lat': -20.600103232733574}, {'lon': 329.8566788129159, 'lat': 64.81860042660293}],
    Africa: [{'lon': -118.02145202451882, 'lat': -44.18474414265481}, {'lon': 187.02145202451686, 'lat': 49.8700945525558}],
    Latin_America_and_the_Caribbean: [{'lon': -124.03735675657782, 'lat': -33.51530089927659}, {'lon': 8.227832109604293, 'lat': 10.748842293271764}],
    Mediterranean_Sea: [{'lon': -19.175769130926653, 'lat': 29.08511838451858}, {'lon': 50.17576913092529, 'lat': 47.934811919266906}],
    Indian_Ocean: [{'lon': 4.611960795272864, 'lat': -24.930713744413936}, {'lon': 151.3880392047286, 'lat': 24.930713744412643}],
    Caribbean_Sea: [{'lon': -101.68655517385125, 'lat': 8.788708601074305}, {'lon': -33.02212937918131, 'lat': 31.247251757013444}],
    Asia: [{'lon': -32.57437113373925, 'lat': -11.617780311256865}, {'lon': 245.57437113373646, 'lat': 64.83446350500856}],
    Americas: [{'lon': -138.71527918710268, 'lat': 4.417188266974804}, {'lon': -16.284720812897746, 'lat': 42.759998884317014}],
    Southern_Ocean: [{'lon': -138.37738386680476, 'lat': -72.89917595362476}, {'lon': 166.66552158747544, 'lat': -1.5028371719127875}],
    Pacific_Small_Islands: [{'lon': 137.7987913220781, 'lat': -22.648871272548476}, {'lon': 191.6507377069418, 'lat': -4.358367103401818}],
    Arctic_Ocean: [{'lon': -70.49476004780959, 'lat': 57.59504163647418}, {'lon': 167.15987076394447, 'lat': 82.24618124542548}],
    Oceania: [{'lon': 98.10431027925404, 'lat': -42.80102387015745}, {'lon': 218.8956897207459, 'lat': -5.0462279577076}]
}

const boundsToQuery = (mb) => {
    /* convert '{"_sw":{"lon":17.841823484137535,"lat":-59.72391567923438},"_ne":{"lon":179.1301535622635,"lat":49.99895151432449}}'
      to [_sw.lat,_sw.lon TO _ne.lat,_ne.lon] ([-90,-180 TO 90,180])
    */
    const [_sw, _ne] = mb;
    return `[${_sw.lat},${_sw.lon} TO ${_ne.lat},${_ne.lon}]`;
};

const regionBoundsMap = Object.fromEntries(Object.entries(regionMap).map(([k,v])=>[k,boundsToQuery(v)]));


/* Name: title mapping of the regions that show up in the search bar.
  Add more items here to search different regions.
*/
const PROMOTED_REGIONS =
      { 'Global': 'Global',
//        'Atlantic Ocean': 'Atlantic Ocean',
        'Latin America and the Caribbean':'Latin America & the Caribbean',
        'Africa': 'Africa',
        'Oceania': 'Pacific Small Island Developing States',
        'Europe': 'Europe',
        'Americas': 'North & South America',
        'Asia': 'Asia'        
      };


/* Sample queries for the home page. 4 random items from this list will be added
   on each view/session
*/
const SAMPLE_QUERIES = [
  'Coral Reef',
  'Rare Species',
  'Pelagic',
  'Bathymetric',
  'Whale',
  'Shark',
  'Hydrothermal Vent',
  'Tidal',
  'Heavy Metals',
];

const randomSampleQueries = (n) =>
  SAMPLE_QUERIES.map(e=>[Math.random(),e])
    .sort((a,b)=>a[0]-b[0])
    .map(([_,e])=>e)
    .slice(0,n);

const INITIAL_BOUNDS = [
    {lon: -20, lat: -50},  // w s
    {lon: 320, lat: 50}   // e n
];
const DEFAULT_QUERY_BOUNDS = boundsToQuery(INITIAL_BOUNDS);


/*
Field name -> Title mapping for facets.

Note that this does not include the type_ prefix, so that it will be
used for any of the dt_ or txt_ or n_ fields, if available.
*/
const fieldNameMap = {
  "includedindatacatalog": "Catalog",
  "jobtitle": "Job Title",
  "knowsabout": "Knows About",
  "knowslanguage": "Language",
  "memberof": "Within Directory",
  "variablemeasured": "Variable Measured",
  "educationalcredentialawarded": "Credential Awarded",
  "vehiclespecialusage": "Vehicle Usage",
  "areaserved": "Area",
  "startyear": "Starting Between",
  "endyear": "Ending Between",
};

const fieldTitleFromName = (facet_name) => {
    // strip off id_/txt_ from the leading bit.
    const field_name = facet_name.substring(facet_name.indexOf('_')+1);

    const lower_field_name = field_name.toLowerCase();
    if (fieldNameMap[lower_field_name]) {
        return fieldNameMap[lower_field_name];
    }
    return field_name.charAt(0).toUpperCase() + field_name.slice(1);
};

/* The front page count/categories.
/ id: is the url fragement of the results type for the link, e.g. /results/<id>?page=0
/ text: the title of the category
/ icon: the image, as defined above
*/
const HOME_PAGE_CATEGORIES =
    [
        {
            id: 'Person',
            text: 'Experts',
            icon: diver,

        },
        {
            id: 'CreativeWork',
            text: 'Documents',
            icon: documents
        },
        {
            id: 'Course',
            text: 'Training',
            icon: thinking
        },
        {
            id: 'Dataset',
            text: 'Datasets',
            icon: database
        },
        {
            id: 'Vehicle',
            text: 'Vessels',
            icon: boat
        },
        {
            id: 'ResearchProject',
            text: 'Projects',
            icon: project_mgmt
        },
        {
            id: 'Organization',
            text: 'Institution',
            icon: lighthouse
        },
        {
            id: 'SpatialData',
            text: 'Spatial Search',
            icon: map
        }
];


export { regionMap, regionBoundsMap, PROMOTED_REGIONS,
         SAMPLE_QUERIES, randomSampleQueries,
         INITIAL_BOUNDS, DEFAULT_QUERY_BOUNDS,
         fieldTitleFromName, HOME_PAGE_CATEGORIES }
