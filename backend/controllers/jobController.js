const { Application, Job, Employer, Worker, Skill, User, Message } = require('../models');
const { Op } = require('sequelize');
const aiService = require('../services/aiServices');

// @desc for creating a new job
// @route POST /api/jobs
// @access Private for employer only
exports .getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const applications = await Application.findAll({
            where: { jobId },
            include: [
                {
                    model: Worker,
                    attributes: ['id', 'firstName', 'lastName', 'userId'],
                    include: [{ model: User, attributes: ['id', 'email'] }]
                }
            ]
        });

        if (applications.length === 0) return res.json([]);

        const workers = applications.map(app => app.Worker);

        // get scores from the AI
        const aiScores = await aiService.getMatchScores(job, workers);

        // merge the scores
        const rankedApplications = applications.map(app => {
            const appJson = app.toJSON();
            // find scores for a specific worker
            const scoreData = aiScores?.find(s => s.workerId === app.workerId);
            appJson.matchScore = scoreData ? scoreData.matchScore : 0;
            return appJson;
        });

        rankedApplications.sort((a, b) => b.matchScore - a.matchScore);

        res.json(rankedApplications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Update application status (Hire/Reject)
// @route PUT /api/jobs/applications/:id
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByPk(req.params.id, {
            include: [Job]
        });

        if (!application) return res.status(404).json({ message: "Application not found" });

        application.status = status;
        await application.save();

        if (status === 'accepted') {
            const job = await Job.findByPk(application.jobId);
            job.status = 'in-progress'; // shows job is active
            job.hiredWorkerId = application.workerId;
            await job.save();

            // auto-generates "system message" to start chat
            await Message.create({
                senderId: req.user.id, // employer
                receiverId: (await Worker.findByPk(application.workerId)).userId,
                content: `Congratulations! I have hired you for the job: ${job.title}. Let's discuss the details here.`
            });
        }

        res.json({ message: `Worker ${status} successfully.`, application });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.completeJob = async (req, res) => {
    try {
        const job = await Job.findOne({ where: { id: req.params.id, employerId: req.user.id } });
        if (!job) return res.status(404).json({ message: "Job not found" });
        job.status = 'completed';
        await job.save();

        res.json({ message: "Job marked as completed. Please leave a review.", job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyJobs = async (req, res) => {
    try {
        // check if user id is reaching the controller
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // find employer profile linked to the user id
        const employer = await Employer.findOne({ where: { userId: req.user.id } });

        if (!employer) {
            return res.status(404).json({ message: "Employer profile not found" });
        }

        // find all jobs belonging to this employer
        const jobs = await Job.findAll({
            where: { employerId: employer.id },
            order: [['createdAt', 'DESC']]
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const { location, minBudget, search, limit } = req.query;
        const userId = req.user ? req.user.id : null;
        let currentWorkerId = null;
        if (userId) {
            const worker = await Worker.findOne({ where: { userId } });
            if (worker) currentWorkerId = worker.id;
        }

        let whereClause = { status: 'open' };

        // filter by location
        if (location && location.trim() !== "") {
            whereClause.location = { [Op.iLike]: `%${location}%` };
        }

        // filter by Min Budget
        if (minBudget && minBudget !== "") {
            whereClause.budget = { [Op.gte]: parseFloat(minBudget) };
        }

        // search in title or description
        if (search && search.trim() !== "") {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}% `} },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const jobs = await Job.findAll({
            where: whereClause,
            limit : limit ? parseInt(limit) : undefined,
            include: [
                {
                    model: Employer,
                    attributes: ['companyName', 'location']
                },
                {
                    model: Application,
                    required: false,
                    attributes: ['workerId']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        const formattedJobs = jobs.map(job => {
            const jobJson = job.toJSON();
            jobJson.hasApplied = job.Applications.some(app => app.workerId === currentWorkerId);
            delete jobJson.Applications;
            return jobJson;
        })
        res.json(formattedJobs);
    } catch (error) {
        console.error("Getting jobs failed", error);
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
            employerId: employer.id,
            status: 'open'
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

// @desc Get worker stats (Application count, etc.)
// @route GET /api/jobs/worker-stats
exports.getWorkerStats = async (req, res) => {
    try {
        const worker = await Worker.findOne({ where: { userId: req.user.id } });
        if (!worker) return res.json({ totalApplications: 0, acceptedApplications: 0 });

        const total = await Application.count({ where: { workerId: worker.id } });
        const accepted = await Application.count({ where: { workerId: worker.id, status: 'accepted' } });

        res.json({
            totalApplications: total,
            acceptedApplications: accepted
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployerStats = async (req, res) => {
    try {
        const employer = await Employer.findOne({ where: { userId: req.user.id } });
        if (!employer) return res.json({ totalJobs: 0, activeJobs: 0 });

        const totalJobs = await Job.count({ where: { employerId: employer.id } });
        const activeJobs = await Job.count({ where: { employerId: employer.id, status: 'in-progress' } });
        res.json({ totalJobs, activeJobs });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getRecommendedJobs = async (req, res) => {
    try {
        const worker = await Worker.findOne({ where: { userId: req.user.id } });
        if (!worker) return res.json([]);

        let recommendations;
        try {
            const openJobs = await Job.findAll({ where: { status: 'open' } });
            recommendations = await aiService.getMathScores(openJobs[0], [worker]);
        } catch (aiErr) {
            console.log("AI Service offline, falling back to standard list");
        }

        const jobs = await Job.findAll({
            where: { status: 'open'},
            include: [{ model: Employer, attributes: ['companyName'] }]
        });
        res.json(jobs);
    } catch (error) {
        console.error("RECS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};