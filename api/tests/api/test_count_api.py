import unittest
from api.main import app
from fastapi.testclient import TestClient
from tests.resources.response_docs.count_document_type_response import count_document_type_response
from unittest import mock


count_document_type_params = {'params': {'q': '*:*', 'sort': 'score desc, indexed_ts desc', 'rows': 10, 'facet.mincount': 1, 'start': 0, 'facet': 'true', 'facet.field': ['type']}}
SOLR_URL = 'http://solr/select'


def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    if args[0] == SOLR_URL and kwargs == count_document_type_params:
        return MockResponse(count_document_type_response, 200)

    return MockResponse(None, 404)


class TestCountApi(unittest.TestCase):
    client = TestClient(app)

    @mock.patch('requests.get', side_effect=mocked_requests_get)
    def test_count_all_unique_types(self, mock_get):
        expected_counts = {"counts": {"CreativeWork": 40966, "Person": 20116, "Organization": 10610, "Dataset": 4166,
                                      "ResearchProject": 2771, "Event": 2394, "Course": 967, "Vehicle": 84,
                                      "DataCatalog": 1}}
        res = TestCountApi.client.get('/count?field=type')
        self.assertEqual(res.json(), expected_counts)
