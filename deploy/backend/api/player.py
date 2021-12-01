from flask import Blueprint, jsonify, current_app

player_api = Blueprint('player_api', __name__)

class Player():

    def season_list(self, db):
        player = db.query('''
            SELECT DISTINCT SEASON_ID
            FROM player
            ORDER BY SEASON_ID DESC
        ''')
        season = [ s['SEASON_ID'] for s in player ]
        return jsonify(season), 200

    def player_list(self, db):
        player = db.query('''                     
            SELECT PLAYER_ID, PLAYER_NAME, group_concat(SEASON_ID) AS SEASONS
            FROM player
            GROUP BY PLAYER_ID, PLAYER_NAME;
        ''')
        for p in player:
            p['SEASONS'] = sorted(p['SEASONS'].split(','), reverse=True)
        return jsonify(player), 200
      
    def player_data(self, db, player_id, season_id):
        player = db.query(f'''
            SELECT *
            FROM player
            WHERE PLAYER_ID = {player_id} AND SEASON_ID = '{season_id}'
        ''')
        return jsonify(player[0] if len(player) > 0 else {}), 200

@player_api.route("/season/list", methods=['GET'])
def season_list():
    player_handler = Player()
    db = current_app.config['connector']
    return player_handler.season_list(db)

@player_api.route("/list", methods=['GET'])
def player_list():
    player_handler = Player()
    db = current_app.config['connector']
    return player_handler.player_list(db)

@player_api.route("/data/<player_id>/<season_id>")
def player_data(player_id, season_id):
    player_handler = Player()
    db = current_app.config['connector']
    return player_handler.player_data(db, player_id, season_id)