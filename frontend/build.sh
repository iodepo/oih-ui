#!/bin/bash -eux

mkdir -p build
mkdir -p /tmp/nodemodule_cache
docker build -t web .
docker run --rm -e REACT_APP_DATA_SERVICE_URL -v `pwd`/build:/app/build -v /tmp/nodemodule_cache:/app/node_modules/.cache -u `id -u`:`id -g` web:latest npm run build
rm -r /tmp/nodemodule_cache
