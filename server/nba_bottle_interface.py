from bottle import hook, response, route, run, static_file
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
  notebook = c.execute('select notebook from games where game_id='+gameid).fetchone()
  return notebook[0].replace('\n','\n<br/>')


@route('/www/')
def static():
  return static_file('index.html', root='www/')

@route('/www/<path:path>')
def static(path):
  return static_file(path, root='www/')



# NBAVis Routes

@route('/nbavis/data/teamplayers/<season>/<team>')
def team_players(season,team):
  team_q = c.execute('select team_city,team_mascot from teams where team_abbreviation=?',[team])
  team_q = team_q.fetchone()
  players = c.execute('select player_name from nbavis_team_players where season=? and team_abbreviation=?',(season,team))
  ret = {}
  ret['team'] = team_q['team_city']+" "+team_q['team_mascot']
  ret['players'] = []
  for p in players:
    player = {}
    player['name'] = p['player_name']
    player['positions'] = [""]
    ret['players'].append(player)
  return json.dumps(ret)


@route('/nbavis/data/playerstats/<season>/<team>/<s_or_r>')
def player_stats(season,team,s_or_r):
  s_or_r = s_or_r[0].lower()
  ret = "Team,Position,Name,Opponent,Win/Loss,Date,MP,FG,FGA,FG%,3P,3PA,3P%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS,+/-\n"
  if(s_or_r=='r'): # reserves
    lines = c.execute('select * from nbavis_player_stats where season=? and team_abbreviation=? and start_position==""',(season,team))
  else: # starters
    lines = c.execute('select * from nbavis_player_stats where season=? and team_abbreviation=? and start_position!=""',(season,team))

  for l in lines:
    r = []
    r.append(l['team']+" "+l['mascot'])
    r.append(l['start_position'])
    r.append(l['player_name'])
    r.append(l['opponent_city']+" "+l['opponent_mascot'])
    if l['won']==1:
      r.append('W')
    else:
      r.append('L')
    r.append(time.strftime("%m/%d/%Y",time.strptime(l['game_date'],"%Y-%m-%dT%H:%M:%S")))
    r.append(l['min'])
    r.append(l['fgm'])
    r.append(l['fga'])
    r.append(l['fgp'])
    r.append(l['fg3m'])
    r.append(l['fg3a'])
    r.append(l['fg3p'])
    r.append(l['ftm'])
    r.append(l['fta'])
    r.append(l['ftp'])
    r.append(l['oreb'])
    r.append(l['dreb'])
    r.append(l['reb'])
    r.append(l['ast'])
    r.append(l['stl'])
    r.append(l['blk'])
    r.append(l['tovr'])
    r.append(l['pf'])
    r.append(l['pts'])
    r.append(l['plus_minus'])
    r = [str(x) for x in r]
    r = ",".join(r)
    ret+=r+"\n"
  return ret


@route('/nbavis/data/teamstats/<season>/<team>')
def team_stats(season,team):
  ret = "Date0,Date,Opponent,WinLoss,TmScore,OppScore,W,L\n"
  lines = c.execute('select * from nbavis_team_stats where season=? and team_abbreviation=?',(season,team))
  for l in lines:
    r = []
    r.append(time.strftime("%a %b %d %Y",time.strptime(l['game_date'],"%Y-%m-%dT%H:%M:%S")))
    r.append(time.strftime("%m/%d/%Y",time.strptime(l['game_date'],"%Y-%m-%dT%H:%M:%S")))
    r.append(l['opponent_city']+" "+l['opponent_mascot'])
    if l['won']==1:
      r.append('W')
    else:
      r.append('L')
    r.append(l['pts'])
    r.append(l['opponent_pts'])
    if l['won']==1:
      r.append(1)
      r.append(0)
    else:
      r.append(0)
      r.append(1)
    r = [str(x) for x in r]
    r = ",".join(r)
    ret+=r+"\n"
  return ret




@route('/nbavis/')
def static():
  return static_file('index.html', root='nbavis/')

@route('/nbavis/<path:path>')
def static(path):
  return static_file(path, root='nbavis/')




run(host='localhost', port='8000', debug=True)






