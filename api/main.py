import json
import os
import requests
import re
import urllib.parse

import shapely
import shapely.wkt
import shapely.geometry

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from api.util.solr_query_builder import SolrQueryBuilder

import logging
log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

SOLR_URL = os.path.join(os.environ.get('SOLR_URL', 'http://solr'), 'select')
AVAILABLE_FACETS = ['txt_knowsAbout', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor',
                    'txt_keywords',
                    'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog']


GEOJSON_FIELDS = { 'id', 'type' }
GEOJSON_ROWS = 10000
DEFAULT_GEOMETRY = "[50,-10 TO 60,10]"
DEFAULT_GEOMETRY = "[-90,-180 TO 90,180]"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)


@app.get("/search")
def search(search_text: str = None, document_type: str = None,  region: str = None, facetType: list = Query(default=[]),
           facetName: list = Query(default=[]), start=0):
    if 'the_geom' in facetType:
        facetType, facetName = rewriteGeom(facetType, facetName)
    query = Query(search_text, document_type, facetType, facetName, region=region, start=start)
    data = query.json()
    response = {'docs': data['response']['docs']}
    response.update(_convert_counts_array_to_response_dict(data['facet_counts']['facet_fields']['type']))
    if document_type.upper() == 'EXPERTS':
        total_counts = response['counts']['Person'] + response['counts']['Organization']
        response['counts']['Experts'] = total_counts

    response['facets'] = []
    _add_facets(data, response)
    return response


@app.get("/count")
def count(field: str):
    query = Query(facetFields=[field])
    data = query.json()
    response = _convert_counts_array_to_response_dict(data['facet_counts']['facet_fields'][field])
    return response


@app.get("/detail")
def detail(id: str):
    params = {
        'q': '*:*',
        'fq': ['+id:"%s"' % id],
        'rows': "1",
    }

    res = requests.get(SOLR_URL, params=params)
    data = res.json()
    return data.get('response',{}).get('docs',[])[:1] or {}

def rewriteGeom(facetType, facetName):
    # UNDONE -- need to check to see if we're correctly handling wrap-around in the bounding boxes
    
    fq = {k:v for k,v in zip(facetType, facetName)}
    corners = validate_geom(fq['the_geom'])
    if not corners:
        raise ParameterError("Invalid Geometry")
    # corners: s w n e
    log.error(corners)
    (s,w,n,e) = corners.group(1,3,5,7)
    log.error("%s, %s, %s, %s", s,w,n,e)
    if float(w) > 180: w = 180 - float(w);
    if float(e) > 180: e = 180 - float(e);
    fq['the_geom'] = f'[{s},{w} TO {n},{e}]';

    facetType = list(fq.keys())
    facetName = list(fq.values())
    return (facetType, facetName)

@app.get("/spatial.geojson")
def spatial(search_text: str=None, document_type: str=None, region: str=None, facetType: list=Query(default=[]), facetName: list=Query(default=[])):

    if 'the_geom' not in facetType:
        facetType.append('the_geom')
        facetName.append(DEFAULT_GEOMETRY)
    else:
        facetType, facetName = rewriteGeom(facetType, facetName)

    query = Query(search_text, document_type, facetType, facetName, facetFields=[], region=region, rows=GEOJSON_ROWS, flList=GEOJSON_FIELDS | {'the_geom'})
    data = query.json().get('response',{})

    log.error(json.dumps(query.json(), indent=2))

    geometries = {
        'type': 'FeatureCollection',
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        'features': (_toFeature(result) for result in data.get('docs',[]))
    }
    return geometries


def _toFeature(result):
    geometry = shapely.geometry.mapping(shapely.wkt.loads(result['the_geom']))
    properties = {field:result[field] for field in GEOJSON_FIELDS if field in result}
    return {
        'type': 'Feature',
        'properties': properties,
        'geometry': geometry
    }

def validate_geom(the_geom):
    """
    Should be something like: "[##,## TO ##,##]"
    """
    number = r"-?\d+(\.\d+)?"  # optional sign, digits, optional decimal + more digits
    return re.match(rf"\[({number}),({number}) +TO +({number}),({number})]$", the_geom)

class ParameterError(Exception): pass

class Query:
    def __init__(self, search_text=None, document_type=None, facetType=None, facetName=None, facetFields=None, region=None,
                 start=0, **kwargs):
        solr_search_query = SolrQueryBuilder(start=start, **kwargs)
        if search_text:
            solr_search_query.add_fq(name='text', value=search_text)
        if document_type:
            if document_type.upper() == 'EXPERTS':
                solr_search_query.add_fq(name='type', value='Person Organization')
            else:
                solr_search_query.add_fq(name='type', value=document_type)
        if region:
            solr_search_query.add_fq(name='txt_region', value=region)

        solr_search_query.add_facet_fields(facetFields)
        if (facetType and facetName) and (len(facetType) == len(facetName)):
            for facet_search in zip(facetType, facetName):
                solr_search_query.add_fq(facet_search[0], facet_search[1])
        self._query = solr_search_query
    def json(self):
        res = requests.get(SOLR_URL, params=self._query.params)
        return res.json()




def _add_facets(data, response):
    for facet in AVAILABLE_FACETS:
        if data['facet_counts']['facet_fields'][facet]:
            response['facets'].append(
                {
                    "name": facet,
                    "counts": _convert_facet_counts(
                        data['facet_counts']['facet_fields'][facet])
                })


def _convert_counts_array_to_response_dict(counts):
    response = {'counts': {}}
    for category, count in zip(counts[::2], counts[1::2]):
        response['counts'][category] = count
    return response


def _convert_facet_counts(facet_counts):
    facet_response = []
    for index in range(0, len(facet_counts), 2):
        facet_response.append({
            'name': facet_counts[index],
            'count': facet_counts[index + 1]
        })
    return facet_response
