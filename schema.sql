DROP SCHEMA IF EXISTS battle_judge;
CREATE SCHEMA battle_judge;
USE battle_judge;

-- Tables

CREATE TABLE IF NOT EXISTS teams ( 
    id INT AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    role ENUM('admin','judge', 'participant'),
    name VARCHAR(32) NOT NULL,
    mail VARCHAR(32) NOT NULL,
    password VARCHAR(128) NOT NULL,
    team INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (team) 
        REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS battles (
    id INT AUTO_INCREMENT,
    start_date DATE DEFAULT NULL,
    active BOOLEAN DEFAULT false,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS participate (
    id INT AUTO_INCREMENT,
    team_id INT NOT NULL,
    battle_id INT NOT NULL,
    PRIMARY KEY(team_id, battle_id),
    FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (battle_id)
        REFERENCES battles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS challenges (
    id INT AUTO_INCREMENT,
    mongo_challenge_id VARCHAR(16) NOT NULL,
    author_id INT NOT NULL,
    succeeded BOOLEAN NOT NULL,
    time DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS leaderboards (
	id INT AUTO_INCREMENT,
    team_id INT NOT NULL,
    battle_id INT NOT NULL,
    total_points INT DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (team_id)
		REFERENCES teams(id)
        ON UPDATE CASCADE,
	FOREIGN KEY (battle_id)
		REFERENCES battles(id)
        ON UPDATE CASCADE
);
