create view NBAVIS_PLAYER_STATS as

select
  games.season as SEASON,
  games.game_id as GAME_ID,
  team_abbreviation,
  team_city as TEAM,
  team_mascot as MASCOT,
  start_position,
  player_name,
  opponent_city,
  opponent_mascot,
  won,
  games.game_date as GAME_DATE,
  strftime('%M:%S',min,'unixepoch') as MIN,
  fgm,
  fga,
  round(fgm*1.0/fga,3) as FGP,
  fg3m,
  fg3a,
  round(fg3m*1.0/fg3a,3) as FG3P,
  ftm,
  fta,
  round(ftm*1.0/fta,3) as FTP,
  oreb,
  dreb,
  reb,
  ast,
  stl,
  blk,
  tovr,
  pf,
  player_lines.pts as PTS,
  plus_minus
from players,player_lines,games,team_outcomes
where
  players.player_id=player_lines.player_id
  and games.game_id=player_lines.game_id
  -- and teams.team_id = player_lines.team_id
  and team_outcomes.team_id = player_lines.team_id
  and team_outcomes.game_id = player_lines.game_id
  and active=1
  and MIN!=""


  -- and games.season=2012


--   and start_position!=""
--   and team_abbreviation="ATL"
-- limit 12
;
