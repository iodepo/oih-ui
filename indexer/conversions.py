from models import Att
from test_utils import test_generation

class UnhandledFormatException(Exception): pass



def _extract(fieldName):
    def _extractor(d):
        return Att('txt', d[fieldName])
    return _extractor

@test_generation
def _dispatch(_type, d):
    mod = __import__('conversions')
    return getattr(mod, _type)(d)

###
#  Types
###

ProgramMembership = _extract('programName')
Organization = _extract('url')
PropertyValue = _extract('value')
DataDownload = _extract('contentUrl')

def Place(d):
    _formats = {'polygon': 'POLYGON ((%s))',
                'point': 'POINT (%s)'}

    geo = d.get('geo', None)
    if geo and geo.get('@type', None):
        return _dispatch(geo['@type'], geo)

    lat = d.get('latitude', None)
    lon = d.get('longitude', None)
    if lat is not None and lon is not None:
        return Att('geom', _formats['point'] % ('%s %s'% (lon, lat)))

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
            return Att('the', fmt % val, 'geom')
    raise UnhandledFormatException("Didn't handle %s in GeoShape" % json.dumps(geo))



###
#   Individual Fields
###

def _extractDate(d):
    if isinstance(d, str):
        return Att('dt', d)
    dt = d.get('date', None)
    if dt:
        return Att('dt', dt)
    return None

endDate = _extractDate
startDate = _extractDate
