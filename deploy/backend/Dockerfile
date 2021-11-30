FROM python:3.9.6

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY server.py dbconnector.py .env /usr/src/app/
COPY api/ /usr/src/app/api/
COPY models/ /usr/src/app/models/

EXPOSE 5000
CMD ["python", "server.py"]