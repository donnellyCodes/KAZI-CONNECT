const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employer = sequelize.define('Employer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        index: true
    },
    companyName: DataTypes.STRING,
    location: DataTypes.STRING,
    industry: DataTypes.STRING,
    bio: DataTypes.TEXT
}, {
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['location']
        },
        {
            fields: ['industry']
        }
    ]
});

module.exports = Employer;