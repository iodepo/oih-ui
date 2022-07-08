from models import Att
from test_utils import test_generation
import regions

class UnhandledFormatException(Exception): pass
class UnhandledDispatchException(Exception): pass



@test_generation
def _dispatch(_type, d):
    try:
        mod = __import__('conversions')
        return getattr(mod, _type)(d)
    except (KeyError, AttributeError):
        raise UnhandledDispatchException()


###
#  Types
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
    _formats = {'polygon': 'POLYGON ((%s))',
                'point': 'POINT (%s)'}

    geo = d.get('geo', None)
    if geo and geo.get('@type', None):
        return _dispatch(geo['@type'], geo)

    lat = d.get('latitude', None)
    lon = d.get('longitude', None)
    if lat is not None and lon is not None:
        return _geo(_formats['point'] % ('%s %s'% (lon, lat)))

    address = d.get('address', None)
    if address:
        return Att('txt', address)

    return None


def GeoShape(geo):
    _formats = {'polygon': 'POLYGON ((%s))',
                'point': 'POINT (%s)'}

    for field, fmt in _formats.items():
        val = geo.get(field,None)
        if val:
            return _geo(fmt % val)
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
    return [a for a in atts if a and a.value]


def _geo(feature):
    """ Create the attributes for the geometric feature
    feature: wkt representation of the feature
    returns: list of attributes
    """
    return [
        Att('txt', regions.featureInRegion(feature), 'region'),
        Att('the', feature, 'geom'),
        Att('has', True, 'geom')
    ]


###
#   Individual Fields
###

def _extractDate(field):
    def _extractor(d):
        if isinstance(d, str):
            return Att('dt', d, field)
        dt = d.get('date', None)
        if dt:
            return Att('dt', dt, field)
        return None
    return _extractor

endDate = _extractDate('endDate')
startDate = _extractDate('startDate')
