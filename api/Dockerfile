FROM python:3.9
MAINTAINER Derilinx

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY api /usr/src/app/api

CMD ["uvicorn", "api.main:app", "--reload", "--host=0.0.0.0", "--port=8000"]

EXPOSE 8000
