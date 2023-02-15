require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sequelize = require('./src/utils/db-connection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = process.env.PORT || 3000;
const passport = require('passport');
const setupErrorHandler = require('./src/errors/setup-error.handler');
require('./src/middlewares/jwt.strategy');
const logger = require('./src/utils/logger'); // Logger

// Controllers
const authController = require('./src/users/users.auth.controller');
const usersController = require('./src/users/users.controller');
const challengesController = require('./src/challenges/challenges.controller');
const battlesController = require('./src/battles/battles.controller');
const teamsController = require('./src/teams/teams.controller');
const errorHandler = require('./src/errors/http-error.handler');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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
  // to-do loop to retry the connection...
  try {
    logger.info('Trying to connect to databases.');

    // MongoDB connection
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to mongoDB');

    // MariaDB connection
    await sequelize.authenticate();
    logger.info('Connected to mariaDB');
  } catch (err) {
    setupErrorHandler(err);
  }
  app.listen(port, () => {
    logger.info(
      `API listening on port ${port}, visit http://localhost:${port}/`
    );
  });
};

main();
