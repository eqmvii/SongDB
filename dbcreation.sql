-- This created the db

-- Drops the songsDB if it exists currently --
DROP DATABASE IF EXISTS songsDB;
-- Creates the database --
CREATE DATABASE songsDB;

-- Makes it so all of the following code will affect songsDB --
USE songsDB;

-- Creates the table "songs" within favorite_db --
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
