.PHONY: init help init core down up clean-config clean logs build fast

include .env
export $(shell sed 's/=.*//' .env)




initdb-solr:
	docker-compose run -u root solr chown solr:solr /var/solr/data/ckan/data
