import os
import csv
import sqlite3
import sys

db_filename = '../nba.sqlite'
schema_filename = 'schema_comments_analysis.sql'
data_filename = '../nba/comments_analysis/players_comments.csv'

with sqlite3.connect(db_filename) as conn:
  #print 'Creating schema'
  with open(schema_filename, 'rt') as f:
    schema = f.read()
    conn.executescript(schema)
  with open(data_filename, 'rt') as csv_file:
    SQL = """insert into PLAYERS_COMMENTS (PLAYER_ID, COMMENT_ID)
	  values (:PLAYER_ID, :COMMENT_ID)
	  """
    csv_reader = csv.DictReader(csv_file)
    cursor = conn.cursor()
    cursor.executemany(SQL, csv_reader)
    
