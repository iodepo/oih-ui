#!/usr/bin/env python3

import requests
import json

solr_url = "http://localhost:8983/solr/ckan/select"

solr_params = {
    'facet.limit':1000,
    'q': '*:*',
    "facet.field":[
                   'id',
                   ],
#    "fl":"id,name,txt_jobTitle",
    "start":"0",
    "sort":"score desc, indexed_ts desc",
    "fq":[
#        '+id:"oai:aquadocs.org:1834/6604"'
#        "+text:Calcium",
#        "+txt_keywords:Calcium",
#        "+type:Person",
#        "+text:Scientist",
#        "+text:Intersessional",
#          "+txt_wifi:Yes",
#          "-ds_geom:[-90,-180 TO 90,180]"   # exclude geo results
#          "{!geofilt sfield=ds_geom pt=53.285,-6.236 d=0.5}",
    ],
    "facet.mincount":"2",
    "rows":0,
    "facet":"true",
}

print(requests.get(solr_url, params=solr_params).text)
