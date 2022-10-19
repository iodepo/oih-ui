## Queries

These scripts were used during development to make requests directly to SOLR, for either exploration of the data or to reset the index.

* `dups.py` returns items with duplicate item ids in the system.
* `unsafe_delete_index.py` drops the index. Data loss will occur.
* `s.py` was used to explore the index, and has many parameters available or commented out.

To use, you may need to alter the url to the solr instance at the top of each script:

```
python3 -mvenv vpy
source vpy/bin/activate
python3 -m pip install -r requirements.txt  # or pip install requests
python3 ./s.py
```
