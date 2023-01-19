const passport = require('passport');
const { Strategy } = require('passport-local');
const service = require('../users/users.service');

passport.use(
  new Strategy(async (username, password, next) => {
    try {
      const user = await service.findByName(username);
      if (!user) return next(null, false);
      if (!(await service.verify(username, password))) return next(null, false);
      return next(null, user);
    } catch (err) {
      next(err);
    }
  })
);

module.exports = passport;
