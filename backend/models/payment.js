const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    mpesaReceiptNumber: { type: DataTypes.STRING, unique: true },
    status: {
        type: DataTypes.ENUM('pending', 'escrowed', 'released', 'refunded'),
        defaultValue: 'pending'
    },
    transactionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Payment;