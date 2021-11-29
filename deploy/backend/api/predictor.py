import pandas as pd
import numpy as np
from flask_restful import Resource
from flask import request, jsonify, Blueprint, current_app

predictor_api = Blueprint('predictor_api', __name__)

class Predictor(Resource):

    def predict(self, models, payload):
        predictions = []

        data = pd.json_normalize(payload).fillna(0).copy()
        seasons = data['SEASON_ID'].unique()
        for season in seasons:
            season_data = data[data['SEASON_ID'] == season]

            model = models[season]
            features = model.feature_names_in_

            season_pred = model.predict(season_data[features])
            predictions = np.append(predictions, season_pred)

        predicted_consumption = {
            'predictions': list(predictions)
        }
        return jsonify(predicted_consumption), 200

@predictor_api.route("/predict", methods=['POST'])
def predict():
    model_predictor = Predictor()
    payload = request.get_json(force=True)
    models = current_app.config['models']
    return model_predictor.predict(models, payload)
