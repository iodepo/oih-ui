# Indexer

## To Run


## To Modify

### Mapping types to values

In some cases, we want to extract a specific value from a schema.org type. For example, for a `DataDownload`, we would like to extract the `contentUrl`:

```
{
  "@type": "DataDownload",
  "contentUrl": "http://ipt.env.duke.edu/archive.do?r=zd_2071",
  "encodingFormat": "application/zip"
}
```

To perform this transform, there is a method in `conversions.py` matching the `@type`, in this case, `DataDownload`. There is a specific function factory (`_extractField`) to extract a single field from a type.

It is also possible to return more than one field for a type. The `Place` and `GeoShape` functions check for data in several locations, perform region lookups, and return a list of attributes for indexing in the original object.

### Mapping fields to values

### Adding new Subject Types

### Regions

The geographical region classification is stored in regions-clipped.geojson. This geojson file requires a name field for each feature -- any spatial data that intersects the feature is considered to be in that region. See the `/region` directory for the source data.

The address to region mapping is done with the `UNSD.Methodology.csv` sourced from https://unstats.un.org/unsd/methodology/m49/overview . Specifically, we're using the columns named `Country or Area` and `Region Name`. Any CSV with those columns names in the header will work as a mapping.
