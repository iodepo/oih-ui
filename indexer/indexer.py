#!/usr/bin/env python3

import requests
import json
import os
import subprocess
import itertools
import uuid
import hashlib
import shutil

from multiprocessing import Pool
from collections.abc import Iterable
from models import Att

solr_url = "http://localhost:8983/solr/ckan/update/json/docs"
delete_url = "http://localhost:8983/solr/ckan/update"
query_url = "http://localhost:8983/solr/ckan/select"

session = requests.Session()


BASE_DIR='./../../jsonld/120822/summoned'
PROV_DIR='./../../jsonld/120822/re-prov'

solr_params = {
    'commit': 'true',
    # echo implies a dry run
#    'echo': 'true',
}


# UNDONE
# - Tests
# - Geocoding of address in convert_place
# - Add the source file name hash id as graph_id

import conversions
from conversions import UnhandledDispatchException

from test_utils import test_generation, dump_exception

@test_generation
def dispatch(_type, d):
    try:
        return getattr(conversions, _type.replace(':','__'))(d)
    except (KeyError, AttributeError):
        raise UnhandledDispatchException()

def _extract_dict(d):
    _id = d.get('@id', d.get('url', None))
    _type = d.get('@type', None)

    try:
        if _type:
            return dispatch(_type, d)
    except (UnhandledDispatchException): pass

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


def upsert(url, data, flReindex=False):
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

        loc_trace = orig_source.get('location',None)

        orig_vals = sorted(json.dumps(list(orig_source.values())))
        if orig_vals != sorted(json.dumps(list(data.values()))):
            orig_source.update(data)
            new_vals = sorted(json.dumps(list(orig_source.values())))
            if new_vals == orig_vals and not flReindex:
                return
            if json.dumps(loc_trace) and loc_trace != json.dumps(orig_source['location']):
                dump_exception([loc_trace, orig_source['location']])
        else:
            if not flReindex: return
    except:
        orig_source = data

    index_one(orig_source)


def flatten(l):
    for item in l:
        if isinstance(item, Iterable) and not isinstance(item, str):
            for subitem in item:
                yield subitem
            continue
        yield item


## wrapper of the function to do test generation against the "generic" class
@test_generation(post=lambda x,y:x)
def genericTest(_type, orig, rid=None):
    return genericType_toAtts(orig, rid)

def genericType_toAtts(orig, rid=None):
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
        _id = rid or orig.get('@id', orig.get('url',''))
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
            if isinstance(att, Att):
                att.name = att.name or k
                data.append(att)
            else:
                data.extend(att)
            continue
        except (UnhandledDispatchException): pass
        if isinstance(v, str):
            data.append(Att('txt', [v], k))
            continue
        if isinstance(v, list):
            if isinstance(v[0], str):
                data.append(Att('txt', v, k))
                continue
            elif isinstance(v[0], dict):
                try:
                    vals = sorted(flatten(_extract_dict(elt) for elt in v))
                except TypeError as msg:
                    dump_exception(orig, str(msg))
                    continue
                # this should be sorted (prefix1, val), (prefix1, val2), (prefix2, val2)
                for prefix, val in itertools.groupby(vals, lambda x:x.prefix):
                    _val = [elt.value for elt in val if elt.value]
                    names = [elt.name for elt in val if elt.name]
                    if names:
                        name = name.pop()
                    else:
                        name = k
                    if _val:
                        data.append(Att(prefix, _val, name))

        if isinstance(v, dict):
            atts = _extract_dict(v)
            if not isinstance(atts, list):
                atts = [atts]
            for att in atts:
                if not att.value: continue
                if not att.name:
                    att.name = k
            data.extend(atts)

    #old singlevalued version.
    # return {d.key:d.value for d in data if d.value}

    # Note that some things like provider can come from either provider or prov:wasAttributedTo,
    # so we can get lists of these things from multiple keys that need to be merged.
    ret = {}
    for d in data:
        ### Complicated. Want either single string valued, or list of
        ### items, but some single string items can't be sent as a
        ### list. So we can't use a default dict, we have to iterate.
        if not d.value: continue
        if not d.key in ret:
            ret[d.key] = d.value
            continue
        ret[d.key] = list(flatten([ret[d.key], d.value]))
    return ret




def _merge_prov(orig, prov):
    if prov and not 'prov:wasAttributedTo' in orig:
        orig = orig.copy()
        orig['prov:wasAttributedTo'] = prov
    return orig

def index_one(orig, rid=None, prov=None):
    data = genericTest('generic', _merge_prov(orig, prov), rid)
#    data = genericType_toAtts(orig, rid)
    data['keys'] = list(data.keys())
#    print (json.dumps(data, indent=2))
    data['json_source'] = json.dumps(orig)
    # UNDONE -- there's a race condition here that's led to ~ 700 documents being included multiple times.
    # UNDONE -- refactor into transform (internal) and index.
    session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'id:"%s"' % data['id']}})
    #print(json.dumps(data, indent=2))
    solr_post = session.post(solr_url, params=solr_params, json=data)
    try:
        solr_post.raise_for_status()
        print("added resource %s: %s to index" % (data['id'], data['type']))
    except:
        dump_exception(orig, solr_post.text)
        return
#    print(solr_post.text)
    #break

_upserted = {}
def upsert_once(_id, data, flReindex=False):
    if _id in _upserted: return
    _upserted.add(_id)
    upsert(_id, data, flRindex)

def upsert_one(orig, prov=None, flReindex=False):
    orig = _merge_prov(orig, prov)
    _id = orig.get('@id', orig.get('url',''))
    if _id:
        return upsert(_id, orig, flReindex)
    if prov:
        prov_id = prov.get('@id', None)
        if prov_id:
            upsert_once(prov_id, prov, flReindex)
    index_one(orig)

def resolve_prov_file(filename):
    try:
        with open(os.path.join(PROV_DIR,filename), 'rb') as f:
            prov = json.load(f)
        for elt in prov.get('@graph',[]):
            if elt.get('@type',None) == 'prov:Organization':
                return elt

    except Exception as msg:
        print ("Exception load prov for %s: %s", (filename, msg))
        return None

def import_file(filename):
    filename = filename.strip()

    prov = resolve_prov_file(filename)

    print (os.path.join(BASE_DIR,filename))

    with open(os.path.join(BASE_DIR,filename), 'rb') as f:
        try:
            orig = json.load(f)
        except UnicodeDecodeError:
            f.seek(0)
            file_bytes= f.read()
            try:
                file_string = file_bytes.decode('latin1')
                orig = json.loads(file_string)
            except Exception as msg:
                print ("Issue decoding %s, continuing" % filename)
                shutil.copy(os.path.join(BASE_DIR,filename), os.path.join('exceptions', filename.split('/')[-1]))
                return

    doc_type = orig.get('@type', None)

    if isinstance(doc_type, list):
        if doc_type[0] == "ItemList":
            itemListElements = orig.get('itemListElement',[])
            for elt in itemListElements:
                try:
                    upsert_one(elt['item'], prov=prov)
                except Exception as msg:
                    print("Exception in itemList: %s" % msg)
                    try:
                        dump_exception(elt['item'], str(msg))
                    except KeyError: pass
        return

    if not doc_type:
        graph = orig.get('@graph',[])
        if graph:
            for elt in graph:
                try:
                    upsert_one(elt, prov=prov)
                except Exception as msg:
                    print("Exception parsing graph: %s" % msg)
                    try:
                        dump_exception(elt['item'], str(msg))
                    except KeyError: pass
            return

    try:
        upsert_one(orig, prov=prov)
    except Exception as msg:
        print ("Exception on bare upsert: %s" % msg)
        try:
            dump_exception(orig, str(msg))
        except KeyError: pass

def index_all(paths):
    for path in paths:
        with open(path) as files:
            with Pool(8) as p:
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

def reindex_query(fq, chunk=100):
    start = 0
    ct = None
    solr_params = {
        'q': '*:*',
        "fl":"id,json_source",
        "sort":"id asc",  # this can't be the indexed timestamp
        "rows":chunk,
        'fq': fq,
    }

    while start==0 or start < ct:
        solr_params['start'] = start
        print ("indexing from %s of %s" %(start, ct))
        resp = session.get(query_url, params=solr_params).json()

        start += chunk
        if ct is None:
            ct = resp['response']['numFound']

        for orig in resp['response']['docs']:
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
    paths = ('./person.txt',
             './research_project.txt',
             './course.txt',
             './creative_work.txt',
             )

    #paths = ('./research_project.txt',)

    #session.post(delete_url, params={"commit":"true"}, json={"delete":{"query":'type:"PropertyValue"'}})
    if True:
        index_all(['../all_files.v2.txt'])
    #index_all(['./event.txt'])
    #index_all(paths + ('./organizations.txt', './spatial.txt'))
    #index_all(['./organizations.txt', './spatial.txt'])
    #remove_dups()
    #import_file('obis/df819829c4cc82c0442d5ebb00ea9aadaa7d0842.jsonld')
    #import_file('oceanexperts/5ec3b5b61e65100386448c5e8eb078ad9790c37f.jsonld')

    if False:
        #prov
        #import_file('edmo/00032788b3d1eecf4257bd8ffd42c5d56761a6bf.jsonld')
        #import_file('edmo/00226d82454eea1058f1677f3b57599d83517acb.jsonld')
        import_file('obis/f4c5646df687db8f6fb4e373764ffaf4d6cab621.jsonld')
    if False:
        # polygon
        import_file('obis/42ce161b29ce021957e8db4b6a30cb9cf75646f7.jsonld')
        # knows about events
        import_file('oceanexperts/fff4c32ad70f1767a3a6ff7dfa0181fd56f77753.jsonld')
        # non-point locations, start/end dates for course instance
        import_file('oceanexperts/d5cf2f2580f59f45c6ab86ed2e1740893b5a4b59.jsonld')
        # provider
        import_file('obis/c0f54b1a7d64ba983f1937d4d8708239804655d8.jsonld')

    if False:
        reindex_query(["+has_geom:true"])
