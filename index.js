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

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  return res
    .status(200)
    .send({
      message:
        "Hello, welcome to Battle Judge 's API, to start with, register yourself at /register and then /login to get access to your token."
    });
});

// Controllers

app.use(require('./users/users.auth.controller'));

app.use(
  '/users',
  passport.authenticate('jwt', { session: false }),
  require('./users/users.controller')
);

app.use(
  '/challenges',
  passport.authenticate('jwt', { session: false }),
  require('./challenges/challenges.controller')
);

app.use(
  '/battles/',
  passport.authenticate('jwt', { session: false }),
  require('./battles/battles.controller')
);

app.use(
  '/teams',
  passport.authenticate('jwt', { session: false }),
  require('./teams/teams.controller')
);

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
