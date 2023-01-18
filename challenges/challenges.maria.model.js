const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db-connection')

const Challenge = sequelize.define(
  'challenges',
  {
    mongo_challenge_id: {
      type: DataTypes.STRING(16)
    },
    author_id: {
      type: DataTypes.INTEGER
    },
    succeeded: {
      type: DataTypes.BOOLEAN
    },
    time: {
      type: DataTypes.DATE
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)

module.exports = Challenge
