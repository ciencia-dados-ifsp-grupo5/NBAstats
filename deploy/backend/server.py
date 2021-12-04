import os
import joblib
from dotenv import load_dotenv

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from dbconnector import DbConnector

from api.predictor import predictor_api
from api.player import player_api

from custom_transformers import FeatureSelector

app = Flask(__name__)
CORS(app)
app.register_blueprint(predictor_api, url_prefix='/model')
app.register_blueprint(player_api, url_prefix='/player')
api = Api(app)

load_dotenv()
DB_CONFIG = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASS'),
    'host': os.getenv('DB_HOST'),
    'database': 'player'
}

def load_models():
    models = joblib.load('./models/models.joblib')
    return models

def load_database():
    connector = DbConnector(DB_CONFIG)
    return connector

if __name__ == '__main__':
    app.config['models'] = load_models()
    app.config['connector'] = load_database()
    app.run(host='0.0.0.0', port=5000)
