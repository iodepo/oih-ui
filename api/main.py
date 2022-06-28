import os
import requests
import urllib.parse

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from api.util.solr_query_builder import SolrQueryBuilder


SOLR_URL = os.path.join(os.environ.get('SOLR_URL', 'http://solr'), 'select')
AVAILABLE_FACETS = ['txt_knowsAbout', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor',
                    'txt_keywords',
                    'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)


@app.get("/search")
def search(search_text: str, document_type: str = None, facetType: list = Query(default=[]), facetName: list = Query(default=[])):
    solr_search_query = SolrQueryBuilder()
    solr_search_query.add_fq(name='text', value=search_text)
    if document_type:
        solr_search_query.add_fq(name='type', value=document_type)

    solr_search_query.add_facet_fields()
    if (facetType and facetName) and (len(facetType) == len(facetName)):
        for facet_search in zip(facetType, facetName):
            solr_search_query.add_fq(facet_search[0], facet_search[1])

    res = requests.get(SOLR_URL, params=solr_search_query.params)
    data = res.json()
    response = {'docs': data['response']['docs']}
    response.update(_convert_counts_array_to_response_dict(data['facet_counts']['facet_fields']['type']))
    response['facets'] = []
    _add_facets(data, response)
    return response


@app.get("/count")
def count(field: str):
    solr_search_query = SolrQueryBuilder()
    solr_search_query.add_facet_fields([field])
    res = requests.get(SOLR_URL, params=solr_search_query.params)
    data = res.json()
    response = _convert_counts_array_to_response_dict(data['facet_counts']['facet_fields'][field])
    return response


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
