#!/usr/bin/env python3

"""
Purpose: Load a directory of JSON files, that are generated from 
         the ODIS graph->Solr process       

Steps:   1) set your Solr core endpoint variable at the commandline by:
            
              export SOLR_URL=http://127.0.0.1:8983/solr/cioos
            
         2) set the path to the directory of JSON files, at the commandline by:
            
              export DATA_DIR=/home/apps/oih-ui-jmckenna/indexer/data/test
            
         3) python indexer-graph-solr.py

Output:  Records indexed into the Solr core.  Look for the "added resource" link 
         in the command window, such as:
         
           ***Processing filename: /home/apps/oih-ui-jmckenna/indexer/data/test/ttt1.json
           added resource https://catalogue.cioos.ca/dataset/00863729-b5a8-4ac6-b73a-523d463f9963.jsonld: schema:Dataset to index
           ***Processing filename: /home/apps/oih-ui-jmckenna/indexer/data/test/ttt2.json
           added resource https://catalogue.cioos.ca/dataset/d1391e91-1ed2-4600-901a-5a5408fd1a6f.jsonld: schema:Dataset to index
         
Requires: Python 3.x

Notes:

  Input files are JSON (not JSON-LD that the orginal "indexer.py" required)
     
"""

import requests
import json
import os
from pathlib import Path
from test_utils import test_generation, dump_exception

#set urls
BASE_SOLR_URL=os.environ.get('SOLR_URL', '')
solr_url = BASE_SOLR_URL + "/update/json/docs"
delete_url = BASE_SOLR_URL + "/update"
query_url = BASE_SOLR_URL + "/select"

DATA_DIR=os.environ.get('DATA_DIR')
BASE_DIR=Path(DATA_DIR)

session = requests.Session()

# set Solr params
solr_params = {
    'commit': 'true',
    # echo implies a dry run
#    'echo': 'true',
}

#loop through directory
def import_file(file):
    with open(file, 'rb') as f:
        print ("***Processing filename: " + f.name)
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

        data = orig
        data['keys'] = list(data.keys())
        #    print (json.dumps(data, indent=2))
        data['json_source'] = json.dumps(data)
        solr_post = session.post(solr_url, params=solr_params, json=data)
        try:
            solr_post.raise_for_status()
            print("added resource %s: %s to index" % (data['id'], data['type']))
        except:
            dump_exception(orig, solr_post.text)
            return
        #print(solr_post.text)

for item in os.scandir(BASE_DIR):
    import_file(item)

