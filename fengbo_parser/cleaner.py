import json

teams = json.load(open('teams.json','r'))

raw = open('output.csv','r')


for line in raw:
  line = line.strip()
  line = line[:-1]
  for team in teams:
    line = line.replace(team,teams[team])
    line = line.replace(", ",",")
  print line