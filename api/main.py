import json
import os
import requests
import re

import shapely
import shapely.wkt
import shapely.geometry

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from api.util.solr_query_builder import SolrQueryBuilder

import logging
log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

SOLR_URL = os.path.join(os.environ.get('SOLR_URL', 'http://solr'), 'select')
AVAILABLE_FACETS = ['txt_knowsAbout', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor',
                    'txt_keywords',
                    'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog']


FACET_FIELDS = {
    'Spatial': [ 'txt_keywords', 'txt_provider', 'txt_variableMeasured', 'type'],
    'Person':  [ 'txt_memberOf', 'txt_knowsLanguage', 'txt_jobTitle', 'txt_knowsAbout', 'txt_affiliation', 'txt_provider'  ],
    'Organization':  [ 'txt_memberOf', 'txt_provider' ],
    'Dataset': [ 'txt_keywords', 'txt_provider', 'txt_variableMeasured'],
    'CreativeWork': ['txt_keywords', 'txt_provider', 'txt_contributor'],
    'Course': ['txt_keywords', 'txt_provider', 'txt_author', 'txt_educationalCredentialAwarded'],
    'Vehicle': ['txt_keywords', 'txt_provider', 'txt_vehicleSpecialUsage'],
    'ResearchProject':  [ 'txt_keywords',  'txt_provider', 'txt_areaServed' ],
   }


GEOJSON_FIELDS = { 'id', 'geom_length' }
GEOJSON_ROWS = 10000
DEFAULT_GEOMETRY = "[-90,-180 TO 90,180]"
COMBINED_TYPES = {
    'Experts': ['Person', 'Organization']
}
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)

@app.get("/search")
def search(search_text: str = None, document_type: str = None, region: str = None, facetType: list = Query(default=[]),
           facetName: list = Query(default=[]), start=0, rows=10, include_facets: bool = True):

    facetFields = FACET_FIELDS.get(document_type, AVAILABLE_FACETS)

    if 'the_geom' in facetType:
        facetName[facetType.index('the_geom')] = rewriteGeom(facetName[facetType.index('the_geom')])
        facetFields = FACET_FIELDS['Spatial']

    # need to add the type facet because of the counts, even if we're not requesting it elsewhere.
    queryFacetFields = set(facetFields)
    queryFacetFields.add('type')
    data = SolrQuery(search_text, document_type,
                     facetType, facetName,
                     facetFields=list(queryFacetFields) if include_facets else ['type'],
                     region=region,
                     start=start,
                     rows=rows
                     ).json()
    return {
        'docs': data['response']['docs'],
        'counts': counts_dict(data['facet_counts']['facet_fields']['type']),
        'facets': facet_counts(data['facet_counts']['facet_fields'], facetFields) if include_facets else None
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


def rewriteGeom(the_geom):
    # UNDONE -- need to check to see if we're correctly handling wrap-around in the bounding boxes
    number = r"-?\d+(\.\d+)?"  # optional sign, digits, optional decimal + more digits
    corners = re.match(rf"\[({number}),({number}) +TO +({number}),({number})]$", the_geom)
    if not corners:
        raise ParameterError("Invalid Geometry")
    # corners: s w n e
    #log.error(corners)
    (s,w,n,e) = [float(x) for x in corners.group(1,3,5,7)]
    #log.error("%s, %s, %s, %s", s,w,n,e)
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
    def __init__(self, search_text=None, document_type=None, facetType=None, facetName=None, facetFields=None, region=None,
                 start=0, **kwargs):
        solr_search_query = SolrQueryBuilder(start=start, **kwargs)
        if search_text:
            solr_search_query.add_fq(name='text', value=search_text)
        if document_type:
            if document_type in COMBINED_TYPES:
                solr_search_query.add_fq(name='type', value=' '.join(COMBINED_TYPES[document_type]))
            else:
                solr_search_query.add_fq(name='type', value=document_type)
        if region:
            solr_search_query.add_fq(name='txt_region', value=region)

        solr_search_query.add_facet_fields(facetFields)
        if facetType and facetName and len(facetType) == len(facetName):
            for type, value in zip(facetType, facetName):
                solr_search_query.add_fq(type, value)

        self._query = solr_search_query

    def json(self):
        res = requests.get(SOLR_URL, params=self._query.params)
        return res.json()
