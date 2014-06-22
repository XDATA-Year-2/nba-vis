rm ../nba.sqlite;

sqlite3 ../nba.sqlite <schema.sql;

python nba_db_populate.py;


sqlite3 ../nba.sqlite <scores_view.sql;
sqlite3 ../nba.sqlite <team_outcomes_view.sql;


sqlite3 ../nba.sqlite <nbavis_player_stats_view.sql;
sqlite3 ../nba.sqlite <nbavis_team_stats_view.sql;
sqlite3 ../nba.sqlite <nbavis_team_players_view.sql;



python nba_db_comments_analysis.py;