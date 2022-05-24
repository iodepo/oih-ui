import requests
import json
import os
import subprocess

solr_url = "http://localhost:8983/solr/ckan/update/json/docs"
delete_url = "http://localhost:8983/solr/ckan/update"

session = requests.Session()

type_map = {int: "n_",
            float: "n_",
            str: "txt_",
            "timestamp": "dt_",  # undone
}


BASE_DIR='/Users/erics/src/unesco-search/jsonld/summoned'

filenames = ('oceanexperts/5ec3b5b61e65100386448c5e8eb078ad9790c37f.jsonld',
             )

solr_params = {
    'commit': 'true',
#    'echo': 'true',
}

print (os.path.join(BASE_DIR,filenames[0]))


def index_one(orig):
    data = {
        'id': orig['@id'],
        'type': orig['@type'],
    }

    for k,v in orig.items():
        if not v: continue
        if k in {'@id','@type','@context'}:
            continue
        if k in {'name', 'description'}:
            data[k] = v
            continue
        if isinstance(v, str):
            data['txt_%s' %k ] = [v]
        if isinstance(v, list):
            if isinstance(v[0], str):
                data['txt_%s' %k ] = v
                continue
            elif isinstance(v[0], dict):
                data['txt_%s' %k ] = list(filter(lambda x:x,
                                     [elt.get('name', '') for elt in v] +
                                     [elt.get('description', '') for elt in v]))

    print (data)
    session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":"id:%s" % data['id']}})
    solr_post = session.post(solr_url, params=solr_params, json=data)
    solr_post.raise_for_status()
    #print(solr_post.text)
    print("added datastore resource %s to index" % data['id'])
    #break


path = './person.txt'
#path = './creative_work.txt'


with open(path) as files:
    for filename in files:
        filename = filename.strip()

        print (os.path.join(BASE_DIR,filename))

        with open(os.path.join(BASE_DIR,filename), 'r') as f:
            try:
                orig = json.load(f)
            except UnicodeDecodeError:
                print ("Issue decoding %s, continuing" % filename)
                continue

        doc_type = orig.get('@type', None)

        if isinstance(doc_type, list):
            if doc_type[0] == "ItemList":
                itemListElements = orig.get('itemListElement',[])
                for elt in itemListElements:
                    try:
                        index_one(elt['item'])
                    except Exception as msg:
                        print(msg)
                        print(json.dumps(elt))
            continue

        # if doc_type != 'Person':
        #     print("Type %s, skipping %s" % (doc_type, filename))
        #     continue

        try:
            index_one(orig)
        except Exception as msg:
            print(json.dumps(orig, indent=2))
            print(msg)
        break
