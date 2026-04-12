const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    employerId: { type: DataTypes.UUID, allowNull: false },
    workerId: { type: DataTypes.UUID, allowNull: false },
    phoneNumber: { type: DataTypes.STRING },
    checkoutRequestId: { type: DataTypes.STRING },
    mpesaReceiptNumber: { type: DataTypes.STRING, unique: true },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
    },
    transactionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    paidAt: { type: DataTypes.DATE }
});

module.exports = Payment;
