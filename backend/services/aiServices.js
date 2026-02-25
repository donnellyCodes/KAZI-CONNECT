const axios = require('axios');
const { Worker, Job, Review, Application } = require('../models');
const { Op } = require('sequelize');

const AI_SERVICE_URL = "http://localhost:8000/match";

/**
 * @param {Object} job - Job model instance
 * @param {Array} workers
 */

exports.getMatchScores = async (job, workers) => {
    try {
        // cleans and extracts keywords from Job Title and Description
        const cleanText = (text) => text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/);
        const jobKeywords = `${job.title} ${job.description}`.replace(/[^a-zA-Z ]/g, "").split(" ");

        const jobData = {
            id: job.id,
            skills: [job.category, job.title, job.description],
            location: job.location,
            availability: true
        };

        //fetch ratings and job history for each worker
        const workerCandidates = await Promise.all(workers.map(async (w) => {
            const stats = await Review.findAll({
                where: { revieweeId: w.userId },
                attributes: [[require('../config/db').fn('AVG', require('../config/db').col('rating')), 'avgRating']]
            });
            // count completed jobs
            const completedJobs = await Application.count({
                where: { workerId: w.id, status: 'accepted' }
            });

            return {
                id: w.id,
                skills: w.skills ? w.skills.toLowerCase().split(',').map(s => s.trim()) : [],
                location: w.location || '',
                availability: w.availability,
                rating: parseFloat(stats[0].dataValues.avgRating) || 5.0,
                jobs_completed: completedJobs
            };
        }));

        // sends data to Python AI
        const response = await axios.post(AI_SERVICE_URL, {
            job: jobData,
            workers: workerCandidates
        });

        return response.data;
    } catch (error) {
        console.error("AI Service Connection Failed. Ensure Python server is running on port 8000");
        return null;
    }
};