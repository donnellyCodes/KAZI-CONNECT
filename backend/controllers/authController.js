// Handles registration and login logic

const { User, Worker, Employer } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '90d' });
};

exports.register = async (req, res) => {
    const { email, password, role, profileData } = req.body;
    try {
        const user = await User.create({ email, password, role });

        // Sub-profile based on role
        if (role === 'worker') {
            await Worker.create({ userId: user.id, ...profileData });
        } else if (role === 'employer') {
            await Employer.create({ userId: user.id, ...profileData });
        }

        res.status(201).json({
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password)))
        {
            res.json({
                token: generateToken(user.id, user.role),
                user: { id: user.id, role: user.role }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};