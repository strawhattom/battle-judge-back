
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sequelize = require('./utils/db-connection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('./utils/logger'); // Logger

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	return res.status(200).send({'message': '/register to register an account'});
})

// Controllers
app.use(require('./challenges/challenges.controller'));
app.use(require('./battles/battles.controller'));
app.use(require('./teams/teams.controller'));
app.use(require('./users/users.controller'));

// Error handling
app.use(require('./middlewares/error.express'));

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