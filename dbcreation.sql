-- This created the db

-- Drops the favorite_db if it exists currently --
DROP DATABASE IF EXISTS songsDB;
-- Creates the "favorite_db" database --
CREATE DATABASE songsDB;

-- Makes it so all of the following code will affect favorite_db --
USE songsDB;

-- Creates the table "favorite_foods" within favorite_db --
CREATE TABLE songs (
  id int NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  artist VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO songs (title, artist, genre) VALUES ("walrus song", "MeMyselfAndI", "greatMusic");

-- see what you did
SELECT * FROM songs;
