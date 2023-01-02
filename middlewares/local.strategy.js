const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../users/users.model');
const usersService = require('../users/users.service');

passport.use(new Strategy(
    function (username, password, done) {
        User.findOne({ username }, async function (err, user) {
            if (err)    return done(err)
            if (!user)  {
                console.log("[-] User not found");
                return done(null, false);
            }
            if (!await usersService.verify(username, password)){
                console.log("[-] Wrong password...");
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

module.exports = passport