const { User, Worker, Verification } = require('../models');

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