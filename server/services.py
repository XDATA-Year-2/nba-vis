import cherrypy
import json
import sqlite3

class sqlite_cursor:
    def __init__(self, cursor):
        if not hasattr(cherrypy.thread_data, "conn"):
            path = cherrypy.thread_data.modulepath if hasattr(cherrypy.thread_data, "modulepath") else "."
            cherrypy.thread_data.conn = sqlite3.connect(path + "../../nba.sqlite")
            cherrypy.thread_data.conn.row_factory = sqlite3.Row

        self.cursor = cursor
        self.private_cursor = None

    def __enter__(self):
        if self.cursor is not None:
            return self.cursor
        else:
            self.private_cursor = cherrypy.thread_data.conn.cursor()
            return self.private_cursor

    def __exit__(self, type, value, traceback):
        if self.private_cursor:
            self.private_cursor.close()
            self.private_cursor = None


def hello():
  return "Hello World!"

def seasons(cursor=None):
    with sqlite_cursor(cursor) as c:
        seasons = c.execute('select * from SEASONS order by SEASON')
        ret = []
        for s in seasons:
          season = {}
          season['id'] = s['season_id']
          season['season'] = s['season']
          ret.append(season)
        return json.dumps(ret)

def teams(cursor=None):
    with sqlite_cursor(cursor) as c:
        teams = c.execute("select * from TEAMS order by TEAM_ABBREVIATION")
        ret = []
        for t in teams:
          team = {}
          team['id'] = t['team_id']
          team['abbr'] = t['team_abbreviation']
          team['city'] = t['team_city']
          team['mascot'] = t['team_mascot']
          ret.append(team)
        return json.dumps(ret)

def team_scores(teamname,season,cursor=None):
    with sqlite_cursor(cursor) as c:
        scores = c.execute('select * from scores where season='+season+' and (habbr="'+teamname+'" or vabbr="'+teamname+'") order by date;')
        ret = []
        for s in scores:
          score = {}
          home = score['home'] = (s['vabbr']!=teamname)
          if home==True:
            score['score'] = s['hpts']
            score['opp_score'] = s['vpts']
            score['opp'] = s['vabbr']
          else:
            score['score'] = s['vpts']
            score['opp_score'] = s['hpts']
            score['opp'] = s['habbr']
          score['diff'] = score['score'] - score['opp_score']
          score['gameid'] = s['game_id']
          ret.append(score)
        return json.dumps(ret)

def notebook(gameid, cursor=None):
    with sqlite_cursor(cursor) as c:
        notebook = c.execute('select notebook from games where game_id='+gameid).fetchone()
        return notebook[0].replace('\n','\n<br/>')
