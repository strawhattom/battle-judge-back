const Team = require('./teams.model');
const { QueryTypes } = require('sequelize');
const db = require('../utils/db-connection');
const UndefinedError = require('../errors/UndefinedError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const WrongFormatError = require('../errors/WrongFormatError');

const findAll = async () => {
  // const teams = await Team.findAll();
  const teams = await db.query(
    'SELECT Team.*, COUNT(User.teamId) as members FROM Team LEFT JOIN User ON Team.id = User.teamId GROUP BY Team.id;',
    { type: QueryTypes.SELECT }
  );
  if (!teams) throw new NotFoundError('No teams found');
  return teams;
};

const create = async (name) => {
  if (!name) throw new UndefinedError('Team name is undefined');
  if (typeof name !== 'string')
    throw new WrongFormatError('Team name is not a string');
  if (name.length < 3 || name.length > 32)
    throw new ValidationError('Team name length is not valid');
  const team = await Team.create({ name });
  return team;
};

const deleteOne = async (id) => {
  if (!id) throw new UndefinedError('Team id is undefined');
  if (typeof id !== 'number')
    throw new WrongFormatError('Team id is not a number');
  const team = await Team.findByPk(id);
  if (!team) throw new NotFoundError(`Team id ${id} not found`);
  await team.destroy();
  // à faire : supprimer les users de cette équipe

  return team;
};

module.exports = {
  findAll,
  deleteOne,
  create
};
