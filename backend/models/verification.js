const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Verification = sequelize.define('Verification', {
    documentType: { type: DataTypes.STRING }, // ID or Passport
    documentUrl: { type: DataTypes.STRING }, // links to file storage
    status: { type: DataTypes.ENUM('pending', 'verified', 'rejected'), defaultValue: 'pending' }
});

module.exports = Verification;