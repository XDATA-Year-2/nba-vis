rm ../nba.sqlite;
sqlite3 ../nba.sqlite <schema.sql;
python nba_db_populate.py;
sqlite3 ../nba.sqlite <views.sql;
python nba_db_comments_analysis.py;