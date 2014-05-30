import sqlite3
import json
import os

conn = sqlite3.connect('../nba.sqlite')
conn.text_factory = str
c = conn.cursor()

lo10 = 1
hi10 = 1230
lo11 = 1
hi11 = 990
lo12 = 1
hi12 = 1230

def check_team (team_id,team_abbreviation,team_city,team_mascot):
  c.execute("select * from TEAMS where TEAM_ID=?",(team_id,))
  exists = c.fetchone()
  if exists==None:
    c.execute("insert into TEAMS values (?,?,?,?)",(team_id,team_abbreviation,team_city,team_mascot))
    # conn.commit()

def check_player (player_id,player_name):
  #check if player in db
  #and add if not
  c.execute("select * from PLAYERS where PLAYER_ID=?",(player_id,))
  exists = c.fetchone()
  if exists==None:
    c.execute("insert into PLAYERS values (?,?)",(player_id,player_name))
    # conn.commit()

def check_official (official_id,first_name,last_name):
  c.execute("select * from OFFICIALS where OFFICIAL_ID=?",(official_id,))
  exists = c.fetchone()
  if exists==None:
    c.execute("insert into OFFICIALS values (?,?,?)",(official_id,first_name,last_name))
    # conn.commit()

def check_season (season_id,season):
  c.execute("select * from SEASONS where SEASON_ID=?",(season_id,))
  exists = c.fetchone()
  if exists==None:
    c.execute("insert into SEASONS values (?,?)",(season_id,season))
    # conn.commit()

def populate_seasons ():
  c.execute("insert into SEASONS values (22010,2010)")
  c.execute("insert into SEASONS values (22011,2011)")
  c.execute("insert into SEASONS values (22012,2012)")
  conn.commit()
  

def populate_periods ():
  c.execute("insert into PERIODS values (0,'QTR1',1)")
  c.execute("insert into PERIODS values (1,'QTR2',1)")
  c.execute("insert into PERIODS values (2,'QTR3',1)")
  c.execute("insert into PERIODS values (3,'QTR4',1)")
  c.execute("insert into PERIODS values (4,'OT1',0)")
  c.execute("insert into PERIODS values (5,'OT2',0)")
  c.execute("insert into PERIODS values (6,'OT3',0)")
  c.execute("insert into PERIODS values (7,'OT4',0)")
  c.execute("insert into PERIODS values (8,'OT5',0)")
  c.execute("insert into PERIODS values (9,'OT6',0)")
  c.execute("insert into PERIODS values (10,'OT7',0)")
  c.execute("insert into PERIODS values (11,'OT8',0)")
  c.execute("insert into PERIODS values (12,'OT9',0)")
  c.execute("insert into PERIODS values (13,'OT10',0)")
  conn.commit()

def populate_positions ():
  c.execute("insert into POSITIONS values ('F','Forward')")
  c.execute("insert into POSITIONS values ('G','Guard')")
  c.execute("insert into POSITIONS values ('C','Center')")
  conn.commit()

def extract_game (x,notebook,preview,recap):
  GameSummary = x['resultSets'][0]['rowSet'][0]
  GameInfo = x['resultSets'][8]['rowSet'][0]
  OtherStats = x['resultSets'][6]['rowSet'][0]

  game_id = int(GameSummary[2])
  gamecode = GameSummary[5]
  home_team_id = int(GameSummary[6])
  visitor_team_id = int(GameSummary[7])
  season = int(GameSummary[8])
  attendance = int(GameInfo[1])
  date = GameSummary[0]
  time = GameInfo[2]
  lead_changes = int(OtherStats[9])
  times_tied = int(OtherStats[10])

  c.execute("insert into GAMES values (?,?,?,?,?,?,?,?,?,?,?,?,?)",(game_id,season,date,time,attendance,gamecode,home_team_id,visitor_team_id,lead_changes,times_tied,notebook,preview,recap))
  # conn.commit()
  return game_id


def extract_teams (x):
  TeamStats = x['resultSets'][5]
  for team in TeamStats['rowSet']:
    team_id = int(team[1])
    team_name = team[2]
    team_abbreviation = team[3]
    team_city = team[4]
    check_team(team_id,team_abbreviation,team_city,team_name)

def extract_officials (x):
  Officials = x['resultSets'][7]['rowSet']
  GameSummary = x['resultSets'][0]['rowSet'][0]
  game_id = int(GameSummary[2])
  for o in Officials:
    official_id = int(o[0])
    first_name = o[1]
    last_name = o[2]
    jersey_number = int(o[3])
    check_official(official_id,first_name,last_name)
    c.execute("insert into OFFICIAL_LINES values (?,?,?)",(game_id,official_id,jersey_number))
    # conn.commit()

def extract_team_lines (x):
  OtherStats = x['resultSets'][6]['rowSet']
  GameSummary = x['resultSets'][0]['rowSet'][0]
  game_id = int(GameSummary[2])
  for t in OtherStats:
    team_id = int(t[2])
    pts_paint = int(t[5])
    pts_2nd_chance = int(t[6])
    pts_fb = int(t[7])
    largest_lead = int(t[8])
   
    c.execute("insert into TEAM_LINES values(?,?,?,?,?,?,?)",(game_id,team_id,pts_paint,pts_2nd_chance,pts_fb,largest_lead,None))
    # conn.commit()
  TeamStats = x['resultSets'][5]
  for team in TeamStats['rowSet']:
    team_id = int(team[1])
    pts = int(team[23])
    c.execute("update TEAM_LINES set PTS=? where game_id=? and team_id=?",(pts,game_id,team_id))


def extract_players (x):
  active = True
  jersey_number = ""
  PlayerStats = x['resultSets'][4]
  for row in PlayerStats['rowSet']:
    game_id = int(row[0])
    team_id = int(row[1])
    player_id = int(row[4])
    player_name = row[5]
    check_player(player_id,player_name)

   
    start_position = row[6]
    comment = row[7]
    mp = row[8]
    try:
      fgm = int(row[9])
    except:
      fgm = None
    try:
      fga = int(row[10])
    except:
      fga = None
    try:
      fg3m = int(row[12])
    except:
      fg3m = None
    try:
      fg3a = int(row[13])
    except:
      fg3a = None
    try:
      ftm = int(row[15])
    except:
      ftm = None
    try:
      fta = int(row[16])
    except:
      fta = None
    try:
      oreb = int(row[18])
    except:
      oreb = None
    try:
      dreb = int(row[19])
    except:
      dreb = None
    try:
      reb = int(row[20])
    except:
      reb = None
    try:
      ast = int(row[21])
    except:
      ast = None
    try:
      stl = int(row[22])
    except:
      stl = None
    try:
      blk = int(row[23])
    except:
      blk = None
    try:
      tovr = int(row[24])
    except:
      tovr = None
    try:
      pf = int(row[25])
    except:
      pf = None
    try:
      pts = int(row[26])
    except:
      pts = 0
    try:
      plus_minus = int(row[27])
    except:
      plus_minus  = None
    line = (game_id,team_id,player_id,jersey_number,start_position,comment,mp,fgm,fga,fg3m,fg3a,ftm,fta,oreb,dreb,reb,ast,stl,blk,tovr,pf,pts,plus_minus,active)
    c.execute("insert into PLAYER_LINES values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",line)
    # conn.commit()

def extract_inactive_players (x):
  GameSummary = x['resultSets'][0]['rowSet'][0]
  game_id = int(GameSummary[2])

  InactivePlayers = x['resultSets'][9]['rowSet']
  for p in InactivePlayers:
    active = False
    player_id = int(p[0])
    player_name = p[1]+" "+p[2]
    check_player(player_id,player_name)

    team_id = int(p[4])
    try:
      jersey_number = int(p[3])
    except:
      jersey_number = None
    c.execute("insert into PLAYER_LINES (GAME_ID,TEAM_ID,PLAYER_ID,JERSEY_NUMBER,ACTIVE) values (?,?,?,?,?)",(game_id,team_id,player_id,jersey_number,active))
    # conn.commit()


def extract_game_periods (x):
  LineScore = x['resultSets'][1]['rowSet']
  for t in LineScore:
    game_id = int(t[2])
    team_id = int(t[3])
    for period in range(0,14):
      points = int(t[(period+7)])
      c.execute("insert into GAME_PERIODS values (?,?,?,?)",(game_id,team_id,period,points))
      # conn.commit()
  

def extract_season (x):
  GameSummary = x['resultSets'][0]['rowSet'][0]
  season = int(GameSummary[8])
  OtherStats = x['resultSets'][6]['rowSet']
  season_id = OtherStats[0][1]
  check_season(season_id,season)

def extract_comments (com,game_id,source):
  try:
    com = open(com)
    # print "has comments"
  except:
    return
  i = 0
  for line in com:
    line = line.split("::")
    user = line[0].strip()
    comment = line[1].strip()
    c.execute("insert into COMMENTS(GAME_ID,COMMENT_NUM,SOURCE,USER_NAME,COMMENT) values (?,?,?,?,?)",(game_id,i,source,user,comment))
    i+=1

def extract_playbyplay (pbp,game_id):
  try:
    pbp = open(pbp)
  except:
    return
  pbp = json.load(pbp)
  plays = pbp['resultSets'][0]['rowSet']
  for p in plays:
    event_num = p[1]
    event_msg_type = p[2]
    event_msg_action_type = p[3]
    period = p[4]
    world_time = p[5]
    play_clock_time = p[6]
    score = p[10]
    try:
      score_margin = int(p[11])
    except:
      score_margin = None
    description = ""
    description_type = ""
    if p[7]!=None:
      description = p[7]
      description_type = "HOME"
    elif p[8]!=None:
      description = p[8]
      description_type = "NEUTRAL"
    elif p[9]!=None:
      description = p[9]
      description_type = "VISTIOR"
    else:
      print "DANGER DANGER"
      print p
      exit(1)
    c.execute("insert into PLAY_BY_PLAY values(?,?,?,?,?,?,?,?,?,?,?)",(game_id,event_num,event_msg_type,event_msg_action_type,period,world_time,play_clock_time,description,description_type,score,score_margin))




def extract_all (game_files_dir,notebook_files_dir,preview_files_dir,recap_files_dir,comment_files_dir,pbp_dir):
  for fraw in os.listdir(game_files_dir):
      # if os.path.isfile(f):
      n = fraw.replace('gamestats.json','notebook.txt')
      n = notebook_files_dir+n
      r = fraw.replace('gamestats.json','recap.txt')
      r = recap_files_dir+r
      p = fraw.replace('gamestats.json','preview.txt')
      p = preview_files_dir+p
      

      f = game_files_dir+fraw
      fopen = open(f)
      notebook = open(n).read()
      recap = open(r).read()
      preview = open(p).read()
      # print notebook
      x = json.load(fopen)

      extract_season(x)
      extract_teams(x)
      game_id = extract_game(x,notebook,preview,recap)
      extract_officials(x)
      extract_team_lines(x)
      extract_game_periods(x)
      extract_players(x)
      extract_inactive_players(x)


      espn = fraw.replace('gamestats.json','espn_comments.txt')
      espn = comment_files_dir+espn
      extract_comments(espn,game_id,"espn")

      #espn = fraw.replace('gamestats.json','espn_comments.txt')
      #espn = comment_files_dir+espn
      #extract_comments(espn,game_id,"espn")

      yahoo = fraw.replace('gamestats.json','yahoo_comments.txt')
      yahoo = comment_files_dir+yahoo
      extract_comments(yahoo,game_id,"yahoo")


      pbp = fraw.replace('gamestats.json','playbyplay.json')
      pbp = pbp_dir+pbp
      extract_playbyplay(pbp,game_id)

      conn.commit()
      print f


def init_db (game_files_dir,notebook_files_dir,preview_files_dir,recap_files_dir,comment_files_dir,pbp_dir):
  populate_positions()
  populate_periods()
  extract_all(game_files_dir,notebook_files_dir,preview_files_dir,recap_files_dir,comment_files_dir,pbp_dir)
  conn.commit()

def check ():
  res = c.execute("select * from PLAYER_LINES limit 10")
  for r in res:
    print r


init_db("../nba/gamestats/","../nba/notebook/","../nba/preview/","../nba/recaps/","../nba/comments/","../nba/playbyplay/")
# check()
