const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Worker = sequelize.define('Worker', {
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
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    location: DataTypes.STRING,
    experience: DataTypes.STRING,
    skills: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customSkill: {
        type: DataTypes.STRING,
        allowNull: true
    },
    yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    cvUrl: { type: DataTypes.STRING, allowNull: true },
    idUrl: { type: DataTypes.STRING, allowNull: true }
}, {
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['location']
        },
        {
            fields: ['skills']
        },
        {
            fields: ['customSkill']
        }
    ]
});

module.exports = Worker;