# API

## Running in Development

A docker-compose service like this is sufficient for running the app in development mode:
```
  api:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - "./api:/usr/src/app/api"
    environment:
      - SOLR_URL=http://solr:8983/solr/ckan
      - VIRTUAL_HOST=api.${HOST}
      - VIRTUAL_PROTO=http
```
(Note, adjust path prefixes to the relative path between the dockerfile and this directory

Alternately, something like this is sufficient for running the api in a local virtual environment. You will need to provide a `SOLR_URL` environment variable for the connection to the backend.
```
python3 -mvenv vpy
source vpy/bin/activate
python3 -m pip install -r requirements.txt
export SOLR_URL=http://localhost:8983/solr/core
uvicorn api.main:app --reload --host=127.0.0.1 --port=8000
```


## Production Build

The dockerfile can be built as usual -- when working in production simply don't volume mount the live source over the source that is baked into the docker file. You can also remove the `--reload` flag from the uvicorn command in the docker file to slightly cut down the load on the server.

## Customization

* `main.py` has several variables at the top that can be customized:
  - `AVAILABLE_FACETS` are the default facets searched if there are no `FACET_FIELDS` defined for the query type.
  - `facet_invervals` is a list of intervals built up to bin the startYear/endYear fields into approximately equal buckets by count, not by year. If you change the number of intervals, make sure that they cover the range (i.e., closed on one end, open on the other, and that there are no gaps), and that the facet limit is sufficient to cover all of the ranges (see the last few lines of `util/solr_query_builder`, `self.params["f.n_endYear.facet.limit"] = 30`).
  - `FACET_FIELDS` are the fields for each of the individual query types. These are the facets that are individually valued, not range facets.
  - `FACET_INTERVALS` defines the mapping of query type to the interval type facets that are returned. Currently we only have `n_startYear` and `n_endYear` in the data, and only for certain fields.
  - `GEOJSON_ROWS` is the limit for the number of items returned in a geojson/spatial query.

* `util/solr_query_builder.py` contains a few items within the code that are potentially useful to tweak.
  - The `__init__` method would be a good place to set default values for queries, including the default operation and the query parser.
  - Additional types may need new entries in the formats list
  - The facet intervals are controlled in the `add_facet_interval` method.
