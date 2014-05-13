import json

lo = 1
hi = 1230

for gid in xrange(lo,hi+1):
  try:
    f = open("../nba/gamestats/00212"+"{0:05d}".format(gid)+"_gamestats.json","r")
  except:
    continue

  x = json.load(f)

  GameSummary = x['resultSets'][0]
  LineScore = x['resultSets'][1]
  SeasonSeries = x['resultSets'][2]
  LastMeeting = x['resultSets'][3]
  PlayerStats = x['resultSets'][4]
  TeamStats = x['resultSets'][5]
  OtherStats = x['resultSets'][6]
  Officials = x['resultSets'][7]
  GameInfo = x['resultSets'][8]
  InactivePlayers = x['resultSets'][9]
  AvailableVideo = x['resultSets'][10]

  date = GameSummary['rowSet'][0][0]
  date = date[:10].split('-')
  date = date[1]+"/"+date[2]+'/'+date[0]

  team0_score = LineScore['rowSet'][0][21]
  team1_score = LineScore['rowSet'][1][21]

  winner = ""
  loser = ""

  if team0_score>team1_score:
    winner = LineScore['rowSet'][0][4]
    loser = LineScore['rowSet'][1][4]
  else:
    winner = LineScore['rowSet'][1][4]
    loser = LineScore['rowSet'][0][4]

  for row in PlayerStats['rowSet']:
    team_abbr = row[2]
    player_name = row[5]
    start_position = row[6]
    mp = row[8]
    fgm = row[9]
    fga = row[10]
    fgp = row[11]
    fg3m = row[12]
    fg3a = row[13]
    fg3p = row[14]
    ftm = row[15]
    fta = row[16]
    ftp = row[17]
    oreb = row[18]
    dreb = row[19]
    reb = row[20]
    ast = row[21]
    stl = row[22]
    blk = row[23]
    to = row[24]
    pf = row[25]
    pts = row[26]
    try:
      plus_minus = int(row[27])
    except:
      plus_minus  = 0


    opp = ""
    wl = ""
    if team_abbr == winner:
      opp = loser
      wl = "W"
    else:
      opp = winner
      wl = "L"

    line = (team_abbr, start_position, player_name, opp, wl, date, mp, fgm, fga, fgp, fg3m, fg3a, fg3p, ftm, fta, ftp, oreb, dreb, reb, ast, stl, blk, to, pf, pts, plus_minus)
    if None not in line:
      for i in line:
        print str(i)+",",
      print

