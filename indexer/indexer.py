#!/usr/bin/env python3

import requests
import json
import os
import subprocess
import itertools
import uuid

from multiprocessing import Pool
from collections.abc import Iterable
from models import Att

solr_url = "http://localhost:8983/solr/ckan/update/json/docs"
delete_url = "http://localhost:8983/solr/ckan/update"
query_url = "http://localhost:8983/solr/ckan/select"

session = requests.Session()


BASE_DIR='./../../jsonld/summoned'


solr_params = {
    'commit': 'true',
    'echo': 'true',
}


# UNDONE
# - Refactor
# - Tests
# - Save exceptions in exceptions file
# - Geocoding of address in convert_place
# - Add the source file name hash id as graph_id

import conversions
from test_utils import test_generation

@test_generation
def dispatch(_type, d):
    return getattr(conversions, _type)(d)

def _extract_dict(d):
    _id = d.get('@id', d.get('url', None))
    _type = d.get('@type', None)

    try:
        if _type:
            return dispatch(_type, d)
    except (TypeError): pass

    if _id and _type not in {'PropertyValue'}:
        upsert(_id, d)
        return [
            Att('id', _id),
            Att('txt', d.get('name', d.get('description','')))
        ]

    member = d.get('member', None)
    if member:
        return _extract_dict(member)

    return Att('txt', d.get('name', d.get('description','')))


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


def flatten(l):
    for item in l:
        if isinstance(item, Iterable):
            for subitem in item:
                yield subitem
            continue
        yield item


## wrapper of the function to do test generation against the "generic" class
@test_generation(post=lambda x:x)
def genericTest(_type, orig):
    return genericType_toAtts(orig)

def genericType_toAtts(orig):
    """
     This is a generic entity -> solr atts table for json-ld structures.
    dictionary => dictionary

    * For items that are common, (name, type, description) we add them
      to the corresponding field.

    * For items with specific names, we dispatch to name specific
      parsers, which return an Att or list of Atts

    * For text items, we add them directly, as txt_[field] = value

    * For dictionaries, we call out to extract the data from the
      dictionary. This may be single valued, or it may be multivalued,
      including creating and referencing other graph nodes.

    * For lists, we add all of the individual items, either extracted
      from dictionaries or a list of string.


    """
    try:
        _id = orig.get('@id', orig.get('url',''))
        if not _id:
            #UNDONE Hash name instead?
            _id = str(uuid.uuid4())
        data = [
            Att(None, _id, 'id'),
            Att(None, orig['@type'], 'type'),
        ]
    except KeyError as msg:
        print("Error -- didn't get id or url and type")
        return

    for k,v in orig.items():
        if not v: continue
        if k in {'@id','@type','@context'}:
            continue
        if k in {'name', 'description'}:
            data.append(Att(None, v, k))
            continue
        try:
            # check by name
            att = dispatch(k, v)
            att.name = k
            if isinstance(att, Att):
                data.append(att)
            else:
                data.extend(att)
            continue
        except (KeyError, AttributeError): pass
        if isinstance(v, str):
            data.append(Att('txt', [v], k))
            continue
        if isinstance(v, list):
            if isinstance(v[0], str):
                data.append(Att('txt', v, k))
                continue
            elif isinstance(v[0], dict):
                vals = sorted(flatten(_extract_dict(elt) for elt in v))
                # this should be sorted (prefix1, val), (prefix1, val2), (prefix2, val2)
                for prefix, val in itertools.groupby(vals, lambda x:x.prefix):
                    _val = [elt.value for elt in val if elt.value]
                    if _val:
                        data.append(Att(prefix, _val, k))

        if isinstance(v, dict):
            atts = _extract_dict(v)
            if not isinstance(atts, list):
                atts = [atts]
            for att in atts:
                if not att.value: continue
                if not att.name:
                    att.name = k
            data.extend(atts)

    return {d.key:d.value for d in data if d.value}


def index_one(orig):
    data = genericTest('generic', orig)
#    data = genericType_toAtts(orig)
    data['keys'] = list(data.keys())
#    print (json.dumps(data, indent=2))
    data['json_source'] = json.dumps(orig)
    # UNDONE -- there's a race condition here that's led to ~ 700 documents being included multiple times.
    # UNDONE -- refactor into transform (internal) and index.
    session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'id:"%s"' % data['id']}})
    print(json.dumps(data, indent=2))
    solr_post = session.post(solr_url, params=solr_params, json=data)
    solr_post.raise_for_status()
#    print(solr_post.text)
    print("added resource %s: %s to index" % (data['id'], data['type']))
    #break





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

    index_one(orig)
    # try:
    #     index_one(orig)
    # except Exception as msg:
    #     print(json.dumps(orig, indent=2))
    #     print(msg)

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


paths = ('./person.txt',
         './research_project.txt',
         './course.txt',
         './creative_work.txt',
         )

#paths = ('./research_project.txt',)

if __name__ == '__main__':
    #session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'type:"PropertyValue"'}})
    #index_all(['./all_indexed_files.txt'])
#    index_all(['./event.txt'])
    #index_all(paths + ('./organizations.txt', './spatial.txt'))
    #index_all(['./organizations.txt', './spatial.txt'])
    #remove_dups()
    #import_file('obis/df819829c4cc82c0442d5ebb00ea9aadaa7d0842.jsonld')
    #import_file('oceanexperts/5ec3b5b61e65100386448c5e8eb078ad9790c37f.jsonld')
    #import_file('obis/42ce161b29ce021957e8db4b6a30cb9cf75646f7.jsonld')
    import_file('oceanexperts/fff4c32ad70f1767a3a6ff7dfa0181fd56f77753.jsonld')
