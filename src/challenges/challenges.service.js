const ChallengeTable = require('./challenges.maria.model');
const Challenge = require('./challenges.mongo.model');
const UndefinedError = require('../errors/UndefinedError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const WrongFormatError = require('../errors/WrongFormatError');

/**
 * Vérifie que le fichier est bien défini
 * @param {number} id, id du challenge mongo
 * @param {object} file, contenu du fichier
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

/**
 * Cherche un challenge dans la base de données par son id mongo ou mariadb
 * @param {number} id, id du challenge mongo ou mariadb
 * @param {string} db, dialecte de la base de données (mongo ou maria)
 */
const findOne = async (id, db = 'mongo') => {
  switch (db) {
    case 'mongo': {
      const mongoChallenge = await Challenge.findById(id).select('-__v');
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

/**
 * Fusionne les deux challenges pour en créer un seul objet à renvoyer au client
 * les paramètres sont des objets et non des instances de modèle, les données sont directement dans l'objet
 * @param {object} maria, est le challenge de la base mariadb sous forme d'objet
 * @param {object} mongo, est le challenge de la base mongo sous forme d'objet
 * @return {object} is the challenge merged
 */
const mergeChallenge = async (maria, mongo) => {
  if (maria.mongo_challenge_id) delete maria.mongo_challenge_id;
  return { ...maria, ...mongo };
};

/**
 * Crée un challenge dans les deux bases de données
 * @param {number} authorId, id (mariadb) de l'utilisateur qui crée le challenge
 * @param {object} challengeData, sont les données du challenge
 * @return {object} est le challenge créé
 */
const createOne = async (authorId, challengeData) => {
  if (!authorId || !challengeData) throw new UndefinedError();

  const result = {};

  // Crée le challenge dans la collection mongo
  const challenge = new Challenge({
    author: authorId,
    ...challengeData
  });
  await challenge.save();
  result.mongo = await findOne(challenge.id, 'mongo');

  // Crée le challenge dans la table mariadb
  const challengeMaria = await ChallengeTable.create({
    author: authorId,
    mongo_challenge_id: challenge.id
  });
  if (!challengeMaria) throw new NotFoundError('Challenge not found');
  result.maria = challengeMaria;
  return mergeChallenge(result.maria.dataValues, result.mongo._doc);
};

/**
 * Récupère tous les challenges dans les deux bases de données
 * @returns {Array} est un tableau de challenges
 */
const getAllChallenges = async () => {
  const rawChallenges = await Promise.all([
    Challenge.find().select('-__v'),
    ChallengeTable.findAll({})
  ]);
  const mongoResult = rawChallenges[0];
  const mariaResult = rawChallenges[1];

  if (mongoResult.length === 0 || mariaResult.length === 0) return [];

  // Fusionne les tableaux, ne prends pas en compte les challenges qui ne sont pas dans les deux bases de données.
  // Array.prototype.reduce() permet de créer un tableau qui va se remplir au fur et à mesure de la boucle
  const challenges = mongoResult.reduce((challenges, mongoChallenge) => {
    const mariaId = mariaResult.find((mariaChallenge) => {
      return (
        mariaChallenge.dataValues.mongo_challenge_id ===
        mongoChallenge._id.toString()
      );
      });
      // Si le challenge est dans les deux bases de données, on le renvoie
      if (mariaId) challenges.push({ id: mariaId.id, ...mongoChallenge._doc });
      return challenges;
  }
  ,[]); // [] est le tableau de départ
  return challenges;
};

/**
 * Récupère un challenge par son id mariadb car l'id mongo est dans la base mariadb
 * 
 * @param {number} id, id du challenge (mariadb)
 * @param {boolean} mongoObject 
 * @returns {object}  si `mongoObject` true, renvoie le challenge avec les données mongo,
 *                    sinon renvoie un objet avec les données mongo et les données mariadb
 */
const findBySequenceId = async (id, mongoObject = false) => {
  if (!id) throw new UndefinedError('Challenge id is not defined');
  const maria = await findOne(id, 'maria');
  if (!maria) throw new NotFoundError('Challenge not found');
  try {
    const mongo = await findOne(maria.dataValues.mongo_challenge_id);
    if (!mongo) throw new NotFoundError('Challenge not found');
    return !mongoObject ? { id, ...mongo._doc } : mongo;
  } catch (err) {
    throw new WrongFormatError('Challenge not found');
  }
};

/**
 * 
 * @param {number} id, id du challenge (mariadb) 
 * @param {object} data, données à mettre à jour
 * @returns {object} est le challenge mis à jour
 */
const update = async (id, data) => {
  if (!id) throw new UndefinedError('No id provided');
  if (!data) throw new WrongFormatError('No new data');
  // On ne modifie pas l'auteur du challenge
  if (data.author) delete data.author;
  // On récupère le challenge dans la base mariadb pour l'id mongo
  const mariaChallenge = await findOne(id, 'maria');
  await Challenge.findOneAndUpdate(
    { _id: mariaChallenge.dataValues.mongo_challenge_id },
    data
  );
  return await findBySequenceId(id); 
};

/**
 * Supprime un challenge dans les deux bases de données
 * @param {number} id, id du challenge (mariadb) 
 * @returns {object} est le challenge supprimé
 */
const deleteOne = async (id) => {
  if (!id) throw new UndefinedError('No id provided');
  const mariaChallenge = await findOne(id, 'maria');
  await mariaChallenge.destroy();
  const mongoChallenge = await findOne(
    mariaChallenge.dataValues.mongo_challenge_id
  );
  await mongoChallenge.remove();

  return mergeChallenge(mariaChallenge.dataValues, mongoChallenge._doc);
};

/**
 * Récupère les ressources d'un challenge (fichiers)
 * @param {number} id, id du challenge (mariadb)
 * @returns {Array} est un tableau de ressources
 */
const getResources = async (id) => {
  if (!id) throw new UndefinedError("No resource's id provided");
  const challenge = await findBySequenceId(id);
  return challenge.resources;
};

/**
 * Récupère les challenges actifs
 * @returns {Array} est un tableau de challenges actifs
 */
const getActiveChallenges = async () => {
  const rawChallenges = await Promise.all([
    Challenge.find({ active: true }).select('-__v -flag -active'),
    ChallengeTable.findAll({})
  ]);
  const mongoResult = rawChallenges[0];
  const mariaResult = rawChallenges[1];

  if (mongoResult.length === 0 || mariaResult.length === 0) return [];

  // Fusionne les tableaux, ne prends pas en compte les challenges qui ne sont pas dans les deux bases de données.
  const challenges = mongoResult.reduce((challenges, mongoChallenge) => {
    const mariaId = mariaResult.find((mariaChallenge) => {
      return (
        mariaChallenge.dataValues.mongo_challenge_id ===
        mongoChallenge._id.toString()
      );
    });
    if (mariaId) challenges.push({ id: mariaId.id, ...mongoChallenge._doc });
    return challenges;
  }, []);

  // Crée un tableau de challenges par catégorie
  const challengesByCategory = {};

  challenges.forEach((challenge) => {
    if (!challengesByCategory[challenge.category]) challengesByCategory[challenge.category] = [];
    challengesByCategory[challenge.category].push(challenge);
  });

  return challengesByCategory;
};

module.exports = {
  checkFileProperty,
  createOne,
  getAllChallenges,
  findBySequenceId,
  update,
  deleteOne,
  getResources,
  getActiveChallenges
};
