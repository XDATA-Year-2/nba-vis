create table TEAMS (
  TEAM_ID int PRIMARY KEY,
  TEAM_ABBREVIATION character(3),
  TEAM_CITY varchar(15),
  TEAM_MASCOT varchar(15)
);

create table PLAYERS (
  PLAYER_ID int PRIMARY KEY,
  PLAYER_NAME varchar(30)
);

create table OFFICIALS (
  OFFICIAL_ID int PRIMARY KEY,
  FIRST_NAME varchar(30),
  LAST_NAME varchar(30)
);

create table SEASONS (
  SEASON_ID int,
  SEASON int PRIMARY KEY
);

create table GAMES (
  GAME_ID int PRIMARY KEY,
  SEASON int,
  GAME_DATE date,
  GAME_TIME varchar(10),
  ATTENDANCE int,
  GAMECODE varchar(15),
  HOME_TEAM_ID int,
  VISITOR_TEAM_ID int,
  LEAD_CHANGES int,
  TIMES_TIED int,
  NOTEBOOK text,
  PREVIEW text,
  RECAP text,
  FOREIGN KEY (SEASON) REFERENCES SEASONS(SEASON),
  FOREIGN KEY (HOME_TEAM_ID) REFERENCES TEAMS(TEAM_ID),
  FOREIGN KEY (VISITOR_TEAM_ID) REFERENCES TEAMS(TEAM_ID)

);

create table PERIODS (
  PERIOD_NUMBER int PRIMARY KEY,
  PERIOD_NAME varchar(4),
  REGULATION BOOLEAN
);

create table GAME_PERIODS (
  GAME_ID int,
  TEAM_ID int,
  PERIOD int,
  PTS int,
  PRIMARY KEY (GAME_ID,TEAM_ID,PERIOD),
  FOREIGN KEY (GAME_ID) REFERENCES GAMES(GAME_ID),
  FOREIGN KEY (TEAM_ID) REFERENCES TEAMS(TEAM_ID),
  FOREIGN KEY (PERIOD) REFERENCES PERIOD(PERIOD_NUMBER)
);

create table TEAM_LINES (
  GAME_ID int,
  TEAM_ID int,
  PTS_PAINT int,
  PTS_2ND_CHANCE int,
  PTS_FB int,
  LARGEST_LEAD int,
  PTS int,
  PRIMARY KEY (GAME_ID,TEAM_ID)
  FOREIGN KEY (GAME_ID) REFERENCES GAMES(GAME_ID),
  FOREIGN KEY (TEAM_ID) REFERENCES TEAMS(TEAM_ID)
);

create table OFFICIAL_LINES (
  GAME_ID int,
  OFFICIAL_ID int,
  JERSEY_NUMBER int,
  PRIMARY KEY (GAME_ID,OFFICIAL_ID),
  FOREIGN KEY (GAME_ID) REFERENCES GAMES(GAME_ID),
  FOREIGN KEY (OFFICIAL_ID) REFERENCES OFFICIALS(OFFICIAL_ID)
);

create table POSITIONS (
  POSITION_ID varchar(3) PRIMARY KEY,
  POSITION_NAME varchar(15)
);

create table PLAYER_LINES (
  GAME_ID int,
  TEAM_ID int,
  PLAYER_ID int,
  JERSEY_NUMBER int,
  START_POSITION varchar(3),
  COMMENT varchar(255),
  MIN int, --note: really storing SECONDS!!!!
  FGM int,
  FGA int,
  FG3M int,
  FG3A int,
  FTM int,
  FTA int,
  OREB int,
  DREB int,
  REB int,
  AST int,
  STL int,
  BLK int,
  TOVR int,
  PF int,
  PTS int,
  PLUS_MINUS int,
  ACTIVE boolean,
  PRIMARY KEY (GAME_ID,PLAYER_ID),
  FOREIGN KEY (GAME_ID) REFERENCES GAMES(GAME_ID),
  FOREIGN KEY (TEAM_ID) REFERENCES TEAMS(TEAM_ID),
  FOREIGN KEY (PLAYER_ID) REFERENCES PLAYERS(PLAYER_ID),
  FOREIGN KEY (START_POSITION) REFERENCES POSITIONS(POSITION_ID)
);

create table COMMENTS (
  COMMENT_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  GAME_ID int,
  COMMENT_NUM int,
  SOURCE text,
  USER_NAME text,
  COMMENT text,
  -- PRIMARY KEY (GAME_ID,COMMENT_ID),
  FOREIGN KEY (GAME_ID) REFERENCES GAMES(GAME_ID)
);

create table PLAY_BY_PLAY (
  GAME_ID int,
  EVENT_NUM int,
  EVENT_MSG_TYPE int,
  EVENT_MSG_ACTION_TYPE int,
  PERIOD int,
  WORLD_TIME time,
  PLAY_CLOCK time,
  DESCRIPTION text,
  DESCRIPTION_TYPE text,
  SCORE text,
  SCORE_MARGIN int,
  PRIMARY KEY (GAME_ID,EVENT_NUM),
  FOREIGN KEY (GAME_ID) REFERENCES GAMES(GAME_ID)
);






