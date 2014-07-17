import cherrypy
import json
import sqlite3
import time

class sqlite_cursor:
    def __init__(self, cursor):
        if cursor is None and not hasattr(cherrypy.thread_data, "conn"):
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

def team_players(season,team,cursor=None):
    with sqlite_cursor(cursor) as c:
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

def player_stats(season,team,s_or_r,cursor=None):
    with sqlite_cursor(cursor) as c:
        s_or_r = s_or_r[0].lower()
        ret = "Team,Position,Name,Opponent,Win/Loss,Date,MP,FG,FGA,FG%,3P,3PA,3P%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS,+/-\n"
        if team!="ALL":
          if(s_or_r=='r'): # reserves
            lines = c.execute('select * from nbavis_player_stats where season=? and team_abbreviation=? and start_position==""',(season,team))
          else: # starters
            lines = c.execute('select * from nbavis_player_stats where season=? and team_abbreviation=? and start_position!=""',(season,team))
        else:
          if(s_or_r=='r'): # reserves
            lines = c.execute('select * from nbavis_player_stats where season=? and start_position==""',[season])
          else: # starters
            lines = c.execute('select * from nbavis_player_stats where season=? and start_position!=""',[season])

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

def team_stats(season,team,cursor=None):
    with sqlite_cursor(cursor) as c:
        ret = "Date0,Date,Opponent,WinLoss,TmScore,OppScore,W,L\n"
        if team!="ALL":
          lines = c.execute('select * from nbavis_team_stats where season=? and team_abbreviation=?',(season,team))
        else:
          lines = c.execute('select * from nbavis_team_stats where season=?',[season])

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

def teamlines(season,cursor=None):
    with sqlite_cursor(cursor) as c:
        ret = "Team,Opponent,Win/Loss,Date,MP,FG,FGA,FG%,3P,3PA,3P%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS,+/-\n"
        lines = c.execute('select * from nbavis_teamlines where season=?',[season])
        for l in lines:
          r = []
          r.append(l['team_city']+" "+l['team_mascot'])
          r.append(l['opponent_city']+" "+l['opponent_mascot'])
          if l['won']==1:
            r.append('W')
          else:
            r.append('L')
          r.append(time.strftime("%m/%d/%Y",time.strptime(l['game_date'],"%Y-%m-%dT%H:%M:%S")))
          r.append(str(l['min']//60)+":"+str(l['min']%60).zfill(2))
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
