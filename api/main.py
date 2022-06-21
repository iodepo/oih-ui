import requests
import urllib.parse

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.util.solr_query_builder import SolrQueryBuilder, SolarSearchQueryBuilder
from api.models.Search import Search

# SOLR_URL = f'http://solr:8983/solr/ckan/select'
# SOLR_URL = f'http://localhost:8983/solr/ckan/select'
SOLR_URL = 'http://oih.staging.derilinx.com:8983/solr/ckan/select'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)

##### TEMP CODE #####
import json

# Opening JSON file
f = open('/Users/cormac/PycharmProjects/unesco-oih/api/sample_result.json')
# f = open('/usr/src/app/api/sample_result.json')

# returns JSON object as
# a dictionary
data = json.load(f)
##### TEMP CODE #####

@app.get("/search")
async def search(text, document_type: str = None):
    #### GOOD CODE #####
    # search_text = urllib.parse.unquote(text)
    # solr_search_query = SolarSearchQueryBuilder(
    #     Search(search_text, document_type)
    # )
    # solr_search_query.add_search_fq()
    # solr_search_query.add_facet_fields()
    # res = requests.get(SOLR_URL, params=solr_search_query.params)
    # data = res.json()
    # response = {'docs': data['response']['docs']}
    #### GOOD CODE #####
    response = {'docs': data['response']['docs']}
    response.update(await _convert_counts_array_to_response_dict(data['facet_counts']['facet_fields']['type']))
    response['facets'] = []
    for facet in ['txt_knowsAbout', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor', 'txt_keywords',
                  'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog', 'keys']:
        if data['facet_counts']['facet_fields'][facet]:
            response['facets'].append(
                {
                    "name": facet,
                    "counts": await _convert_facet_counts(
                        data['facet_counts']['facet_fields'][facet])
                })
    return response


@app.get("/count")
async def count(field_to_count: str):
    solr_search_query = SolrQueryBuilder()
    solr_search_query.add_facet_fields([field_to_count])
    print(solr_search_query)
    res = requests.get(SOLR_URL, params=solr_search_query.params)
    data = res.json()
    response = await _convert_counts_array_to_response_dict(data['facet_counts']['facet_fields'][field_to_count])
    return response


async def _convert_counts_array_to_response_dict(counts):
    response = {'counts': {}}
    for index in range(0, len(counts), 2):
        response['counts'][counts[index]] = counts[index + 1]
    return response


async def _convert_facet_counts(facet_counts):
    facet_response = []
    for index in range(0, len(facet_counts), 2):
        facet_response.append({
            'name': facet_counts[index],
            'count': facet_counts[index + 1]
        })
    return facet_response
