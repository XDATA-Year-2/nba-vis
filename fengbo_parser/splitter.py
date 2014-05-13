import csv
import json

teams = json.load(open('teams.json','r'))

teamfiles = {}

for team in teams:
  teamfiles[teams[team]] = t = {}
  t['starters'] = open('../playlines/'+teams[team]+" Starters"+".csv",'w')
  t['reserves'] = open('../playlines/'+teams[team]+" Reserves"+".csv",'w')
  
  t['starters'].write("Team,Position,Name,Opponent,Win/Loss,Date,MP,FG,FGA,FG%,3P,3PA,3P%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS,+/-\n")
  t['reserves'].write("Team,Position,Name,Opponent,Win/Loss,Date,MP,FG,FGA,FG%,3P,3PA,3P%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS,+/-\n")


with open('playlines.csv','rb') as playlines:
  reader = csv.reader(playlines,delimiter=',',quotechar='|')
  for row in reader:
    team = row[0]
    pos = row[1]
    if pos != "":
      teamfiles[team]['starters'].write(','.join(row)+"\n")
    else:
      teamfiles[team]['reserves'].write(','.join(row)+"\n")
    