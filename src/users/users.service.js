const User = require('./users.model');
const Team = require('../teams/teams.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UndefinedError = require('../errors/UndefinedError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');
const WrongFormatError = require('../errors/WrongFormatError');
require('dotenv').config();

const FILTERED_FIELDS = ['id', 'username', 'email', 'role', 'teamId'];
const FILTERED_FIELDS_ALL = ['id', 'username', 'email', 'role'];

async function register(username, password, email) {
  try {
    if (!username) throw new UndefinedError('Username is undefined !');
    if (!password) throw new UndefinedError('Password is undefined !');
    if (!email) throw new UndefinedError('Email is undefined !');
    const user = await User.create({
      username,
      password,
      email
    });
    return user;
  } catch (err) {
    switch (err.name) {
      case 'SequelizeUniqueConstraintError': {
        throw new DuplicateError(`Username ${username} already taken`);
      }
      case 'SequelizeValidationError': {
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
    attributes: FILTERED_FIELDS_ALL,
    include: {
      model: Team
    }
  });
}

async function findById(id) {
  const user = await User.findByPk(id, {
    attributes: FILTERED_FIELDS,
    include: {
      model: Team
    }
  });
  if (!user) throw new NotFoundError(`User id ${id} not found`);
  return user;
}

async function findByName(username) {
  const user = await User.findOne({
    where: {
      username
    },
    include: {
      model: Team
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
  if (properties.id) delete properties.id;
  if (properties.role) delete properties.role;
  if (properties.username) delete properties.username;
  const tempUser = await findById(user.id);
  await tempUser.update(properties);
  await tempUser.save();
  const updatedUser = await findByName(user.username);

  // supprime les informations sensibles / inutiles
  delete updatedUser.dataValues.password;
  delete updatedUser.dataValues.teamId;
  return updatedUser; // updated user
}

async function updateAsAdmin(user, properties) {
  if (!user.id) throw new UndefinedError('User id is undefined !');
  if (properties.id) delete properties.id;
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
  updateAsAdmin,
  deleteUser
};
