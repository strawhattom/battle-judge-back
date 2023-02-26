const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const service = require('../users/users.service');
const setupErrorHandler = require('../errors/setup-error.handler');
require('dotenv').config();

try {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract token from Authorization header as a Bearer token
        secretOrKey: process.env.JWT_SECRET // jwt secret extracted from .env
      },
      async (token, done) => {
        const user = await service.findByName(token.sub);
        if (!user) return done(null, false);
        const { id, username, email, team, role } = user.dataValues;
        return done(null, {
          id,
          username,
          email,
          team,
          role
        });
      }
    )
  );
} catch (err) {
  setupErrorHandler(err);
}
