const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dispute = sequelize.define('Dispute', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reason: { type: DataTypes.STRING, allowNull: false },
    description: {type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('open', 'resolved', 'under-investigation'), defaultValue: 'open' },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' }
});

module.exports = Dispute;
