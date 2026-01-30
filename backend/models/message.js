const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiverId: { type: DataTypes.UUID, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Message;