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

// On filtre les données pour ne pas donner les mots de passes hashés
const FILTERED_FIELDS = ['id', 'username', 'email', 'role', 'teamId'];  // Pour le reste
const FILTERED_FIELDS_ALL = ['id', 'username', 'email', 'role'];        // Pour findAll()

/** 
 * Enregistrer un utilisateur
 * @param {username} username, nom d'utilisateur
 * @param {password} password, mot de passe en clair
 * @param {email} email, email de l'utilisateur
 * @return {User}
 */
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
    // Deux erreurs possibles : Nom d'utilisateur déjà utilisé ou problèmes de validation de l'utilisateur (voir `users.model.js`)
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

/**
 * Récupère tous les utilisateurs sans leur équipes ni leur mot de passe
 * Le champ `teamId` n'est pas pris en compte car on fait une relation directement dans la requête avec `include`
 * @return {Array<User>}
 */
async function findAll() {
  return await User.findAll({
    attributes: FILTERED_FIELDS_ALL,
    // mettre en relation la table User et Team grâce aux modèles
    include: {
      model: Team
    }
  });
}

/**
 * Récupère un utilisateur via son id (clé primaire)
 * @param {string} id
 * @return {User}
 */
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

/**
 * Récupère un utilisateur via un nom d'utilisateur (unique)
 * @param {string} username
 * @return {User}
 */
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

/**
 * Récupère tous les participants
 * @return {Array<User>}
 */
async function findAllParticipants() {
  return await User.findAll({
    where: {
      role: 'participant'
    },
    attributes: FILTERED_FIELDS
  });
}

/**
 * Récupère tous les juges
 * @return {Array<User>}
 */
async function findAllJudges() {
  return await User.findAll({
    where: {
      role: 'judge'
    },
    attributes: FILTERED_FIELDS
  });
}

/**
 * Mets à jour les informations d'un utilisateur et la retourne sans données inutiles / sensibles
 * TODO: l'utilisateur ne doit pas mettre à jour son équipe si une battle est "en cours" (active)
 * @param {User} user, l'utilisateur à mettre à jour
 * @param {Object} properties, les propriétés à mettre à jour
 * @return {User}
 */
async function update(user, properties) {
  if (!user.id) throw new UndefinedError('User id is undefined !');
  
  // L'utilisateur ne peut pas modifier son id, son rôle, son nom d'utilisateur
  if (properties.id) delete properties.id;
  if (properties.role) delete properties.role;
  if (properties.username) delete properties.username;
  const tempUser = await findById(user.id);
  await tempUser.update(properties);
  await tempUser.save();
  const updatedUser = await findByName(user.username);

  // Supprime les informations sensibles / inutiles à renvoyer
  delete updatedUser.dataValues.password;
  delete updatedUser.dataValues.teamId;
  return updatedUser;
}

/**
 * Met à jour un utilisateur du point de vue de l'administrateur (peut modifier le mot de passe et le nom de l'utilisateur)
 * @param {User} user, l'utilisateur à mettre à jour
 * @param {Object} properties, les propriétés à mettre à jour
 * @return {User}
 */
async function updateAsAdmin(user, properties) {
  if (!user.id) throw new UndefinedError('User id is undefined !');
  if (properties.id) delete properties.id;
  const tempUser = await findById(user.id);
  await tempUser.update(properties);
  return await tempUser.save(); // updated user
}

/**
 * Supprime l'utilisateur, retourne l'utilisateur supprimé
 * @param {string} id
 * @return {User}
 */
async function deleteUser(id) {
  if (!id) throw new UndefinedError('User id is undefined !');
  const user = await findById(id);
  return await user.destroy();
}

/**
 * Vérifie si l'utilisateur peut se connecter en passant le nom de l'utilisateur et le mot de passe
 * @param {string} username
 * @param {string} password
 * @return {User}
 */
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

/**
 * Génère un token JWT pour l'authentification
 * @param {string} id, l'id de l'utilisateur
 * @return {string}
 */
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
