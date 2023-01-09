const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Challenge = sequelize.define('Challenge', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
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
            type:DataTypes.DATE
        }
    },
    {
        timestamps:false
    }
);


module.exports = Challenge;