const { Application, Job, Employer, Worker, Skill, User, Message } = require('../models');
const { Op } = require('sequelize');

// @desc for creating a new job
// @route POST /api/jobs
// @access Private for employer only
exports .getJobApplications = async (req, res) => {
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
        const { location, minBudget, search } = req.query;
        let userId = null;
        let workerId = null;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;

                const worker = await Worker.findOne({ where: { userId } });
                workerId = worker ? worker.id : null;
            } catch (err) {

            }
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
            include: [
                {
                    model: Employer,
                    attributes: ['companyName', 'location']
                },
                {
                    model: Application,
                    required: false,
                    attributes: ['id', 'workerId']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        const formattedJobs = jobs.map(job => {
            const jobJson = job.toJSON();
            jobJson.hasApplied = workerId ? job.Applications.some(app => app.workerId === workerId) : false;
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