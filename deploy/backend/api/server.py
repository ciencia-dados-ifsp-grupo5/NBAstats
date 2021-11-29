import joblib
import pickle
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from predictor import predictor_api
from players import players_api

app = Flask(__name__)
CORS(app)
app.register_blueprint(predictor_api, url_prefix='/model')
app.register_blueprint(players_api, url_prefix='/player')
api = Api(app)

def load_models():
    models = joblib.load('../models/models.joblib')
    return models

def load_players():
    stats_file = open('../players/players_stats.pkl', 'rb')
    players = pickle.load(stats_file)
    stats_file.close()
    return players

if __name__ == '__main__':
    app.config['models'] = load_models()
    app.config['players'] = load_players()
    app.run(host='0.0.0.0', port=5000)
