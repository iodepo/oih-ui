#!/usr/bin/env python3

import requests

solr_url = "http://localhost:8983/solr/ckan/select"
delete_url = "http://localhost:8983/solr/ckan/update"

requests.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'*:*'}})
