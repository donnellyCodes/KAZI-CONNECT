const sequelize = require('../config/db');
const User = require('./user');
const Worker = require('./worker');
const Employer = require('./employer');
const Skill = require('./skills');
const Job = require('./job');
const Application = require('./application');
const Payment = require('./payment');
const Review = require('./review');
const Verification = require('./verification');
const Message = require('./Message');
const Dispute = require('./Dispute');

User.hasOne(Worker, { foreignKey: 'userId', onDelete: 'CASCADE' });
Worker.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Employer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Employer.belongsTo(User, { foreignKey: 'userId' });

// employer and jobs
Employer.hasMany(Job, { foreignKey: 'employerId' });
Job.belongsTo(Employer, { foreignKey: 'employerId' });

// workers and applications
Worker.hasMany(Application, { foreignKey: 'workerId' });
Application.belongsTo(Worker, { foreignKey: 'workerId' });

// jobs and application
Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

// workers and skills (this is many to many)
Worker.belongsToMany(Skill, { through: 'WorkerSkills' });
Skill.belongsToMany(Worker, { through: 'WorkerSkills' });

// jobs and skills
Job.belongsToMany(Skill, { through: 'JobSkills' });
Skill.belongsToMany(Job, { through: 'JobSkills' });

// jobs and payment
Job.hasOne(Payment, {foreignKey: 'jobId' });
Payment.belongsTo(Job, { foreignKey: 'jobId' });

// jobs and reviews
Job.hasMany(Review, { foreignKey: 'jobId' });
Review.belongsTo(Job, { foreignKey: 'jobId' });

Review.belongsTo(User, { as: 'Reviewer', foreignKey: 'reviewerId' });
Review.belongsTo(User, { as: 'Reviewee', foreignKey: 'revieweeId' });

// worker and verification
Worker.hasOne(Verification, { foreignKey: 'workerId' });
Verification.belongsTo(Worker, { foreignKey: 'workerId' });

// User and dispute
User.hasMany(Dispute, { foreignKey: 'userId' });
Dispute.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(Dispute, { foreignKey: 'jobId' });
Dispute.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = { sequelize, User, Worker, Employer, Skill, Job, Application, Payment, Review, Verification, Message, Dispute};