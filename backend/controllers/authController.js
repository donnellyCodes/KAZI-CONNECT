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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({ email, password, role, otpCode: otp, otpExpires: otpExpires, isVerified: false });

        // Sub-profile based on role
        if (role === 'worker') {
            await Worker.create({ userId: user.id, ...profileData });
        } else if (role === 'employer') {
            await Employer.create({ userId: user.id, ...profileData });
        }
        console.log(`--- DEBUG: OTP for ${email} is ${otp} ---`);

        res.status(201).json({
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ where: { email, otpCode: otp } });
        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP"});
        }
        user.isVerified = true;
        user.otpCode = null;
        await user.save();
        res.json({ message: "Account verified successfully!"});
    } catch (err) { res.status(500).json({ error: err.message }); }
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
        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};