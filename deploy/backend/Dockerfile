FROM python:3.9.6

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY custom_transformers.py dbconnector.py server.py .env /usr/src/app/
COPY api/ /usr/src/app/api/

EXPOSE 5000
CMD ["python", "server.py"]