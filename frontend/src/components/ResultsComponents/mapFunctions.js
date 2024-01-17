import { regionBoundsMap, DEFAULT_QUERY_BOUNDS } from "../../constants";

const expandMapBounds = ({ _sw, _ne }) => {
  _sw = { ..._sw };
  _ne = { ..._ne };
  const size = {
    lat: Math.abs(_ne.lat - _sw.lat),
    lng: Math.abs(_ne.lng - _sw.lng),
  };
  _sw.lat -= Math.abs(size.lat * 0.25);
  if (Math.abs(_sw.lat) > 90) {
    _sw.lat = 90 * Math.sign(_sw.lat);
  }
  _sw.lng -= Math.abs(size.lng * 0.25);

  _ne.lat += Math.abs(size.lat * 0.25);
  if (Math.abs(_ne.lat) > 90) {
    _ne.lat = 90 * Math.sign(_ne.lat);
  }
  _ne.lng += Math.abs(size.lng * 0.25);
  return { _sw, _ne };
};

const containsMapBounds = (outer, inner) =>
  outer._sw.lat < inner._sw.lat &&
  outer._sw.lng < inner._sw.lng &&
  outer._ne.lat > inner._ne.lat &&
  outer._ne.lng > inner._ne.lng;

const get_region_bounds = (region = null) => {
  let bounds;
  if (region) bounds = regionBoundsMap[region.replaceAll(" ", "_")];
  if (bounds) return bounds;
  else return DEFAULT_QUERY_BOUNDS;
};

const mapboxBounds_toQuery = (mb, region = null) => {
  /* convert '{"_sw":{"lng":17.841823484137535,"lat":-59.72391567923438},"_ne":{"lng":179.1301535622635,"lat":49.99895151432449}}'
      to [_sw.lat,_sw.lng TO _ne.lat,_ne.lng] ([-90,-180 TO 90,180])
    */
  const { _sw, _ne } = mb;
  if (!_sw) {
    return get_region_bounds(region);
  }
  return `[${_sw.lat},${_sw.lng} TO ${_ne.lat},${_ne.lng}]`;
};

export {
  expandMapBounds,
  containsMapBounds,
  mapboxBounds_toQuery,
  get_region_bounds,
};
