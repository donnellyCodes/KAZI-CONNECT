const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true, 
        validate: {isEmail: true},
        index: true
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
        type: DataTypes.ENUM('worker', 'employer', 'admin'), 
        allowNull: false,
        index: true
    },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    otpCode: { type: DataTypes.STRING, allowNull: true },
    otpExpires: { type: DataTypes.DATE, allowNull: true }
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['role']
        }
    ]
});

module.exports = User;