const { Application, Worker, Job } = require('../models');

// @desc Apply for a job
// @route POST /api/jobs/:jobId/apply
// @access Private for Worker only
exports.applyForJob = async (req, res) => {
    try {
        const { proposal } = req.body;
        const { jobId } = req.params;

        // find worker profile
        const worker = await Worker.findOne({ where: {userId: req.user.id } });
        if (!worker) {
            return res.status(404).json({ message: "Worker profile not found" });
        }

        // checks if job exists and is open
        const job = await Job.findByPk(jobId);
        if (!job || job.status !== 'open') {
            return res.status(400).json({ message: "Job is no longer accepting applications" });
        }

        // prevent duplicate applications
        const existingApp = await Application.findOne({
            where: { jobId, workerId: worker.id }
        });
        if (existingApp) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        // create application
        const application = await Application.create({
            proposal,
            jobId,
            workerId: worker.id
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};