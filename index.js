require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sequelize = require('./utils/db-connection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
require('./middlewares/jwt.strategy');
const logger = require('./utils/logger'); // Logger

// Controllers
const authController = require('./users/users.auth.controller');
const usersController = require('./users/users.controller');
const challengesController = require('./challenges/challenges.controller');
const battlesController = require('./battles/battles.controller');
const teamsController = require('./teams/teams.controller');
const errorHandler = require('./errors/http-error.handler');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).send({
    message:
      "Hello, welcome to Battle Judge 's API, to start with, register yourself at /register and then /login to get access to your token."
  });
});

app.use(authController);

app.use(
  '/users',
  passport.authenticate('jwt', { session: false }),
  usersController
);

app.use(
  '/challenges',
  passport.authenticate('jwt', { session: false }),
  challengesController
);

app.use(
  '/battles',
  passport.authenticate('jwt', { session: false }),
  battlesController
);

app.use(
  '/teams',
  passport.authenticate('jwt', { session: false }),
  teamsController
);

app.use(errorHandler);

const main = async () => {
  try {
    logger.info('Trying to connect to databases.');
    mongoose.set('strictQuery', true); // idk why to remove DeprecationWarning
    mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to mongoDB');
    await sequelize.authenticate();
    logger.info('Connected to mariaDB');
  } catch (err) {
    logger.error(err.message);
    return;
  }
  app.listen(port, () => {
    logger.info(
      `API listening on port ${port}, visit http://localhost:${port}/`
    );
  });
};

main();
