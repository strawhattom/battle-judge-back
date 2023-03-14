const router = require('express').Router();
const service = require('./users.service');
const passport = require('passport');
require('../middlewares/local.strategy');

/**
 * Route pour l'authentification (la génération du token)
 * @param {string} username
 * @param {string} password
 * @return {token}
 */
router.post(
  '/login',
  passport.authenticate('local', {
    session: false
  }),
  async (req, res) => {
    const username = req.user?.username;
    const token = await service.generateJWT(username);
    return res.status(200).send({ token });
  }
);

/**
 * Route pour l'inscription, contenu dans le payload de la requête
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @return {User}
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = await service.register(username, password, email);
    return res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
