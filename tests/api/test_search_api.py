import requests
import unittest
import urllib.parse


# SEARCH_URL = 'http://localhost:8000/search'
SEARCH_URL = 'http://oih.staging.derilinx.com:8000/search'


class TestSearchApi(unittest.TestCase):

    def test_search_no_result(self):
        res = requests.get(SEARCH_URL)
        self.assertEqual(res.status_code, 422)

    def test_search_text(self):
        search_word = 'Calcium'
        res = requests.get(SEARCH_URL + f'?text={search_word}')
        response_json = res.json()
        self.assertEqual(len(response_json['docs']), 10, 'Expected 10 results for Calcium')
        self.assertEqual(response_json['docs'][0]['id'], 'https://edmerp.seadatanet.org/report/7985')
        self.assertEqual(response_json['docs'][0]['type'], 'ResearchProject')
        self.assertEqual(response_json['docs'][0]['name'], 'The impact of Coccolithophorid blooms off western Ireland')

        self.assertEqual(response_json['counts']['CreativeWork'], 235)
        self.assertEqual(response_json['counts']['ResearchProject'], 4)

        search_word = 'Calcium water'
        res = requests.get(SEARCH_URL + f'?text={urllib.parse.quote(search_word)}')
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

    def test_search_on_type_and_text(self):
        res = requests.get(SEARCH_URL + '?text=Calcium&document_type=ResearchProject')
        response_json = res.json()
        self.assertEqual(len(response_json['docs']), 4, 'Expected 4 results for ResearchProject')
        for doc in response_json['docs']:
            self.assertEqual(doc['type'], 'ResearchProject')
