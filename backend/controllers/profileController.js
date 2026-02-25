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
        const userId = req.user.id;
        const { firstName, lastName, location, availability, skills, experience } = req.body;
        const role = req.user.role;

        if (role === 'worker') {
            await Worker.update({firstName, lastName, location, availability, skills, experience}, { where: { userId: req.user.id } });
            // fetch the freshly updated data to send back to frontend
            const updatedProfile = await Worker.findOne({ where: { userId } });
            return res.json(updatedProfile);
        }
        if (role === 'employer') {
            await Employer.update(req.body, { where: { userId: req.user.id } });
            const updatedProfile = await Employer.findOne({ where: { userId } });
            return res.json(updatedProfile);
        }
        res.json({ message: "Profile updated Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [
                { model: Worker, attributes: ['firstName', 'lastName'] },
                { model: Employer, attributes: ['companyName'] }
            ]
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            id: user.id,
            role: user.role,
            name: user.role === 'worker' ? `${user.Worker?.firstName} ${user.Worker?.lastName}` : user.Employer?.companyName
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};