const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Challenge = sequelize.define(
  'challenges',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      auto_increment: true
    },
    mongo_challenge_id: {
      type: DataTypes.STRING(32)
    },
    author: {
      type: DataTypes.INTEGER,
      field: 'author_id'
    }
  },
  {
    timestamps: false,
    tableName: 'Challenge'
  }
);

module.exports = Challenge;
