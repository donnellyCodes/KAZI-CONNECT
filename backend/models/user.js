const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: {isEmail: true} },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('worker', 'employer', 'admin'), allowNull: false }
}, {
 hooks: {
    beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    }
 }
});

module.exports = User;