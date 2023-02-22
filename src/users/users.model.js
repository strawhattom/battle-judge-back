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
      field: 'user_id',
      primaryKey: true,
      auto_increment: true
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
    mail: {
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
    team: {
      type: DataTypes.INTEGER,
      field: 'team_id',
      defaultValue: null
    }
  },
  {
    timestamps: false,
    tableName: 'User',
    hooks: {
      // Create one
      beforeCreate: (user) => {
        user.dataValues.password = bcrypt.hashSync(user.password, saltRounds);
      },
      beforeUpdate: (user) => {
        // Hash password if the user changed his password
        if (user.changed('password'))
          user.dataValues.password = bcrypt.hashSync(user.password, saltRounds);
      },
      afterCreate: (user) => {
        const { username, mail } = user.dataValues;
        logger.info(`Created user ${username} with ${mail}`);
      },
      afterUpdate: (user) => {
        const { username } = user.dataValues;
        logger.info(`Updated user ${username}`);
      }
    }
  }
);

// User.hasOne(Team);

module.exports = User;
