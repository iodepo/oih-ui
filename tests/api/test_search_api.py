import requests
import unittest


SEARCH_URL = 'http://localhost:8000/search'


class TestStringMethods(unittest.TestCase):

    def test_search_no_result(self):
        res = requests.get(SEARCH_URL)
        print(res)
        response_json = res.json()
        print(response_json)
        self.assertEqual(res.status_code, 422)

    def test_search_text(self):
        res = requests.get(SEARCH_URL, json={'text': 'Calcium'})
        response_json = res.json()
        self.assertEqual(len(response_json), 10)
        self.assertEqual(response_json[0]['id'], 'https://edmerp.seadatanet.org/report/7985')
        self.assertEqual(response_json[0]['type'], 'ResearchProject')
        self.assertEqual(response_json[0]['name'], 'The impact of Coccolithophorid blooms off western Ireland')

        res = requests.get(SEARCH_URL, json={'text': 'Calcium water'})
        response_json = res.json()
        self.assertEqual(len(response_json), 10)
        print(res.json())
        self.assertEqual(response_json[0]['id'], 'https://oceanexpert.org/expert/43319')
        self.assertEqual(response_json[0]['type'], 'Person')
        self.assertEqual(response_json[0]['name'], 'Jennifer Waters')
