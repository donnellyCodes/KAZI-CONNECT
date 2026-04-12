const { Review, Job, Payment, Worker, Employer } = require('../models');

exports.createEmployerReview = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { rating, comment } = req.body;

        const employer = await Employer.findOne({ where: { userId: req.user.id } });
        if (!employer) {
            return res.status(404).json({ message: 'Employer profile not found' });
        }

        const job = await Job.findOne({
            where: { id: jobId, employerId: employer.id }
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'completed') {
            return res.status(400).json({ message: 'You can only review after the job is completed.' });
        }

        const payment = await Payment.findOne({ where: { jobId } });
        if (!payment || payment.status !== 'paid') {
            return res.status(400).json({ message: 'Review is only allowed after payment is completed.' });
        }

        if (!job.hiredWorkerId) {
            return res.status(400).json({ message: 'No hired worker found for this job.' });
        }

        const worker = await Worker.findByPk(job.hiredWorkerId);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        const existingReview = await Review.findOne({
            where: {
                jobId,
                reviewerId: req.user.id,
                revieweeId: worker.userId,
                type: 'employer-to-worker'
            }
        });

        if (existingReview) {
            return res.status(400).json({ message: 'Review has already been submitted for this job.' });
        }

        const review = await Review.create({
            jobId,
            reviewerId: req.user.id,
            revieweeId: worker.userId,
            rating,
            comment,
            type: 'employer-to-worker'
        });

        res.status(201).json({
            message: 'Review submitted successfully.',
            review
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviewsForWorker = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: {
                revieweeId: req.params.workerUserId,
                type: 'employer-to-worker'
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
