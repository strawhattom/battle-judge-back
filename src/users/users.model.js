const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const saltRounds = 10; // REDACTED

const Team = require('../teams/teams.model');

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'judge', 'participant'),
      defaultValue: 'participant',
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: Team,
        key: 'id'
      }
    }
  },
  {
    timestamps: false,
    tableName: 'User',
    hooks: {
      beforeCreate: (user) => {
        user.dataValues.password = bcrypt.hashSync(user.password, saltRounds);
      },
      beforeUpdate: (user) => {
        // Hash le mot de passe si l'utilisateur change son mot de passe avant de le sauvegarder
        if (user.changed('password'))
          user.dataValues.password = bcrypt.hashSync(user.password, saltRounds);
      },
      afterCreate: (user) => {
        const { username, email } = user.dataValues;
        logger.info(`Created user ${username} with ${email}`);
      },
      afterUpdate: (user) => {
        const { username } = user.dataValues;
        logger.info(`Updated user ${username}`);
      }
    }
  }
);

// Association entre Team et Utilisateur (nécessaire ?)
Team.hasMany(User);
User.belongsTo(Team, { foreignKey: 'teamId' });

module.exports = User;
