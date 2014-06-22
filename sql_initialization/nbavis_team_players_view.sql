create view NBAVIS_TEAM_PLAYERS as
select distinct
  season,
  team_abbreviation,
  -- team_city,
  -- team_mascot,
  player_name
from
  nbavis_player_stats
-- where
--   season=2012
--   and team_abbreviation="MIA"
;

