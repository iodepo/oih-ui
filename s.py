#!/usr/bin/env python

import requests
import json

solr_url = "http://localhost:8983/solr/ckan/select"

solr_params = {
    'facet.limit':20,
    'q': '*:*',
    "facet.field":['txt_knowsAbout',
                   'name',
                   'txt_knowsLanguage',
                   'txt_nationality',
                   'txt_jobTitle',
                   'txt_contributor',
                   'txt_keywords',
                   'txt_memberOf',
                   'txt_parentOrganization',
                   'id_provider',
                   'id_includedInDataCatalog',
                   'id_identifier',
                   'id',
                   'keys',
                   'type',
                    ],
#    "fl":"id,name,txt_jobTitle",
    "start":"0",
    "sort":"score desc, indexed_ts desc",
    "fq":[
#        '+id:"oai:aquadocs.org:1834/967"'
#        '+text:"https://edmo.seadatanet.org/report/784"',
#        '-txt_parentOrganization:"https://edmo.seadatanet.org/report/784"',
#        '+type:Event',
        "+text:Calcium",
#        "+txt_keywords:Calcium",
#        "+type:ResearchProject",
#        "+text:Scientist",
#        "+text:Intersessional",
#          "+txt_wifi:Yes",
#          "-ds_geom:[-90,-180 TO 90,180]"   # exclude geo results
#          "{!geofilt sfield=ds_geom pt=53.285,-6.236 d=0.5}",
    ],
    "facet.mincount":"1",
    "rows":"10",
    "facet":"true",
}

r = requests.get(solr_url, params=solr_params)

#print (r.text)
data =  r.json()
print (json.dumps(data['response']['docs'][0], indent=2))

print (json.dumps(json.loads(data['response']['docs'][0]['json_source']), indent=2))

print (json.dumps(data['facet_counts'], indent=2))
