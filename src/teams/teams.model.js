const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');
const logger = require('../utils/logger');
const User = require('../users/users.model');

const Team = sequelize.define(
  'teams',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'Team',
    hooks: {
      afterCreate: (team) => {
        const { name } = team.dataValues;
        logger.info(`Created team ${name}`);
      }
    }
  }
);

module.exports = Team;
