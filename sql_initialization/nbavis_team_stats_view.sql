create view NBAVIS_TEAM_STATS as
select
  season,
  team_abbreviation,
  game_date,
  opponent_city,
  opponent_mascot,
  won,
  pts,
  opponent_pts
from
  team_outcomes

-- where
--   season=2012
  -- and team_abbreviation = "ATL"

-- limit 10
;
