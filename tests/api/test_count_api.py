import unittest

import requests


COUNT_URL = 'http://localhost:8000/count'


class TestCountApi(unittest.TestCase):

    def test_count_all_unique_types(self):
        expected_counts = {"counts": {"CreativeWork": 40966, "Person": 20116, "Organization": 10610, "Dataset": 4166,
                                      "ResearchProject": 2771, "Event": 2394, "Course": 967, "Vehicle": 84,
                                      "DataCatalog": 1}}
        res = requests.get(COUNT_URL)
        self.assertEqual(res.json(), expected_counts)
