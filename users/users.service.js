const User = require('./users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UndefinedParametersError = require('../errors/UndefinedParametersError');
const logger = require('../utils/logger');

require('dotenv').config();

async function register(username, password, mail) {
    try {
        if (!username || !password || !mail) throw new UndefinedParametersError();

        const user = await User.create({
            username,
            password,
            mail
        });
        return user;
    } catch (err) {
        logger.error(`Registration error: ${err.errors[0].message}`);
		return null;
    }
}

async function findAll() {
    return await User.findAll();
}

async function findById(id) {
    return await User.findByPk(id);
}

async function findByName(username) {
    return await User.findOne({
        where: {
            username
        }
    });
}

async function update(id, properties) {
    try {
        if (properties.role) delete property.role;
        if (properties.password) {
            const hashedPassword = await bcrypt.hash(properties.password, 10);
            properties.password = hashedPassword;
        }
        const user = find(id);
        await user.update(properties);
        await user.save();
        return user;
    } catch (err) {
        logger.error(err);
        return null;
    }
}

async function deleteUser(id) {
    try {
        return await User.findOneAndDelete({_id:id});
    } catch (err) {
        logger.error(err);
        return null;
    }
}

async function verify(username, password) {
    try {
        if (!username || !password) throw new UndefinedParametersError();
        const user = await findByName(username);
        if (!user) throw new Error("Unknown username");
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Password not match');
        return user;
    } catch (err) {
        logger.error(err);
        return null;
    }
}

async function generateJWT(id) {
    return jwt.sign({sub:id}, process.env.JWT_SECRET);
}

module.exports = {
    register,
    findAll,
    findById,
    findByName,
    verify,
    generateJWT,
    update,
    deleteUser
}