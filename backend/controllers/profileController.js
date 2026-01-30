const { Worker, Employer, User } = require('../models');

// @desc Get current user profile
exports.getProfile = async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'worker') {
            profile = await Worker.findOne({ where: { userId: req.user.id } });
        } else {
            profile = await Employer.findOne({ where: { userId: req.user.id } });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Update profile
exports.updateProfile = async (req, res) => {
    try {
        if (req.user.role === 'worker') {
            await Worker.update(req.body, { where: { userId: req.user.id } });
        } else {
            await Employer.update(req.body, { where: { userId: req.user.id } });
        }
        res.json({ message: "Profile updated Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};