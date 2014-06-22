create view NBAVIS_TEAMLINES as

select
  season,
  team_outcomes.team_city as team_city,
  team_outcomes.team_mascot as team_mascot,
  opponent_city,
  opponent_mascot,
  won,
  game_date,
  -- strftime('%M:%S',sum(min),'unixepoch') as min,
  -- strftime('%H:%M:%S',sum(min),'unixepoch') as MIN,
  sum(min) as min, -- Up to parser to convert to MIN:SEC
  sum(fgm) as fgm,
  sum(fga) as fga,
  round(sum(fgm)*1.0/sum(fga),3) as FGP,
  sum(fg3m) as fg3m,
  sum(fg3a) as fg3a,
  round(sum(fg3m)*1.0/sum(fg3a),3) as FG3P,
  sum(ftm) as ftm,
  sum(fta) as fta,
  round(sum(ftm)*1.0/sum(fta),3) as FTP,
  sum(oreb) as oreb,
  sum(dreb) as dreb,
  sum(reb) as reb,
  sum(ast) as ast,
  sum(stl) as stl,
  sum(blk) as blk,
  sum(tovr) as tovr,
  sum(pf) as pf,
  team_outcomes.pts as pts,
  team_outcomes.pts-team_outcomes.opponent_pts as plus_minus
from
  team_outcomes,player_lines
where
  player_lines.game_id = team_outcomes.game_id
  and player_lines.team_id = team_outcomes.team_id
  -- and season=2012

group by team_outcomes.game_id,team_outcomes.team_id

-- limit 5

;
