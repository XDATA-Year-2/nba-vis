nba-vis
=======

Vises
-------
- NBAVis http://localhost:8000/nbavis/
- Simple Query Demonstration http://localhost:8000/www/


Requirements
------
- Python 2.7
- SQLite3
- Ability to run sh scripts (e.g. cygwin)

To Build the SQL Database
------

````
cd sql_initialization/
sh nba_init.sh
````

To Run the Bottle Server
------

````
cd server/
python nba_bottle_interface.py
````

