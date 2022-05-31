import requests
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException
from api.solr_query_builder import SolrQueryBuilder

# SOLR_URL = f'http://solr:8983/solr/ckan/select'
SOLR_URL = f'http://localhost:8983/solr/ckan/select'

app = FastAPI()


class Search(BaseModel):
    text: str = None
    type: str = None


@app.get("/search")
async def search(search: Search):
    solr_search_query = SolrQueryBuilder(search)
    solr_search_query.add_search_fq()
    solr_search_query.add_facet_fields()
    if not search.text and not search.type:
        raise HTTPException(status_code=400, detail='Please ensure at least one of the following is sent [text, type]')
    res = requests.get(SOLR_URL, params=solr_search_query.params)
    data = res.json()
    return data['response']['docs']


@app.get("/count")
async def count():
    solr_search_query = SolrQueryBuilder()
    solr_search_query.add_facet_fields(['type'])
    res = requests.get(SOLR_URL, params=solr_search_query.params)
    data = res.json()
    response = await _convert_counts_array_to_response_dict(data['facet_counts']['facet_fields']['type'])
    return response


async def _convert_counts_array_to_response_dict(counts):
    response = {'counts': {}}
    for index in range(0, len(counts), 2):
        response['counts'][counts[index]] = counts[index + 1]
    return response

