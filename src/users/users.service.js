const User = require('./users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UndefinedError = require('../errors/UndefinedError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');
require('dotenv').config();

async function register(username, password, mail) {
  try {
    if (!username || !password || !mail) throw new UndefinedError();

    const user = await User.create({
      username,
      password,
      mail
    });
    return user;
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      throw new DuplicateError(`Username ${username} already taken`);
    throw err;
  }
}

async function findAll() {
  return await User.findAll({
    attributes: ['id', 'username', 'mail', 'role', 'team']
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
    attributes: ['id', 'username', 'mail', 'role', 'team']
  });
}

async function findAllJudges() {
  return await User.findAll({
    where: {
      role: 'judge'
    },
    attributes: ['id', 'username', 'mail', 'role', 'team']
  });
}

async function update(user, properties) {
  // to-do user can't update his team if he is in an active battle.
  if (!user.id) throw new UndefinedError();
  if (properties.role) delete properties.role;
  const tempUser = await findById(user.id);
  await tempUser.update(properties);
  return await tempUser.save(); // updated user
}

async function deleteUser(id) {
  if (!id) throw new UndefinedError();
  const user = await findById(id);
  return await user.destroy();
}

async function verify(username, password) {
  if (!username || !password) throw new UndefinedError();
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
