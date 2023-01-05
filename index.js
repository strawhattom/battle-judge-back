
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.MARIADB_URI);

const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('./utils/logger'); // Logger

// Controllers
const challenges = require('./challenges/challenges.controller');
const battles = require('./battles/battles.controller');
const teams = require('./teams/teams.controller');
const users = require('./users/users.controller');


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(challenges);
app.use(battles);
app.use(teams);
app.use(users);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
	logger.info(err.message);
    res.status(500).send('Error !')
  })

const main = async() => {
	try {
		logger.info("Trying to connect to databases.");
		mongoose.set('strictQuery', true); // idk why to remove DeprecationWarning
		mongoose.connect(process.env.MONGO_URI);
		logger.info("Connected to mongoDB");
		await sequelize.authenticate();
		logger.info("Connected to mariaDB");
	} catch (err) {
		logger.error(err.message);
		return;
	}

	logger.info('Launching API...');

	app.listen(port, () => {
		logger.info(`API listening on port ${port}, visit http://localhost:${port}/`)
	})
};

main();