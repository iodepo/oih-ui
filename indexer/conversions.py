from models import Att

class UnhandledFormatException(Exception): pass

GENERATE_TESTS = True

import hashlib
import json
import os
from pathlib import Path

def test_generation(_type, d):
    print ("Generating test %s" %( _type))
    src = json.dumps(d)
    base_path = Path(os.path.dirname(__file__)) / 'test' / _type
    if not base_path.exists():
        os.mkdir(base_path)
        os.mkdir(base_path / 'src')
        os.mkdir(base_path / 'dest')

    file_hash = hashlib.md5(src.encode('utf-8')).hexdigest()[:10]
    with (base_path / 'src' / ('%s.json' %file_hash)).open('w') as f:
        f.write(src)

    mod = __import__('conversions')
    result = getattr(mod, _type)(d)
    with (base_path / 'dest' / ('%s.json' %file_hash)).open('w') as f:
        json.dump([result.prefix, result.value],f)

    print ("Generated test %s for %s" %(file_hash, _type))


def _extract(fieldName):
    def _extractor(d):
        return Att('txt', d[fieldName])
    return _extractor


def _dispatch(_type, d):
    mod = __import__('conversions')
    if GENERATE_TESTS:
        test_generation(_type, d)
    return getattr(mod, _type)(d)

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
            return Att('geom', fmt % val)
    raise UnhandledFormatException("Didn't handle %s in GeoShape" % json.dumps(geo))



### Individual Fields

def _extractDate(d):
    if isinstance(d, str):
        return Att('dt', d)
    dt = d.get('date', None)
    if dt:
        return Att('dt', dt)
    return None

endDate = _extractDate
startDate = _extractDate
