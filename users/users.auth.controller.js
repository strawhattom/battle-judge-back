const router = require('express').Router();
const service = require('./users.service');
const passport = require('passport');
require('../middlewares/local.strategy');

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

router.post('/register', async (req, res) => {
  const { username, password, mail } = req.body;
  const user = await service.register(username, password, mail);
  if (!user)
    return res.status(400).send({ message: 'Could not register the user' });
  return res.status(201).send(user);
});

module.exports = router;
