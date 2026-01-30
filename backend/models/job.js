const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = sequelize.define('Job', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    budget: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
        type: DataTypes.ENUM('open', 'in-progress', 'completed', 'cancelled'),
        defaultValue: 'open'
    }
});

module.exports = Job