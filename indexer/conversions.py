"""
Field and Type conversions.

The intention here is that we can dispatch on either type or the
fieldname to be able to convert the given jsonld source data into a
set of attributes that will be indexed in solr.  There are several use
cases:

* extract a field from a typed dictionary: e.g. DataDownload, we want
to return the contentUrl field.
* Conditionally extract the data from a potentially complicated type:
e.g. Place. We're preferentially parsing geo, [lat/lon], and address
fields, and returning a rich set of data from the place.
* Returning a specific type for a field, and potentially parsing: e.g
startDate/endDate
* Renaming a field: e.g. rdf:name -> name

Dispatch conventions:

* Function names should match the graph field name or type value.
* Colons (:) in the name are replaced by double underscore (__)

Any method beginning with _ is internal.
"""

from models import Att
from common import flatten
from test_utils import test_generation
import regions

from dateutil.parser import isoparse
import shapely
import shapely.wkt
import shapely.geometry
from shapely.ops import transform
from shapely.geometry import LineString, Point, Polygon
from shapely.validation import make_valid
import json
import math

class UnhandledFormatException(Exception): pass
class UnhandledDispatchException(Exception): pass
class IDCollisionError(Exception): pass

@test_generation
def _dispatch(_type, d):
    try:
        mod = __import__('conversions')
        return getattr(mod, _type.replace(':','__'))(d)
    except (KeyError, AttributeError):
        raise UnhandledDispatchException()


###
#  Types
#
#  These types will be inlined as attributes on the enclosing
#  object. They are not saved as separate items in the index.
###

def _extractField(fieldName):
    def _extractor(d):
        return Att('txt', d[fieldName])
    return _extractor


ProgramMembership = _extractField('programName')
#Organization = _extract('url')
PropertyValue = _extractField('value')
DataDownload = _extractField('contentUrl')

def Place(d):
    #print('here [Place]')
    
    _formats = {'polygon': 'POLYGON ((%s))',
                'point': 'POINT (%s)'}

    geo = d.get('geo', None)
    if geo and geo.get('@type', None):
        return _dispatch(geo['@type'], geo)

    lat = d.get('latitude', None)
    lon = d.get('longitude', None)
    if lat is not None and lon is not None:
        return _geo('point', _formats['point'] % ('%s %s'% (lon, lat)))

    address = d.get('address', None)
    if address:
        return [
            Att('txt', address),
            Att('txt', regions.regionForAddress(address), 'region')
        ]
    
    return None


def GeoShape(geo):
    #print('here [geo]')
    _formats = {'polygon': 'POLYGON ((%s))',
                'point': 'POINT (%s)',
                'box': 'BOX (%s)',}
                
    # for field, fmt in _formats.items():
        # val = geo.get(field,None)
        # if val:
            # return _geo(field, fmt % val)
    # raise UnhandledFormatException("Didn't handle %s in GeoShape" % json.dumps(geo))

    for field, fmt in _formats.items():
        val = geo.get(field,None)
        if val and field == 'box':
            #convert Box to Polygon
            boxString = fmt % val;
            print(boxString)
            newboxString = boxString.replace('BOX ', '')
            #print(newboxString)          
            newboxString = newboxString.replace(' ', ', ')
            #print(newboxString)
            newboxString = eval(newboxString)
            newPoly = shapely.geometry.box(*newboxString, ccw=True)
            #convert coords to Long/Lat (Y/X) as required by Shapely
            newPoly = transform(lambda x, y: (y, x), newPoly)
            #newPoly = 'POLYGON ' + str(newPoly.bounds)
            newPoly = str(newPoly).replace(', ', ',')
            #newPoly = f"'{newPoly}'"            
            print(newPoly)
            return _geo('polygon', newPoly)      
          
        elif val and field != 'box':
            print(fmt % val)
            return _geo(field, fmt % val)
    raise UnhandledFormatException("Didn't handle %s in GeoShape" % json.dumps(geo))


def CourseInstance(data):
    atts = [_dispatch(field, data.get(field, None)) for field in ('startDate', 'endDate')]
    if 'location' in data:
        loc = data['location']
        if loc.get('@type',None):
            try:
                atts.append(_dispatch(loc['@type'], loc))
            except (UnhandledDispatchException): pass
    atts.append(Att('txt', data.get('name', data.get('description', ''))))
    return list(flatten(atts))

## Geometry processing
def _to_geojson(geo):
    return json.dumps(shapely.geometry.mapping(geo))


def _geo_polygon(feature):
    #print("_geo_polygon  !!!!!!!!")
    the_geom= shapely.wkt.loads(feature)
    (minx, miny, maxx, maxy) = the_geom.bounds
    
    print(str(minx) + "," + str(miny) + "," + str(maxx) + "," + str(maxy))
    
    if minx == -180 and maxx == 180:
        # solr can't handle this, returns org.locationtech.spatial4j.exception.InvalidShapeException: Invalid polygon, all points are coplanar
        the_geom = shapely.ops.clip_by_rect(the_geom, -179.99, -89.99, 180.0, 89.99)
        print ("Detected invalid geometry -- +- 180 bounds. Reducing slightly")

    if minx == maxx and miny == maxy:
        # solr can't handle this, returns org.locationtech.spatial4j.exception.InvalidShapeException: Invalid polygon, all points are coplanar
        print ("Detected invalid polygon, as it is actually a point. Buffering point to generate a polygon...")
        the_geom = Point(minx, miny).buffer(2)
        (minx, miny, maxx, maxy) = the_geom.bounds
        print(str(minx) + "," + str(miny) + "," + str(maxx) + "," + str(maxy)) 

    #check if valid geometry
    if the_geom.is_valid == False:
        print ("Detected invalid geometry, executing make_valid")        
        the_geom = make_valid(the_geom)
        #convert lineString to Polygon, by buffering through Shapely
        if the_geom.geom_type == "LineString":
            print ("Detected geometry of type LineString. Buffering line to generate a polygon...")    
            the_geom = the_geom.buffer(2)
            (minx, miny, maxx, maxy) = the_geom.bounds
        print(the_geom.wkt)

    # the_geom.length is the perimeter, I want a characteristic length
    length = math.sqrt((maxx-minx)**2 + (maxy-miny)**2)
    if len(feature) > 200:
        print ("Complicated feature: %s, %s, %s" % (the_geom.area, length, feature))

    return [
        Att('geojson', _to_geojson(the_geom.representative_point()), 'point'),
        Att('geojson', _to_geojson(the_geom.simplify(0.1)),'simple'),
        Att('geojson', _to_geojson(the_geom),'geom'),
        Att('geom', the_geom.area, 'area'),
        Att('geom', length, 'length'),
        Att('the', the_geom.wkt, 'geom'),
    ]

def _geo_default(feature):
    #print('_geo_default !!!')
    the_geom= shapely.wkt.loads(feature)
    return [
        Att('the', feature, 'geom'),
        Att('geojson', _to_geojson(the_geom.representative_point()), 'point'),
        Att('geojson', _to_geojson(the_geom),'geom'),
    ]

def _geo(featuretype, feature):
    """ Create the attributes for the geometric feature
    feature: wkt representation of the feature
    returns: list of attributes
    """
    #print("_geo !!!!")
    _dispatch = {'polygon': _geo_polygon }

    #print("Att start!!!!")
    atts= [
        Att('txt', regions.regionsForFeature(feature), 'region'),
        Att('geom', featuretype, 'type'),
        Att('has', True, 'geom')
    ]

    atts.extend(_dispatch.get(featuretype, _geo_default)(feature))
    #print("Att end!!!!")
    #print(atts)
    return atts

###
#   Individual Fields
###

def _parseDate(field, d):
    try:
        dt = isoparse(d)
        return [
            Att('dt', dt.isoformat(), field),
            Att('n', dt.year, field.replace('Date', 'Year')),
        ]
    except ValueError:
        return Att('txt', d, field)

def _extractDate(field):

    def _extractor(d):
        if isinstance(d, str):
            return _parseDate(field, d)
        dt = d.get('date', None)
        if dt:
            return _parseDate(field, dt)
        return None
    return _extractor

endDate = _extractDate('endDate')
startDate = _extractDate('startDate')


def temporalCoverage(field):
    if field == 'null/null' or not '/' in field:
        return Att('txt', field, 'temporalCoverage')
    try:
        (start, end) = field.split('/')
        return list(flatten([
            _parseDate('startDate', start),
            _parseDate('endDate', end),
            Att('txt', field, 'temporalCoverage')
        ]))

    except ValueError:
        raise UnhandledFormatException("Didn't handle %s in temporalCoverage" % field)

## Prov Fields
def prov__wasAttributedTo(data):
    if isinstance(data, str):
        return Att('id', data, 'provider')

    _id = data.get('@id', None)
    if not _id:
        return UnhandledFormatException("Didn't find @id in prov:wasAttributedto %s" % data)

    return [Att('id', _id, 'provider'),
            Att('txt', data.get('rdf:name', None), 'provider'),
    ]

def rdf__name(data):
    return Att(None, data, 'name')

def rdfs__seeAlso(data):
    return Att('txt', data, 'sameAs')
