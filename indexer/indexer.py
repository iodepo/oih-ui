#!/usr/bin/env python3

import requests
import json
import os
import subprocess
import itertools
import uuid
import hashlib
import shutil
from pathlib import Path

from multiprocessing import Pool
from models import Att
from common import flatten


BASE_SOLR_URL=os.environ.get('SOLR_URL', '')
solr_url = BASE_SOLR_URL + "/update/json/docs"
delete_url = BASE_SOLR_URL + "/update"
query_url = BASE_SOLR_URL + "/select"

DATA_DIR=os.environ.get('DATA_DIR')
BASE_DIR=Path(DATA_DIR) / 'summoned'
PROV_DIR=Path(DATA_DIR) / 're-prov'

session = requests.Session()


solr_params = {
    'commit': 'true',
    # echo implies a dry run
#    'echo': 'true',
}


import conversions
from conversions import UnhandledDispatchException, IDCollisionError

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
            Att('txt', str(d.get('name', d.get('description',''))))
        ]

    member = d.get('member', None)
    if member:
        return _extract_dict(member)

    # Erroring if description is a number
    return Att('txt', str(d.get('name', d.get('description',''))))


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

        if orig_source.get('@type', None) != data.get('@type', None):
            # If the types are different, there are potentially two
            # objects in the graph with the same id This is the case
            # for https://www.marinetraining.eu/node/3857, which is
            # both a CourseInstance and a Course
            dump_exception([data, orig_source], "Duplicate ID with different types found")
            raise(IDCollisionError(url))

        loc_trace = orig_source.get('location',None)

        if orig_source != data:
            orig_source.update(data)
            if orig_source == json.loads(orig['json_source']) and not flReindex:
                # did we make a change with the update
                return
            if loc_trace and loc_trace != orig_source['location']:
                dump_exception([loc_trace, orig_source['location']])
        else:
            if not flReindex: return
    except:
        orig_source = data

    index_one(orig_source)


## wrapper of the function to do test generation against the "generic" class
@test_generation(post=lambda x:x)
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
            name = orig.get('name', None)
            if name:
                _id = hashlib.md5(name.encode('utf-8')).hexdigest()
            else:
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

_upserted = set()
def upsert_once(_id, data, flReindex=False):
    if _id in _upserted: return
    _upserted.add(_id)
    upsert(_id, data, flReindex)

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
        with open(PROV_DIR / filename, 'rb') as f:
            prov = json.load(f)
        for elt in prov.get('@graph',[]):
            if elt.get('@type',None) == 'prov:Organization':
                return elt

    except Exception as msg:
        print ("Exception load prov for %s: %s", (filename, msg))
        return None

def import_file(path, flReindex=False):
    if isinstance(path, str):
        filename = path.strip()
        prov = resolve_prov_file(path)
        src = os.path.join(BASE_DIR,path)
        print(src)
    else:
        prov = resolve_prov_file(path)
        src = BASE_DIR / path

    with open(src, 'rb') as f:
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
                shutil.copy(src, os.path.join('exceptions', filename.split('/')[-1]))
                return

    doc_type = orig.get('@type', None)

    if isinstance(doc_type, list):
        if doc_type[0] == "ItemList":
            itemListElements = orig.get('itemListElement',[])
            for elt in itemListElements:
                try:
                    upsert_one(elt['item'], prov=prov, flReindex=flReindex)
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
                    upsert_one(elt, prov=prov, flReindex=flReindex)
                except Exception as msg:
                    print("Exception parsing graph: %s" % msg)
                    try:
                        dump_exception(elt['item'], str(msg))
                    except KeyError: pass
            return

    try:
        upsert_one(orig, prov=prov, flReindex=flReindex)
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

def index_dir(src_dir):
    def recursive_walk(d):
        for item in os.scandir(d):
            if item.is_file() and item.name.endswith('jsonld'):
                yield Path(item.path).relative_to(BASE_DIR)
            if item.is_dir():
                for sub_item in recursive_walk(item):
                    yield sub_item
    with Pool(8) as p:
        p.map(import_file, recursive_walk(src_dir))


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
    import argparse
    parser = argparse.ArgumentParser(description="Index summoned data")
    parser.add_argument('--reindex-query',
                        dest='fq',
                        nargs='+',
                        help='fq (filterquery) expression to reindex from items already in the index')
    parser.add_argument('-f', '--file',
                        nargs='+',
                        dest='file',
                        help='index one file, relative to the DATA_DIR base')
    parser.add_argument('--generate-test',
                        dest='test',
                        action='store_true',
                        help='generate test cases from indexed data into ./test (caution, may create many artifacts)')

    args = vars(parser.parse_args())

    # rewrite test / exception generation directories.
    from test_utils import BASE_DIR as test_base_dir
    test_base_dir = BASE_DIR

    if args.get('test', False):
        from test_utils import GENERATE_TESTS
        GENERATE_TESTS = True

    if args.get('fq', None):
        reindex_query(args['fq'])
    elif args.get('file', None):
        filearg = args['file']
        if isinstance(filearg, str):
            import_file(filearg)
        else:
            for f in filearg:
                import_file(f)
    else:
        index_dir(BASE_DIR)
