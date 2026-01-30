const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
    },
    proposal: { type: DataTypes.TEXT }
});

module.exports = Application;