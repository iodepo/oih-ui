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


@app.get("/search")
async def search(text, document_type: str = None):
    if isinstance(text, str):
        search_text = text
    else:
        search_text = urllib.parse.unquote(text)
        solr_search_query = SolarSearchQueryBuilder(
            Search(search_text, document_type)
        )
    solr_search_query.add_search_fq()
    solr_search_query.add_facet_fields()
    res = requests.get(SOLR_URL, params=solr_search_query.params)
    data = res.json()
    response = data['response']['docs']
    response.append(await _convert_counts_array_to_response_dict(data['facet_counts']['facet_fields']['type']))
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
