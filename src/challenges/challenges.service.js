const ChallengeTable = require('./challenges.maria.model');
const Challenge = require('./challenges.mongo.model');
const UndefinedError = require('../errors/UndefinedError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

/*
 * @param {number} id, challenge id
 * @param {object} file, file content to save
 */
const checkFileProperty = async (id, file) => {
  if (!file || !id) throw new UndefinedError();
  if (
    !file.fieldname ||
    !file.originalname ||
    !file.encoding ||
    !file.mimetype ||
    !file.buffer ||
    !file.size
  )
    throw new ValidationError('Missing file fields');
  return true;
};

/*
 * @param {db} can be either 'mongo' or 'maria', default value 'mongo'
 * @param {id} is the identification of one of the db
 */
const findOne = async (id, db = 'mongo') => {
  switch (db) {
    case 'mongo': {
      const mongoChallenge = await Challenge.findOne(id);
      if (!mongoChallenge)
        throw new NotFoundError(`Challenge with mongodb ${id} not found`);
      return mongoChallenge;
    }
    case 'maria': {
      const mariaChallenge = await ChallengeTable.findByPk(id);
      if (!mariaChallenge)
        throw new NotFoundError(`Challenge with mariadb id ${id} not found`);
      return mariaChallenge;
    }
    default: {
      throw new ValidationError(
        'Database dialect not understood either "maria" or "mongo"'
      );
    }
  }
};

const createOne = async (challengeData) => {
  if (!challengeData) throw new UndefinedError();
  const challenge = new Challenge(challengeData);
  await challenge.save();
  return await findOne(challenge.id, 'mongo');
};

const getAllChallenges = async () => {
  return await File.find({});
};

module.exports = {
  checkFileProperty,
  createOne,
  getAllChallenges
};
