create view TEAM_OUTCOMES as

select * from (select
  games.season,
  games.GAME_ID as GAME_ID,
  teams.TEAM_ID as TEAM_ID,
  GAME_DATE,
  TEAM_ABBREVIATION,
  TEAM_CITY,
  TEAM_MASCOT,
  PTS,
  OPPONENT_ID,
  OPPONENT_ABBREVIATION,
  OPPONENT_CITY,
  OPPONENT_MASCOT,
  OPPONENT_PTS,
  hpts > vpts as WON
from
  teams,games,team_lines,scores,
  (select
    games.game_id,
    teams.team_id as OPPONENT_ID,
    team_abbreviation as OPPONENT_ABBREVIATION,
    team_city as OPPONENT_CITY,
    team_mascot as OPPONENT_MASCOT,
    pts as OPPONENT_PTS
  from
    teams,games,team_lines
  where
    OPPONENT_ID=visitor_team_id
    and OPPONENT_ID=team_lines.team_id
    and games.game_id=team_lines.game_id) as opp
where
  teams.team_id=home_team_id
  and home_team_id=team_lines.team_id
  and team_lines.game_id = games.game_id
  and scores.game_id = games.game_id
  and opp.game_id=games.game_id)
UNION
select * from (select
  games.season,
  games.GAME_ID as GAME_ID,
  teams.TEAM_ID as TEAM_ID,
  GAME_DATE,
  TEAM_ABBREVIATION,
  TEAM_CITY,
  TEAM_MASCOT,
  PTS,
  OPPONENT_ID,
  OPPONENT_ABBREVIATION,
  OPPONENT_CITY,
  OPPONENT_MASCOT,
  OPPONENT_PTS,
  vpts > hpts as WON
from
  teams,games,team_lines,scores,
  (select
    games.game_id,
    teams.team_id as OPPONENT_ID,
    team_abbreviation as OPPONENT_ABBREVIATION,
    team_city as OPPONENT_CITY,
    team_mascot as OPPONENT_MASCOT,
    pts as OPPONENT_PTS
  from
    teams,games,team_lines
  where
    OPPONENT_ID=home_team_id
    and OPPONENT_ID=team_lines.team_id
    and games.game_id=team_lines.game_id) as opp
where
  teams.team_id=visitor_team_id
  and visitor_team_id=team_lines.team_id
  and team_lines.game_id = games.game_id
  and scores.game_id = games.game_id
  and opp.game_id=games.game_id)

-- limit 10
;



