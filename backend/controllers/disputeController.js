const { Dispute, Job, User } = require('../models');

exports.createDispute = async (req, res) => {
    try {
        const { jobId, reason, description } = req.body;
        const dispute = await Dispute.create({
            jobId,
            reason,
            description,
            userId: req.user.id
        });
        res.status(201).json(dispute);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.findAll({
            include: [Job, User]
        });
        res.json(disputes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};