const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Worker = sequelize.define('Worker', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    location: DataTypes.STRING,
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Worker;