# Global Hub Search Portal

This repo contains the code for the Ocean Info Hub Global Search Portal.

* `/api` contains the code for the api server. This produces a container which will need to have access to the SOLR instance.
* `/indexer` contains all of the code to ingest the OIH graph into the SOLR Instance
* `/solr` contains the configuration required for the solr instance, including the schema. 
* `/frontend` contains the code for the static javascript app. This will produce a container in dev mode running a live server, and a static html/javascript site in production mode. 
