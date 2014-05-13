create view SCORES as
  select
    season,
    a.id as game_id,
    date,
    -- visitor_team_id as vid,
    vabbr,
    vpts,
    -- home_team_id as hid,
    habbr,
    hpts
  from 
    (select
        pts as hpts,
        g.game_id as id,
        game_date as date,
        season
        -- home_team_id,
        -- visitor_team_id
      from
        TEAM_LINES as tl,
        GAMES as g
      where
        tl.team_id=g.home_team_id
        and tl.game_id=g.game_id
    ) as a,
    (select
        pts as vpts,
        g.game_id as id
      from
        TEAM_LINES as tl,
        GAMES as g
      where
        tl.team_id=g.visitor_team_id
        and tl.game_id=g.game_id
    ) as b,
    (select
        team_abbreviation as habbr,
        g.game_id as id
      from
        GAMES as g,
        TEAMS as t
      where
        t.team_id=g.home_team_id
    ) as c,
    (select
        team_abbreviation as vabbr,
        g.game_id as id
      from
        GAMES as g,
        TEAMS as t
      where
        t.team_id=g.visitor_team_id
    ) as d
  where a.id=b.id and b.id=c.id and c.id=d.id
;