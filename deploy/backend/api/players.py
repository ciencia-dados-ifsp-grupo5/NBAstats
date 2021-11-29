from flask import Blueprint, jsonify, current_app

players_api = Blueprint('players_api', __name__)

class Players():

    def list(self, players):
        players_list = []
        for player in players:
            p = {
                'id': player['id'],
                'name': player['info'].common_player_info.get_data_frame()['DISPLAY_FIRST_LAST'][0],
                'seasons': player['career'].season_totals_regular_season.get_data_frame()['SEASON_ID'].values.tolist()
            }
            players_list.append(p)
        return jsonify(players_list), 200

@players_api.route("/list", methods=['GET'])
def list():
    players_handler = Players()
    players = current_app.config['players']
    return players_handler.list(players)
