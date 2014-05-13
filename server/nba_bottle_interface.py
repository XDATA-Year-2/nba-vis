from bottle import hook, response, route, run, static_file
import sqlite3
import json


conn = sqlite3.connect('../nba.sqlite')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# @hook('after_request')
# def enable_cors():
#     """
#     You need to add some headers to each request.
#     Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
#     """
#     response.headers['Access-Control-Allow-Origin'] = '*'


@route('/hello')
def hello():
  return "Hello World!"

@route('/seasons')
def seasons():
  seasons = c.execute('select * from SEASONS order by SEASON')
  ret = []
  for s in seasons:
    season = {}
    season['id'] = s['season_id']
    season['season'] = s['season']
    ret.append(season)
  return json.dumps(ret)

@route('/teams')
def teams():
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

@route('/team_scores/<teamname>/<season>')
def team_scores(teamname,season):
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

@route('/notebook/<gameid>')
def notebook(gameid):
  notebook = c.execute('select notebook_entry from games where game_id='+gameid).fetchone()
  return notebook[0].replace('\n','\n<br/>')


@route('/www/')
def static():
  return static_file('index.html', root='www/')

@route('/www/<path:path>')
def static(path):
  return static_file(path, root='www/')

run(host='localhost', port='8000', debug=True)






