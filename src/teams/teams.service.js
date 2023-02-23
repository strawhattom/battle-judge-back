const Team = require('./teams.model');
const UndefinedError = require('../errors/UndefinedError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const WrongFormatError = require('../errors/WrongFormatError');

const findAll = async () => {
  const teams = await Team.findAll();
  if (!teams) throw new NotFoundError('No teams found');
  return teams;
};

module.exports = {
  findAll
};
