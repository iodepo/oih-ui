import unittest
import urllib.parse
from api.main import app
from fastapi.testclient import TestClient
from tests.resources.response_docs.search_text_calcium_response import search_calcium_response
from tests.resources.response_docs.search_text_calcium_water_response import search_calcium_water_response
from tests.resources.response_docs.search_text_calcium_and_creative_work import search_calcium_and_creative_work_response
from unittest import mock


SEARCH_TEXT_CALCIUM_PARAMS = {'params': {'q': '*:*', 'sort': 'score desc, indexed_ts desc', 'rows': 10, 'facet.mincount': 1, 'start': 0, 'facet': 'true', 'fq': ['+text:(Calcium)'], 'facet.field': ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type']}}
SEARCH_TEXT_CALCIUM_WATER_PARAMS = {'params': {'q': '*:*', 'sort': 'score desc, indexed_ts desc', 'rows': 10, 'facet.mincount': 1, 'start': 0, 'facet': 'true', 'fq': ['+text:(Calcium water)'], 'facet.field': ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type']}}
SEARCH_TEXT_CALCIUM_WATER_CREATIVE_WORK_PARAMS = {'params': {'q': '*:*', 'sort': 'score desc, indexed_ts desc', 'rows': 10, 'facet.mincount': 1, 'start': 0, 'facet': 'true', 'fq': ['+text:(Calcium)', '+type:(ResearchProject)'], 'facet.field': ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle', 'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider', 'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type']}}
SOLR_URL = 'http://solr/select'


def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    if args[0] == SOLR_URL and kwargs == SEARCH_TEXT_CALCIUM_PARAMS:
        return MockResponse(search_calcium_response, 200)
    elif args[0] == SOLR_URL and kwargs == SEARCH_TEXT_CALCIUM_WATER_PARAMS:
        return MockResponse(search_calcium_water_response, 200)
    elif args[0] == SOLR_URL and kwargs == SEARCH_TEXT_CALCIUM_WATER_CREATIVE_WORK_PARAMS:
        return MockResponse(search_calcium_and_creative_work_response, 200)

    return MockResponse(None, 404)


class TestSearchApi(unittest.TestCase):
    client = TestClient(app)

    @mock.patch('requests.get', side_effect=mocked_requests_get)
    def test_search_no_result(self, mock_get):
        res = TestSearchApi.client.get("/search")
        self.assertEqual(res.status_code, 422)

    @mock.patch('requests.get', side_effect=mocked_requests_get)
    def test_search_text(self, mock_get):
        search_word = 'Calcium'
        res = TestSearchApi.client.get(f'/search?search_text={search_word}')
        self.assertEqual(res.status_code, 200)
        response_json = res.json()
        self.assertEqual(len(response_json['docs']), 10, 'Expected 10 results for Calcium')
        self.assertEqual(response_json['docs'][0]['id'], 'https://edmerp.seadatanet.org/report/7985')
        self.assertEqual(response_json['docs'][0]['type'], 'ResearchProject')
        self.assertEqual(response_json['docs'][0]['name'], 'The impact of Coccolithophorid blooms off western Ireland')

        self.assertEqual(response_json['counts']['CreativeWork'], 235)
        self.assertEqual(response_json['counts']['ResearchProject'], 4)

        search_word = 'Calcium water'
        res = TestSearchApi.client.get(f'/search?search_text={urllib.parse.quote(search_word)}')
        response_json = res.json()
        self.assertEqual(len(response_json['docs']), 10, 'Expected 10 results for Calcium water')
        self.assertEqual(response_json['docs'][0]['id'], 'https://oceanexpert.org/expert/43319')
        self.assertEqual(response_json['docs'][0]['type'], 'Person')
        self.assertEqual(response_json['docs'][0]['name'], 'Jennifer Waters')

        self.assertEqual(response_json['counts']['CreativeWork'], 10507)
        self.assertEqual(response_json['counts']['ResearchProject'], 852)
        self.assertEqual(response_json['counts']['Organization'], 527)
        self.assertEqual(response_json['counts']['Person'], 62)
        self.assertEqual(response_json['counts']['Event'], 61)
        self.assertEqual(response_json['counts']['Vehicle'], 1)

    @mock.patch('requests.get', side_effect=mocked_requests_get)
    def test_search_on_type_and_text(self, mock_get):
        res = TestSearchApi.client.get('/search?search_text=Calcium&document_type=ResearchProject')
        response_json = res.json()
        self.assertEqual(len(response_json['docs']), 4, 'Expected 4 results for ResearchProject')
        for doc in response_json['docs']:
            self.assertEqual(doc['type'], 'ResearchProject')
