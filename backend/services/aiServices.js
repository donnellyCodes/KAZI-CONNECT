const axios = require('axios');
const { Worker, Job, Review, Application } = require('../models');
const { Op } = require('sequelize');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL ||"http://localhost:8000/match";

/**
 * @param {Object} job - Job model instance
 * @param {Array} workers
 */

exports.getMatchScores = async (job, workers) => {
    try {
        const sanitizeSkillList = (values) =>
            values
                .filter((value) => typeof value === 'string')
                .map((value) => value.trim())
                .filter(Boolean);

        const jobSkillNames = Array.isArray(job.Skills)
            ? job.Skills.map((skill) => skill?.name)
            : [];

        const jobData = {
            id: String(job.id),
            skills: sanitizeSkillList([job.category, job.title, job.description, ...jobSkillNames]),
            location: job.location || '',
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
                id: String(w.id),
                skills: sanitizeSkillList(
                    [
                        ...(w.skills ? w.skills.toLowerCase().split(',').map(s => s.trim()) : []),
                        w.customSkill
                    ]
                ),
                location: w.location || '',
                availability: w.availability !== false,
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
        const details = error.response?.data || error.message;
        console.error("AI Service request failed:", details);
        return null;
    }
};
