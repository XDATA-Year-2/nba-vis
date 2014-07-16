#!/bin/sh

if [ -z "$PYTHON" ]; then
    PYTHON=python
fi

if [ -z "$SQLITE" ]; then
    SQLITE=sqlite3
fi

rm ../nba.sqlite

$SQLITE ../nba.sqlite <schema.sql

$PYTHON nba_db_populate.py

$SQLITE ../nba.sqlite <scores_view.sql
$SQLITE ../nba.sqlite <team_outcomes_view.sql

$SQLITE ../nba.sqlite <nbavis_player_stats_view.sql
$SQLITE ../nba.sqlite <nbavis_team_stats_view.sql
$SQLITE ../nba.sqlite <nbavis_team_players_view.sql
$SQLITE ../nba.sqlite <nbavis_teamlines_view.sql

$PYTHON nba_db_comments_analysis.py
