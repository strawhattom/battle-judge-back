
const { DataTypes } = require('sequelize')
const sequelize = require('../utils/db-connection');

const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'judge', 'participant'),
            defaultValue: 'participant'
        },
        name: {
            type: DataTypes.STRING(32),
        },
        mail: {
            type: DataTypes.STRING(32),
        },
        password: {
            type: DataTypes.STRING(128),
        },
        team: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: false
    }
)

module.exports = User;