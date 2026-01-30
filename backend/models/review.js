const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 }},
    comment: { type: DataTypes.TEXT },
    type: { type: DataTypes.ENUM('worker-to-employer', 'employer-to-worker') }
});

module.exports = Review;