const passport = require('passport');
const { Strategy } = require('passport-local');
const service = require('../users/users.service');
const logger = require('../utils/logger');

passport.use(new Strategy(
    async (username, password, done) => {
        const user = await service.findByName(username);
        if (!user)  {
            logger.error(`Login error: ${username} not found`);
            return done(null, false);
        }
        if (!await service.verify(username, password)){
            logger.error(`Login error: wrong password`);
            return done(null, false);
        }
        return done(null, user);
    })
);

module.exports = passport