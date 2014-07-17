from bottle import hook, response, route, run, static_file
import services
import sqlite3
import json
import time


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


@route('/www/hello')
def hello():
    return services.hello()

@route('/www/seasons')
def seasons():
    return services.seasons(cursor=c)

@route('/www/teams')
def teams():
    return services.teams(cursor=c)

@route('/www/team_scores/<teamname>/<season>')
def team_scores(teamname,season):
   return services.team_scores(teamname,season,cursor=c)

@route('/www/notebook/<gameid>')
def notebook(gameid):
    return services.notebook(gameid,cursor=c)


@route('/www/')
def static():
  return static_file('index.html', root='www/')

@route('/www/<path:path>')
def static(path):
  return static_file(path, root='www/')



# NBAVis Routes

@route('/nbavis/data/teamplayers/<season>/<team>')
def team_players(season,team):
    return services.team_players(season,team,cursor=c)

@route('/nbavis/data/playerstats/<season>/<team>/<s_or_r>')
def player_stats(season,team,s_or_r):
    return services.player_stats(season,team,s_or_r,cursor=c)

@route('/nbavis/data/teamstats/<season>/<team>')
def team_stats(season,team):
    return services.team_stats(season,team,cursor=c)

@route('/nbavis/data/teamlines/<season>')
def teamlines(season):
    return services.teamlines(season,cursor=c)

@route('/nbavis/')
def static():
  return static_file('index.html', root='nbavis/')

@route('/nbavis/<path:path>')
def static(path):
  return static_file(path, root='nbavis/')

run(host='localhost', port='8000', debug=True)
