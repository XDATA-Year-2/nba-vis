import json

lo = 1
hi = 1228

teams = {}

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

  team0_city = LastMeeting['rowSet'][0][4]
  team0_name = LastMeeting['rowSet'][0][5]
  team0_abbr = LastMeeting['rowSet'][0][6]

  team1_city = LastMeeting['rowSet'][0][9]
  team1_name = LastMeeting['rowSet'][0][10]
  team1_abbr = LastMeeting['rowSet'][0][11]

  teams[team0_abbr] = team0_city+" "+team0_name
  teams[team1_abbr] = team1_city+" "+team1_name

print json.dumps(teams)