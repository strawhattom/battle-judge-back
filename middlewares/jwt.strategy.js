const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const service = require('../users/users.service');
const logger = require('../utils/logger');
require('dotenv').config();

passport.use(new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   // extract token from Authorization header as a Bearer token
            secretOrKey: process.env.JWT_SECRET                         // jwt secret extracted from .env
        },
        async (token, done) => {
            const user = await service.findByName(token.sub)
            if (user)   return done(null, {
                username:user.username,
                role:user.role,
                team:user.team
            });   // user found
            return done(null, false);
        }
    )
);
module.exports = passport;