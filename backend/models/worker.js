const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Worker = sequelize.define('Worker', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    location: DataTypes.STRING,
    experience: DataTypes.STRING,
    skills: {
        type: DataTypes.STRING,
        allowNull: true
    },
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Worker;