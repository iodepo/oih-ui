FROM python:3.9
MAINTAINER Derilinx

WORKDIR /usr/src

ENV DATA_DIR=/opt/data
ENV PATH=/usr/src:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

COPY requirements.txt .
RUN pip install -r requirements.txt

# don't want to copy test/, this would be better as a subdirectory with the
# dockerfile outside of it, but here we are.
COPY *.py /usr/src/
COPY *.csv /usr/src/
COPY *.geojson /usr/src/

CMD ["echo", "run as `docker run -v [data]:/opt/data indexer.py [options]`"]
