const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employer = sequelize.define('Employer', {
    companyName: DataTypes.STRING,
    location: DataTypes.STRING,
    industry: DataTypes.STRING
});

module.exports = Employer;