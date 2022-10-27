# Indexer

## Architecture

The core storage is a SOLR instance to provide faceting, free text
search, and geographic search, populated with an index of a corpus of
jsonld documents.

The SOLR instance contains a customized schema, defining a set of
common fields (`id`/`name`/`description`/`type`) and a dynamic set of
other fields, coded by type. (`txt_*`, `id_`, `n_*` and `dt_*`). The
field names will be included in a manner so that there is a simple
mapping from predicate -> field name to enable faceting.

All of the `txt_*` fields will be combined into a catchall `text`
field, to enable cross field fulltext searching.

All geometric fields will be indexed into a `the_geom` field in WKT
format for search purposes. In addition, there will be alternate
geojson encoded versions of the geometry stored for quick retrieval
and return in the api: `geojson_geom` will store the full geojson,
`geojson_simple` will store a simplified version of the feature --
useful if the geometry is a complex polygon, adn `geojson_point` will
store a point representation of the feature for those cases where the
feature would be too small to render on a map.  To help determine
which of the fields to render, a pre-computed `geojson_length` and
`geojson_area` are stored in the index. These allow for an approximate
characteristic pixel size for a feature to be determined.

Anything that is recognized as a node identity will be stored in an
`id_*` field. The intention is that anything that is included here
will be accessible based on a query against that id, as if this were a
graph traversal.

Numeric and datestamp fields will be included for filtering on date
ranges and other more 'advanced' search methods.

Specific schema.org node types can be converted to documents or fields
depending on the schema and contents.  (see `conversion.py` for the place
conversion for points, polygons, locations, and addresses). Lists and
dictionaries will be recursively processed.  This is not intended to
be a high fidelity representation of the graph data for the particular
node, it's meant to be an easily searched and faceted data store. For
high fidelity views of the objects, we will store the original json-ld
document corresponding to the node that was indexed. This may include
connected nodes (e.g. Organizations will contain the members).

The field names (`keys`) for the document will be indexed to allow a
facet query to determine what fields would be useful to search for a
given query.

For example (searching for calcium):

The json-ld document:
```
{
  "@context": {
    "@vocab": "https://schema.org/"
  },
  "@type": "ResearchProject",
  "@id": "https://edmerp.seadatanet.org/report/7985",
  "name": "The impact of Coccolithophorid blooms off western Ireland",
  "identifier": "7985",
  "alternateName": "N/A",
  "url": "https://edmerp.seadatanet.org/report/7985",
  "sameAs": "http://www.nuigalway.ie/microbiology/dr__john_w__patching.html",
  "description": "High concentrations or blooms of the coccolithophorid Emiliania huxleyi can significantly affect a region by acting as a source of organic sulfur (i.e. dimethyl sulfide) to the atmosphere and calcium carbonate to the sediments, and by altering the optical properties of the surface layer. Documenting the occurrence of blooms in time and space is therefore essential in characterizing the biogeochemical environment of a region. Furthermore, their distribution pattern can be employed to define the environmental conditions favorable for their occurrence. E. huxleyi blooms can be distinguished from most other conditions in visible satellite imagery by their milkly white to turquoise appearance. This project funded under the Environmental Change Institute aims to examine of these blooms off the west coast of Ireland.",
  "areaServed": "West Coordinate: -12 East Coordinate: -9 North Coordinate: 56 South Coordinate: 51",
  "parentOrganization": {
    "@type": "Organization",
    "url": "https://edmo.seadatanet.org/report/774"
  },
  "memberOf": [
    {
      "@type": "ProgramMembership",
      "programName": "European Directory of Marine Environmental Research Projects (EDMERP)"
    },
    {
      "@type": "Organization",
      "url": "https://edmo.seadatanet.org/report/774"
    }
  ]
}
```

Would index to this:
```
{
  "id": "https://edmerp.seadatanet.org/report/7985",
  "type": "ResearchProject",
  "name": "The impact of Coccolithophorid blooms off western Ireland",
  "txt_identifier": [
    "7985"
  ],
  "txt_alternateName": [
    "N/A"
  ],
  "txt_url": [
    "https://edmerp.seadatanet.org/report/7985"
  ],
  "txt_sameAs": [
    "http://www.nuigalway.ie/microbiology/dr__john_w__patching.html"
  ],
  "description": "High concentrations or blooms of the coccolithophorid Emiliania huxleyi can significantly affect a region by acting as a source of organic sulfur (i.e. dimethyl sulfide) to the atmosphere and calcium carbonate to the sediments, and by altering the optical properties of the surface layer. Documenting the occurrence of blooms in time and space is therefore essential in characterizing the biogeochemical environment of a region. Furthermore, their distribution pattern can be employed to define the environmental conditions favorable for their occurrence. E. huxleyi blooms can be distinguished from most other conditions in visible satellite imagery by their milkly white to turquoise appearance. This project funded under the Environmental Change Institute aims to examine of these blooms off the west coast of Ireland.",
  "txt_areaServed": [
    "West Coordinate: -12 East Coordinate: -9 North Coordinate: 56 South Coordinate: 51"
  ],
  "txt_parentOrganization": [
    "https://edmo.seadatanet.org/report/774"
  ],
  "txt_memberOf": [
    "European Directory of Marine Environmental Research Projects (EDMERP)",
    "https://edmo.seadatanet.org/report/774"
  ],
  "keys": [
    "id",
    "type",
    "name",
    "txt_identifier",
    "txt_alternateName",
    "txt_url",
    "txt_sameAs",
    "description",
    "txt_areaServed",
    "txt_parentOrganization",
    "txt_memberOf"
  ],
  "json_source": "{\"@context\": {\"@vocab\": \"https://schema.org/\"}, \"@type\": \"ResearchProject\", \"@id\": \"https://edmerp.seadatanet.org/report/7985\", \"name\": \"The impact of Coccolithophorid blooms off western Ireland\", \"identifier\": \"7985\", \"alternateName\": \"N/A\", \"url\": \"https://edmerp.seadatanet.org/report/7985\", \"sameAs\": \"http://www.nuigalway.ie/microbiology/dr__john_w__patching.html\", \"description\": \"High concentrations or blooms of the coccolithophorid Emiliania huxleyi can significantly affect a region by acting as a source of organic sulfur (i.e. dimethyl sulfide) to the atmosphere and calcium carbonate to the sediments, and by altering the optical properties of the surface layer. Documenting the occurrence of blooms in time and space is therefore essential in characterizing the biogeochemical environment of a region. Furthermore, their distribution pattern can be employed to define the environmental conditions favorable for their occurrence. E. huxleyi blooms can be distinguished from most other conditions in visible satellite imagery by their milkly white to turquoise appearance. This project funded under the Environmental Change Institute aims to examine of these blooms off the west coast of Ireland.\", \"areaServed\": \"West Coordinate: -12 East Coordinate: -9 North Coordinate: 56 South Coordinate: 51\", \"parentOrganization\": {\"@type\": \"Organization\", \"url\": \"https://edmo.seadatanet.org/report/774\"}, \"memberOf\": [{\"@type\": \"ProgramMembership\", \"programName\": \"European Directory of Marine Environmental Research Projects (EDMERP)\"}, {\"@type\": \"Organization\", \"url\": \"https://edmo.seadatanet.org/report/774\"}]}",
  "index_id": "8c9e2611-7976-4267-bad4-1308714aec6e",
  "_version_": "1726272489341845504",
  "indexed_ts": "2022-03-03T10:02:16.204Z"
}
```

Some potential facets that could come from this search:
```
  "facet_counts":{
    "facet_queries":{},
    "facet_fields":{
      "name":[
        "A study of polluting agents in Maharloo salt lake",2,
        "An assessment of haematological and serum biochemical indices in Salmo trutta caspius",2,
        "An investigation on the effects of varying calcium concentrations on the growth and biomass of Chlorella vulgaris",2,
        "Annual cycle of ovarian development and sex hormones of grey mullet (Mugil cephalus) in captivity",2,
        "Biochemical and histological studies of over-ripened oocyte in the Caspian brown trout (Salmo trutta caspius) to determine biomarkers for egg quality",2,
        "Changes of biochemical, sex steroids and carcass composition of stellate sturgeon (Acipenser stellatus) juveniles fed different dietary levels of 17-ß estradiol",2,
        "Determination of some seminal plasma indices, sperm density and sperm motility in the Persian sturgeon Acipenser persicus",2,
        ...
        "Survey of reproductive physiology on Epinephelus coioides in Khozestan province, Persian Gulf",2],
      "txt_contributor":[
        "Iranian Fisheries Science Research Institute",44,
        "Freshwater Biological Association",12,
        "FISON",7,
        "Islamic Azad University, Science and Research Branch, Tehran, Fisheries",4,
        ...
        "Kenyatta University",1,
        "UNEP Nairobi Convention Secretariat",1],
      "txt_keywords":[
        "Biology",52,
        "Aquaculture",49,
        "Fisheries",48,
        "Iran",40,
        "Chemistry",28,
        "Calcium",26,
        "Ecology",24,
        "Limnology",23,
        "Fish",14,
        "Pollution",14,
        "Growth",13,
        "Phosphorus",12,
        "Temperature",11,
        "Nigeria",10,
        "Potassium",9,
        "Biochemical",8,
        "Cyprinus carpio",8,
        "England",8,
        "Physiology",8,
        "Sodium",8],
      "keys":[
        "id",240,
        "name",240,
        "txt_url",240,
        "type",240,
        "description",239,
        "txt_identifier",239,
        "txt_keywords",235,
        "txt_author",233,
        "txt_contributor",92,
        "txt_areaServed",4,
        "txt_memberOf",4,
        "txt_parentOrganization",4,
        "txt_alternateName",3,
        "txt_sameAs",3,
        "id_includedInDataCatalog",1,
        "id_provider",1,
        "txt_citation",1,
        "txt_distribution",1,
        "txt_license",1,
        "txt_temporalCoverage",1],
      "type":[
        "CreativeWork",235,
        "ResearchProject",4,
        "Dataset",1]},
```



## To Modify

### Mapping types to attributes

In some cases, we want to extract a specific value from a schema.org
type. For example, for a `DataDownload`, we would like to extract the
`contentUrl`:

```
{
  "@type": "DataDownload",
  "contentUrl": "http://ipt.env.duke.edu/archive.do?r=zd_2071",
  "encodingFormat": "application/zip"
}
```

This could be done with the following method, taking the data
dictionary, returning an `Att` or list of `Att` objects:

```
def DataDownload(d):
   return Att('txt', d['contentUrl'])
```

This returns a text attribute with the contents of the `contentUrl`
field. This is a common enough use case that there is a specific
function factory, enabling it to be:

```
DataDownload=_extractField('contentUrl')
```

It is also possible to return more than one attribute for a type. The
`Place` and `GeoShape` functions check for data in several locations,
perform region lookups, and return a list of attributes for indexing
in the original object.

Note that any type that is matched for extraction of specific fields
will have its attributes included with the parent object -- not
included as a separate object in the index.

### Mapping fields to attributes

In other cases, we'd like to map a specific field to set of
attributes, either with processing for the value or renaming of the
field. An example of this is the date handling, where the field
`temporalCoverage` is split into the constituient `startDate` and
`endDate` fields, as well as extracting the year from each of those
dates into `startYear` and `endYear` values, only containing the year.

Similarly to mapping types, this requires a function named for the
field in the `conversions.py` file. This function should take the
value of the field and return an `Att` object, or a list of `Att`
objects.

### Adding new Subject Types

The indexer will default to adding any object that has an `@id`
separately to the index store, so long as the `@type` or field name is
not mapped in `conversions.py`. This makes top-level types nearly
hands off to include them in the index. Changes are only required when
special processing is desired.

### Regions

The geographical region classification is stored in
regions-clipped.geojson. This geojson file requires a name field for
each feature -- any spatial data that intersects the feature is
considered to be in that region. See the `/region` directory for the
source data.

The address to region mapping is done with the `UNSD.Methodology.csv`
sourced from https://unstats.un.org/unsd/methodology/m49/overview
. Specifically, we're using the columns named `Country or Area` and
`Region Name`. Any CSV with those columns names in the header will
work as a mapping.


## To Run

There is an entry in the docker-compose.yml file that creates the
environment for this container, but does not leave a running daemon.

```
  indexer:
    build:
      # ensure the path is correct relative to docker-compose.yml
      context: .
      dockerfile: Dockerfile
    networks:
      solr:
    volumes:
      - "./indexer/indexer:/usr/src/app"
      - "./source-data:/opt/data"
    environment:
      - SOLR_URL=http://solr:8983/solr/ckan
      # needs to match the volume mount
      - DATA_DIR=/opt/data
```

Individual commands can be run from this directory with:
```
docker run -ti --rm -v "[path_to_data]:/opt/data" -e "SOLR_URL=http://solr/url" indexer indexer.py [options]
```
or from the docker-compose directory:
```
docker-compose run indexer indexer.py [options]
```

The input data should be volume mounted read/write into the container,
with the following hierarchy:

```
[path-to-data]/
  - prov
  - summoned
  - re-prov # will be written by rewrite_prov.py
  - exceptions # potentially written by indexer.py
  - tests # potentially written by indexer.py
```

Note that as-written, the path to data would be the `source-data` in
the same directory as the `docker-compose.yml` file.

### Environment variables:

- `SOLR_URL`, required. The url to the solr core.
- `DATA_DIR`, defaults to `/opt/data`.  The data volume location within the container.

### Preprocess Prov data

Incoming provenance data is stored in a hierarchy of files named for a
hash of their content. There are potentially multiple provenance
records for each jsonld file in the summoned directory. The
`rewrite_prov.py` script ingests this corpus of provenance records and
emits one provenance record per jsonld file mentioned, corresponding
to the latest timestamp. These are then stored in a hierarchy that
mirrors the summoned data such that an item at
`summoned/path/to/item.json` would have a provenance record at
`re-prov/path/to/item.json`.

```
docker-compose run indexer rewrite_prov.py
```

### Indexing Data

```
usage: indexer.py [-h] [--reindex-query FQ [FQ ...]] [-f FILE [FILE ...]] [--generate-test]

Index summoned data

optional arguments:
  -h, --help            show this help message and exit
  --reindex-query FQ [FQ ...]
                        fq (filterquery) expression to reindex from items already in the index
  -f FILE [FILE ...], --file FILE [FILE ...]
                        index one file, relative to the DATA_DIR base
  --generate-test       generate test cases from indexed data into ./test (caution, may create many artifacts)
```

There are three modes of indexing:

* The default -- index all of the jsonld docs in the
  `DATA_DIR/summoned` directory. This would be run as:

```
docker-compose run indexer indexer.py
```

* Index one or more individual files:

```
docker-compose run indexer indexer.py -f obis/001652ef8a4e4e3f906c11a65ddc47c7b37b0b09.jsonld
```

* Re-index by query -- note that quoting may be an issue here, as urls
  need to be double quoted within the query

```
# reindex a single node
docker-compose run indexer indexer.py --reindex-query '+id:"https://www.marinetraining.eu/node/3857"'
# reindex all items with a specific field:
docker-compose run indexer indexer.py --reindex-query '+txt_temporalCoverage:*'
# reindex all items with a specific field/value combination:
docker-compose run indexer indexer.py --reindex-query '+has_geom:true'
```

If there is an error, triggering items and exceptions will be dumped to the
`DATA_DIR/exceptions` folder.

If the `--generate-test` flag is enabled, the raw and parsed versions
of the jsonld objects will be dumped to the `DATA_DIR/tests`
folder. This can be used to test the generation of attributes from the
jsonld documents.
