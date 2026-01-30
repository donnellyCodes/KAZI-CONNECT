const { Application, Job, Employer, Skill, User } = require('../models');
const { Op } = require('sequelize');

// @desc for creating a new job
// @route POST /api/jobs
// @access Private for employer only
exports .getJobApplication = async (req, res) => {
    try {
        const { jobId } = req.params;

        // ensure the job belongs to the requesting employer
        const job = await Job.findOne({ where: { if: jobId, employerId: req.user.id } });

        const applications = await Application.findAll({
            where: { jobId },
            include: [
                {
                    model: Worker,
                    include: [{ model: User, attributes: ['email'] }]
                }
            ]
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Update application status (Hire/Reject)
// @route PUT /api/jobs/applications/:id
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByPk(req.params.id);

        if (!application) return res.status(404).json({ message: "Application not found" });

        application.status = status;
        await application.save();

        res.json({ message: `Application ${status}`, application });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const { location, minBudget, search } = req.query;
        let whereClause = { status: 'Open' };

        // filter by location
        if (location) whereClause.location = { [Op.iLike]: `%${location}%` };

        // filter by Min Budget
        if (minBudget) whereClause.budget = { [Op.gte]: minBudget };

        // search in title or description
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}% `} },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }
        const jobs = await Job.findAll({
            where: whereClause,
            include: [{ model: Employer, attributes: ['companyName', 'location'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const { title, description, location, budget, skillIds } = req.body;

        // find employer profile linked to the userid
        const employer = await Employer.findOne({ where: { userId: req.user.id } });
        if (!employer) {
            return res.status(404).json({ message: "Employer profile not found" });
        }

        // create job
        const job = await Job.create({
            title,
            description,
            location,
            budget,
            employerId: employer.id
        });

        // link skills to the job
        if (skillIds && skillIds.length > 0) {
            await job.setSkills(skillIds);
        }
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// @desc GET single job details
// @route GET /api/jobs/:id
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id, {
            include: [
                { model: Employer, attributes: ['companyName', 'location'] },
                { model: Skill, through: { attributes: [] } }
            ]
        });
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};