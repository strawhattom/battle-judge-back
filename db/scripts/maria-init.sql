DROP SCHEMA IF EXISTS battle_judge;
CREATE SCHEMA battle_judge;
USE battle_judge;

-- Tables Creation

CREATE TABLE Battle (battle_id INT AUTO_INCREMENT KEY,
			    start_date DATE default NULL,
			    active BOOLEAN default FALSE
);
CREATE TABLE Team (team_id INT AUTO_INCREMENT PRIMARY KEY,
			    name VARCHAR(32) NOT NULL UNIQUE
);
CREATE TABLE Leaderboard (leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
			    team_id INT(11) NOT NULL,
			    battle_id INT(11) NOT NULL,
			    total_points INT(11) default 0,
			    CONSTRAINT fk_leaderboard1 FOREIGN KEY (team_id) REFERENCES Team(team_id) ON UPDATE CASCADE,
			    CONSTRAINT fk_leaderboard2 FOREIGN KEY (battle_id) REFERENCES Battle(battle_id) ON UPDATE CASCADE
);
CREATE TABLE Participate (participate_id INT AUTO_INCREMENT PRIMARY KEY,
			    team_id INT NOT NULL,
			    battle_id INT NOT NULL,
			    CONSTRAINT fk_participate1 FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
			    CONSTRAINT fk_participate2 FOREIGN KEY (battle_id) REFERENCES Battle(battle_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE User (user_id INT AUTO_INCREMENT PRIMARY KEY,
			    role ENUM('admin','judge', 'participant'),
			    username VARCHAR(32) NOT NULL UNIQUE,
			    mail VARCHAR(32) NOT NULL,
			    password VARCHAR(128) NOT NULL,
			    team_id INT,
			    CONSTRAINT fk_user FOREIGN KEY (team_id) REFERENCES Team(team_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Challenge (challenge_id INT AUTO_INCREMENT PRIMARY KEY,
			    mongo_challenge_id VARCHAR(16) NOT NULL UNIQUE,
			    author_id INT NOT NULL,
			    CONSTRAINT fk_challenge FOREIGN KEY (author_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Values Insertion

INSERT INTO Battle VALUES (1,'2021-05-27',0);
INSERT INTO Battle VALUES (2,'2021-08-04',0);
INSERT INTO Battle VALUES (3,'2022-03-15',0);
INSERT INTO Battle VALUES (4,'2022-12-21',1);
INSERT INTO Battle VALUES (5,'2023-01-18',1);

INSERT INTO Team VALUES (1,'s0pra');
INSERT INTO Team VALUES (2,'ESILV');
INSERT INTO Team VALUES (3,'teaaam');
INSERT INTO Team VALUES (4,'ABC');
INSERT INTO Team VALUES (5,'battle2');

INSERT INTO Leaderboard VALUES (1,1,5,25);
INSERT INTO Leaderboard VALUES (2,2,5,57);
INSERT INTO Leaderboard VALUES (3,3,5,9);
INSERT INTO Leaderboard VALUES (4,4,5,13);
INSERT INTO Leaderboard VALUES (5,5,5,36);

INSERT INTO Participate VALUES (1,1,5);
INSERT INTO Participate VALUES (2,1,5);
INSERT INTO Participate VALUES (3,2,5);
INSERT INTO Participate VALUES (4,2,5);
INSERT INTO Participate VALUES (5,2,5);

INSERT INTO User VALUES (1,'admin','madmin','adm@sopra.fr','$2a$10$eZZd9LQQBB1oR7M714/BLeCu2JBs2YGcGmUvNNymQC9Lv1oFiTvhG',null);
INSERT INTO User VALUES (2,'judge','gandalf','gandalf@sopra.fr','$2a$10$LkFZDDuPk2ex8LFTJWpr7O81cHK1S9SnYAjk3Bt7URQ7p/x/nJBG6',null);
INSERT INTO User VALUES (3,'participant','harryP','harryP@sopra.fr','$2a$10$Z4iwmqsxARFD/M/l9qh1Dust5pafyTLOLr.N/T4xtQe1xgUhOF7MO',1);
INSERT INTO User VALUES (4,'judge','dark8vador','dark8vador@sopra.fr','$2a$10$NXgEsKrkjxhQK7YZWRnxDeL4PyCymQz0.6eZsDTX00FEoStamBeuu',null);
INSERT INTO User VALUES (5,'participant','naruto','naruto@sopra.fr','$2a$10$0lwGLz/2B7tGWvfS0Is6K.9/LjyNTbzGDMkjYKTvQsNt10Wtwdd7a
',1);
INSERT INTO User VALUES (6,'participant','johnsnow','johnsnow@sopra.fr','$2a$10$ZNpQFlZBmXO4/RvYC67Fw.0b11vWBgG6ZyqgmA9u/QSdz4FhOjIy6',2);
INSERT INTO User VALUES (7,'participant','minion','minion@sopra.fr','$2a$10$PpAdIvY9zFGbMctzKOdogOQLld8zfc7PCRmojxP6cXpbqEl4.D9a.',2);
INSERT INTO User VALUES (8,'participant','natsu','natsu@sopra.fr','$2a$10$rvPxXyNeemiXiRv6gWioA.wOzgM0QQWPoBlC/slXK93gXjd/cQASW',2);

INSERT INTO Challenge VALUES (1,'challengeA',1);
INSERT INTO Challenge VALUES (2,'challengeB',1);
INSERT INTO Challenge VALUES (3,'challengeC',1);
INSERT INTO Challenge VALUES (4,'challengeD',1);
INSERT INTO Challenge VALUES (5,'challengeE',1);
INSERT INTO Challenge VALUES (6,'challengeF',1);