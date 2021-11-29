FROM python:3.9.6

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY api/ /usr/src/app/api/
COPY models/ /usr/src/app/models/

WORKDIR /usr/src/app/api

EXPOSE 5000
CMD ["python", "server.py"]