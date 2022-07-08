import os
import json

import shapely
import shapely.wkt
import shapely.geometry

#    geometry = shapely.geometry.mapping(shapely.wkt.loads(result['the_geom']))

with open (os.path.join(os.path.dirname(__file__),'regions-clipped.geojson'), 'r') as f:
    regions = json.load(f)['features']
    for r in regions:
        r['shape'] = shapely.geometry.shape(r['geometry'])


def featureInRegion(feature):
    the_geom= shapely.wkt.loads(feature)
    return [r['properties']['name'] for r in regions if r['shape'].intersects(the_geom)]






if __name__ == '__main__':
    for feature in (
            'POLYGON ((-95.5 19.5,-95.5 31.5,-73.5 31.5,-73.5 19.5,-95.5 19.5))',
            'POLYGON ((144.401499 13.11742,144.401499 15.622688,145.8872 15.622688,145.8872 13.11742,144.401499 13.11742))',
            'POINT (0 0)',
            'POINT (-9 53)'):
        print( featureInRegion(feature))
