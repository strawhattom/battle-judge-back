const passport = require('passport');
const User = require('../users/users.model');
const { Strategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();

passport.use(new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   // extract token from Authorization header as a Bearer token
            secretOrKey: process.env.JWT_SECRET                         // jwt secret extracted from .env
        },
        function(token, done) {
            User.findOne({_id: token.sub}, function(err, user) {
                if (err)    return done(err, false);        // error
                if (user)   return done(null, {
                    _id:user?._id,
                    role:user?.role
                });   // user found
                return done(null, false);                   // user not found
            });
        }
    )
);
module.exports = passport;