import collections
import os
import sys
from pathlib import Path
import json

def setup(dest):
    if dest.exists():
        if not dest.is_dir():
            print ("Destination exists and is not a directory: %s" % dest)
            return 2
        return 0
    try:
        dest.mkdir(parents=True)
        return 0
    except Exception as msg:
        print (msg)
        return 2

def run_subdir(src, dest):
    if setup(dest/src.name):
        raise Exception("directory issue with %s" %src.name)


    def resolve_file(graph):
        for elt in graph:
            if elt.get('@type', None) != 'prov:Entity': continue
            value = elt.get('prov:value','')
            if value.endswith('jsonld'):
                return value

    def resolve_date(graph):
        for elt in graph:
            if elt.get('@type', None) != 'prov:Activity': continue
            return elt.get('prov:endedAtTime',{}).get('@value',None)

    collection = collections.defaultdict(dict)

    for jsonld in os.scandir(src):
        if not jsonld.name.endswith('jsonld'):
            print ("Skipping %s" % jsonld.name)
            continue
        try:
            with open(jsonld) as f:
                data = json.load(f)
            graph = data.get('@graph',[])
            filename = resolve_file(graph)
            dt = resolve_date(graph)
            if not filename or not dt:
                continue
        except Exception as msg:
            print ("Exception reading jsonld: %s, %s" %(jsonld, msg))
            continue

        existing = collection[filename]
        ex_graph = existing.get('@graph',[])
        ex_dt = resolve_date(ex_graph)

        if not ex_dt or dt > ex_dt:
            collection[filename] = data

    for filename, data in collection.items():
        with open (dest/ src.name/ filename, 'w') as f:
            json.dump(data, f)


def main():
    args = sys.argv
    if len(args) != 3:
        print ("Usage: ")
        print ("  rewrite_prov.py src dest")
        return 1

    src = Path(args[1])
    dest = Path(args[2])

    if not src.is_dir():
        print ("Source is not a directory or does not exist")
        return 2

    err = setup(dest)
    if err: return (err)

    for subdir in os.scandir(src):
        if not subdir.is_dir(): continue
        run_subdir(subdir, dest)

if __name__=='__main__':
    sys.exit(main())
