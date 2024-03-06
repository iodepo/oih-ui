import json
import os
from pathlib import Path

import requests
import re

import shapely
import shapely.wkt
import shapely.geometry

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from .util.solr_query_builder import SolrQueryBuilder

import logging
log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

SOLR_URL = os.path.join(os.environ.get('SOLR_URL', 'http://solr'), 'select')

with open(str(Path(__file__).resolve().parent) + '/config.json') as f:
    config_json = f.read()

config = json.loads(config_json)

AVAILABLE_FACETS = config.get('available_facets', [])

facet_intervals = config.get('facet_intervals_numeric', [])
facet_intervals.extend("[%d,%d)" %(x,x+10) for x in range(1950,2010,10))
facet_intervals.extend("[%d,%d)" %(x,x+2) for x in range(2010,2030,2))


FACET_FIELDS = config.get('facet_fields', {})

FACET_INTERVALS = config.get('facet_intervals', {})

GEOJSON_FIELDS = config.get('geojson_fields', ['id', 'geom_length'])
GEOJSON_ROWS = config.get('geojson_rows', 1000)
DEFAULT_GEOMETRY = config.get('default_geometry')
COMBINED_TYPES = {
    'Experts': ['Person', 'Organization']
}
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get('server_cors_allow_origins', []),
)

@app.get("/search")
def search(search_text: str = None, document_type: str = None, region: str = None, facetType: list = Query(default=[]),
           facetName: list = Query(default=[]), fq=None, start=0, rows=10, sort: str = 'indexed_ts desc', include_facets: bool = True):

    facetFields = FACET_FIELDS.get(document_type, AVAILABLE_FACETS)
    facet_interval_fields = FACET_INTERVALS.get(document_type, [])

    if 'the_geom' in facetType:
        facetName[facetType.index('the_geom')] = rewriteGeom(facetName[facetType.index('the_geom')])
        facetFields = FACET_FIELDS['Spatial']
        facet_interval_fields = FACET_INTERVALS.get('Spatial', [])

    # need to add the type facet because of the counts, even if we're not requesting it elsewhere.
    queryFacetFields = set(facetFields)
    queryFacetFields.add('type')
    data = SolrQuery(search_text, document_type,
                     facetType, facetName,
                     facetFields=list(queryFacetFields) if include_facets else ['type'],
                     facet_interval_fields=facet_interval_fields,
                     fq=fq,
                     region=region,
                     start=start,
                     rows=rows,
                     sort=sort
                     ).json()

    facets = facet_counts(data['facet_counts']['facet_fields'], facetFields) if include_facets else []
    facets.extend(render_facet_intervals(data['facet_counts'].get('facet_intervals',{})))

    return {
        'docs': data['response']['docs'],
        # make sure pagination gets the right number of items back so it doesn't need to calculate it.
        'count': data['response'].get('numFound', 0),
        'counts': counts_dict(data['facet_counts']['facet_fields']['type']),
        'facets': facets,
    }

@app.get("/spatial.geojson")
def spatial(search_text: str=None, document_type: str=None, region: str=None, facetType: list=Query(default=[]), facetName: list=Query(default=[])):
    if 'the_geom' not in facetType:
        facetType.append('the_geom')
        facetName.append(DEFAULT_GEOMETRY)
    else:
        index = facetType.index('the_geom')
        facetName[index] = rewriteGeom(facetName[index])

    query = SolrQuery(search_text, document_type, facetType, facetName, facetFields=[], region=region, rows=GEOJSON_ROWS, flList=GEOJSON_FIELDS | {'geojson_geom', 'geojson_point'})
    data = query.json().get('response',{})

    geometries = {
        'type': 'FeatureCollection',
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        'features':  _expandFeatures(data.get('docs',[])),
        'count': data.get('numFound', 0)
    }
    return geometries

@app.get("/detail")
def detail(id: str):
    return _get_by_id(id)

@app.get("/source")
def source(id: str):
    return json.loads(_get_by_id(id)["json_source"])


def _get_by_id(id: str):
    params = {
        'q': '*:*',
        'fq': ['+id:"%s"' % id],
        'rows': "1",
    }

    res = requests.get(SOLR_URL, params=params)
    data = res.json()
    try:
        return data['response']['docs'][0]
    except IndexError:
        raise HTTPException(404)
    except KeyError:
        raise HTTPException(404)


def with_combined_counts(counts):
    for combined, components in COMBINED_TYPES.items():
        if any(component in counts for component in components):
            counts[combined] = sum(counts.get(component, 0) for component in components)
    return counts

def counts_dict(counts):
    return with_combined_counts(dict(zip(counts[::2], counts[1::2])))


def facet_counts(facets, facetFields=None):
    if facetFields is None:
        facetFields=AVAILABLE_FACETS

    return [
        {
            "name": facet,
            "counts": [{
                'name': name,
                'count': count
            } for name, count in zip(values[::2], values[1::2])]
        }
        for facet, values in facets.items() if facet in facetFields
    ]


def render_facet_intervals(facet_intervals):

    def _title(s):
        try:
            start, end = s.split(',')
        except:
            return s
        if start == '[*':
            return "Up to %s" %(end.replace(')',''))
        return "%s to %s" %(start[1:], end[:-1])
    def _value(s):
        return s.replace(')', '}').replace(',',' TO ')

    return ({'name': name,
            'counts': [{'name':_title(k),
                        'value':_value(k),
                        'count':v}
                       for k,v in value.items()]
    } for name, value in facet_intervals.items())




def rewriteGeom(the_geom):
    # UNDONE -- need to check to see if we're correctly handling wrap-around in the bounding boxes
    # optional sign, digits, optional decimal + more digits, optional e-## for scientific notation.
    # extra groups in non-capturing (?:) because we don't want them in the groups we save later.
    number = r"-?\d+(?:\.\d+)?(?:e-?\d+)?"
    corners = re.match(rf"\[({number}),({number}) +TO +({number}),({number})]$", the_geom)
    if not corners:
        raise ParameterError("Invalid Geometry")
    # corners: s w n e
    #log.error(corners)
    (s,w,n,e) = [float(x) for x in corners.group(1,2,3,4)]
    log.error("%s, %s, %s, %s", s,w,n,e)
    bb_width = e - w
    if bb_width > 360.0:
        e = 180.0
        w = -180.0
    else:
        while w > +180.0: w -= 360.0
        while w < -180.0: w += 360.0
        e = w + bb_width
        while e > +180.0: e -= 360.0
        while e < -180.0: e += 360.0
    #log.error("%s, %s, %s, %s", s,w,n,e)
    return f'[{s},{w} TO {n},{e}]'


def _expandFeatures(results):
    for feature in results:
        yield _toFeature(feature)
        # include small features as points, in the same geojson.
        length = feature.get('geom_length', 1000)
        if length < 15: # This should match fronend
            # zoom 0 == .7degrees/pixel, this will generally overfill the smaller ones for us
            yield _toFeature(feature, 'geojson_point')


def _toFeature(result, geometry_source='geojson_geom'):
    #geometry = shapely.geometry.mapping(shapely.wkt.loads(result['the_geom']))
    geometry = json.loads(result[geometry_source])
    properties = {field:result[field] for field in GEOJSON_FIELDS if field in result}
    return {
        'type': 'Feature',
        'properties': properties,
        'geometry': geometry
    }


class ParameterError(Exception): pass

class SolrQuery:
    def __init__(self, search_text=None, document_type=None, facetType=None, facetName=None, facetFields=None, facet_interval_fields=None, region=None, fq=None,
                 start=0, **kwargs):

        # Dismax query parser needs to have the search term in the query, not * or :.
        # So adding this to the query, and not putting it in the fq.
        # The querybuilder will filter out the *:* default here, and just run an ordinary query.
        query = search_text or '*:*'
        solr_search_query = SolrQueryBuilder(query=query, start=start, **kwargs)

        # if search_text:
        #     solr_search_query.add_fq(name='text', value=search_text)
        if document_type:
            if document_type in COMBINED_TYPES:
                solr_search_query.add_fq(name='type', value=' '.join(COMBINED_TYPES[document_type]))
            else:
                solr_search_query.add_fq(name='type', value=document_type)
        if region:
            solr_search_query.add_fq(name='txt_region', value=region)

        solr_search_query.add_facet_fields(facetFields)
        if facet_interval_fields:
            solr_search_query.add_facet_interval(facet_interval_fields, facet_intervals )

        if fq:
            solr_search_query.add_raw_fq(fq)
        if facetType and facetName and len(facetType) == len(facetName):
            for type, value in zip(facetType, facetName):
                solr_search_query.add_fq(type, value)

        self._query = solr_search_query

    def json(self):
        res = requests.get(SOLR_URL, params=self._query.params)
        return res.json()
