import requests
import json
import os
import subprocess
import itertools
import uuid

from multiprocessing import Pool

solr_url = "http://localhost:8983/solr/ckan/update/json/docs"
delete_url = "http://localhost:8983/solr/ckan/update"
query_url = "http://localhost:8983/solr/ckan/select"

session = requests.Session()


BASE_DIR='./../jsonld/summoned'


solr_params = {
    'commit': 'true',
#    'echo': 'true',
}


# UNDONE
# - Refactor
# - Tests
# - Save exceptions in exceptions file
# - Geocoding of address in convert_place
# - Add the source file name hash id as graph_id

def convert_place(d):
    _formats = {'polygon': 'POLYGON ((%s))',
                'point': 'POINT (%s)'}
    
    geo = d.get('geo', None)
    if geo and geo['@type'] != 'GeoShape':
        for field, fmt in _formats.items():
            val = geo.get(field,None)
            if val:
                return ('geom', fmt % val)    

    lat = d.get('latitude', None)
    lon = d.get('longitude', None)
    if lat is not None and lon is not None:
        return ('geom', _formats['point'] % ('%s %s'% (lon, lat)))

    address = d.get('address', None)
    if address:
        return ('txt', address)
    
    return ('txt', '')

def _extract_dict(d):
    _id = d.get('@id', None)
    _type = d.get('@type', None)
    
    if _id and _type not in {'PropertyValue'}:
        upsert(_id, d)
        return ('id', _id)    
        
    _map = {'ProgramMembership': 'programName',
            'Organization': 'url',
            'PropertyValue': 'value',
            'DataDownload': 'contentUrl',
            'Place': convert_place,
            }
    field =  _map.get(d.get('@type',None),None)

    try:
        if field:
            if callable(field):
                return field(d)
            else:
                return ('txt', d[field])
    except KeyError: pass

    member = d.get('member', None)
    if member:
        return _extract_dict(member)
    
    return ('txt', d.get('name', d.get('description','')))


def upsert(url, data):
    solr_params = {
        'q': '*:*',
        "fl":"id,json_source",
        "start":"0",
        "sort":"indexed_ts desc",
        "fq":[
            '+id:"%s"' % url
        ],
        "rows":"1",
    }

    resp = session.get(query_url, params=solr_params).json()
    try:
        orig = resp['response']['docs'][0]
        orig_source = json.loads(orig['json_source'])
        if sorted(list(orig_source.values())) == sorted(data.values()):
            return
        orig_source.update(data)
    except:
        orig_source = data
    
    index_one(orig_source)
    


def index_one(orig):
    try:
        data = {
            'id': orig.get('@id', orig.get('url','')),
            'type': orig['@type'],
        }
    except KeyError as msg:
        print("Error -- didn't get id or url")
        return

    if not data['id']:
        #UNDONE Hash name instead?
        data['id'] = str(uuid.uuid4())
    
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
                vals = sorted([_extract_dict(elt) for elt in v])
                for prefix, val in itertools.groupby(vals, lambda x:x[0]):
                    _val = [elt[1] for elt in val if elt[1]]
                    if _val:
                        data['%s_%s' %(prefix,k)] = _val
                        
        if isinstance(v, dict):
            prefix, val = _extract_dict(v)
            if not val: continue
            if prefix == 'geom':
                data['the_geom'] = val
            else:
                data['%s_%s' % (prefix,k) ] = val

    data['keys'] = list(data.keys())
#    print (json.dumps(data, indent=2))
    data['json_source'] = json.dumps(orig)
    # UNDONE -- there's a race condition here that's led to ~ 700 documents being included multiple times.
    # UNDONE -- refactor into transform (internal) and index. 
    session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'id:"%s"' % data['id']}})
    solr_post = session.post(solr_url, params=solr_params, json=data)
    solr_post.raise_for_status()
    #print(solr_post.text)
    print("added resource %s: %s to index" % (data['id'], data['type']))
    #break


paths = ('./person.txt',
         './research_project.txt',
         './course.txt',
         './creative_work.txt',
         )

#paths = ('./research_project.txt',)



def import_file(filename):
    filename = filename.strip()

    print (os.path.join(BASE_DIR,filename))

    with open(os.path.join(BASE_DIR,filename), 'r') as f:
        try:
            orig = json.load(f)
        except UnicodeDecodeError:
            print ("Issue decoding %s, continuing" % filename)
            return

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
        return

    # if doc_type != 'Person':
    #     print("Type %s, skipping %s" % (doc_type, filename))
    #     continue

    try:
        index_one(orig)
    except Exception as msg:
        print(json.dumps(orig, indent=2))
        print(msg)

def index_all(paths):
    for path in paths:
        with open(path) as files:
            with Pool(5) as p:
                p.map(import_file, list(files))

def reindex(url):
    solr_params = {
        'q': '*:*',
        "fl":"id,json_source",
        "start":"0",
        "sort":"indexed_ts desc",
        "fq":[
            '+id:"%s"' % url
        ],
        "rows":"1",
    }

    resp = session.get(query_url, params=solr_params).json()
    orig = resp['response']['docs'][0]

    orig_source = json.loads(orig['json_source'])
    index_one(orig_source)


def fetch_dups():
    solr_params = {
        'facet.limit':1000,
        'q': '*:*',
        "facet.field":[
            'id',
        ],
        "sort":"score desc, indexed_ts desc",
        "facet.mincount":"2",
        "rows":0,
        "facet":"true",
    }

    resp = session.get(query_url, params=solr_params).json()
    return resp['facet_counts']['facet_fields']['id'][::2]

def remove_dups():
    for url in fetch_dups():
        reindex(url)
    

if __name__ == '__main__':
    #session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'type:"PropertyValue"'}})
    #index_all(['./all_indexed_files.txt'])
    index_all(['./event.txt'])
    #index_all(paths + ('./organizations.txt', './spatial.txt'))
    #index_all(['./organizations.txt', './spatial.txt'])
    #remove_dups()
    #import_file('obis/df819829c4cc82c0442d5ebb00ea9aadaa7d0842.jsonld')
    #import_file('oceanexperts/5ec3b5b61e65100386448c5e8eb078ad9790c37f.jsonld')
    #import_file('oceanexperts/fff3e882eb655768de60f6f2b1ae09e09af1bb7e.jsonld')

    
