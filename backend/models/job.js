const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = sequelize.define('Job', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    budget: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: { type: DataTypes.STRING },
    status: {
        type: DataTypes.ENUM('open', 'in-progress', 'completed', 'cancelled', 'disputed'),
        defaultValue: 'open',
        index: true
    },
    employerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Employers',
            key: 'id'
        },
        index: true
    },
    hiredWorkerId: {
        type: DataTypes.UUID,
        references: {
            model: 'Workers',
            key: 'id'
        },
        index: true
    }
}, {
    indexes: [
        {
            fields: ['status']
        },
        {
            fields: ['employerId']
        },
        {
            fields: ['location']
        },
        {
            fields: ['category']
        },
        {
            fields: ['createdAt']
        }
    ]
});

module.exports = Job