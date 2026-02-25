const { User, Worker, Job, Payment, Verification } = require('../models');

// @desc  Get all users for admin only
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ include: [Worker] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @ desc  Verify or reject worker
exports.verifyWorker = async (req, res) => {
    const { workerId, status } = req.body;
    try {
        const worker = await Worker.findByPk(workerId);
        if (!worker) return res.status(404).json({ message: "Worker not found" });
        worker.isVerified = (status === 'verified');
        await worker.save();
        res.json({ message: `Worker status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSystemStats = async (req, res) => {
    const userCount = await User.count();
    const jobCount = await Job.count();
    const pendingVerifications = await Worker.count({ where: { isVerified: false } });
    res.json({ userCount, jobCount, pendingVerifications });
}

exports.getAdminStats = async (req, res) => {
    try {
        // total workers
        const totalWorkers = await Worker.count();

        // active jobs: open + in-progress
        const activeJobs = await Job.count({
            where: { status: ['open', 'in-progress'] }
        });

        // escrow: sum of all money currently held in the system
        const escrowVolume = await Payment.sum('amount', {
            where: { status: 'escrowed' }
        }) || 0;

        // pending disputes
        const pendingDisputes = await Job.count({
            where: { status: 'disputed' }
        });

        res.json({
            totalWorkers,
            activeJobs,
            escrowVolume,
            pendingDisputes
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ error: error.message });
    }
};