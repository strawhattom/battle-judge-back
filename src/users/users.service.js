const User = require('./users.model');
const Team = require('../teams/teams.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UndefinedError = require('../errors/UndefinedError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');
const WrongFormatError = require('../errors/WrongFormatError');
const { col } = require('sequelize');
require('dotenv').config();

const FILTERED_FIELDS = ['id', 'username', 'mail', 'role', 'team'];

async function register(username, password, mail) {
  try {
    if (!username) throw new UndefinedError('Username is undefined !');
    if (!password) throw new UndefinedError('Password is undefined !');
    if (!mail) throw new UndefinedError('Email is undefined !');
    const user = await User.create({
      username,
      password,
      mail
    });
    return user;
  } catch (err) {
    switch (err.name) {
      case 'SequelizeUniqueConstraintError': {
        throw new DuplicateError(`Username ${username} already taken`);
      }
      case 'SequelizeValidationError': {
        console.log(err);
        throw new WrongFormatError('Validation error');
      }
      default: {
        throw err;
      }
    }
  }
}

async function findAll() {
  return await User.findAll({
    attributes: FILTERED_FIELDS,
    include: {
      model: Team,
      on: {
        id: col('Team.id')
      }
    }
  });
}

async function findById(id) {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError(`User id ${id} not found`);
  return user;
}

async function findByName(username) {
  const user = await User.findOne({
    where: {
      username
    }
  });
  if (!user) throw new NotFoundError(`User ${username} not found`);
  return user;
}

async function findAllParticipants() {
  return await User.findAll({
    where: {
      role: 'participant'
    },
    attributes: FILTERED_FIELDS
  });
}

async function findAllJudges() {
  return await User.findAll({
    where: {
      role: 'judge'
    },
    attributes: FILTERED_FIELDS
  });
}

async function update(user, properties) {
  // to-do user can't update his team if he is in an active battle.
  if (!user.id) throw new UndefinedError('User id is undefined !');
  if (properties.role) delete properties.role;
  const tempUser = await findById(user.id);
  await tempUser.update(properties);
  return await tempUser.save(); // updated user
}

async function deleteUser(id) {
  if (!id) throw new UndefinedError('User id is undefined !');
  const user = await findById(id);
  return await user.destroy();
}

async function verify(username, password) {
  if (!username) throw new UndefinedError('Username is undefined !');
  if (!password) throw new UndefinedError('Password is undefined !');
  const user = await findByName(username);
  if (!user) throw new NotFoundError(`Unknown user ${username}`);
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    throw new ValidationError(`Password not match for user ${username}`);
  return user;
}

async function generateJWT(id) {
  return jwt.sign({ sub: id }, process.env.JWT_SECRET);
}

module.exports = {
  register,
  findAll,
  findAllParticipants,
  findAllJudges,
  findById,
  findByName,
  verify,
  generateJWT,
  update,
  deleteUser
};
