// Handles registration and login logic
const { User, Worker, Employer } = require('../models');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, jwtSecret, { expiresIn: '90d' });
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

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp);
        
        if (!emailResult.success) {
            return res.status(500).json({ 
                message: 'Registration successful but failed to send verification email',
                error: emailResult.error 
            });
        }

        console.log(`--- DEBUG: OTP for ${email} is ${otp} ---`);

        res.status(201).json({
            message: 'Registration successful! Please check your email for verification code.',
            user: { id: user.id, email: user.email, role: user.role },
            needsVerification: true
        });
    } catch (err) {
        console.error('Registration error: ', err.message);
        console.error('Full error: ', err.errors);
        res.status(500).json({
            error: 'Validation error',
            details: err.errors?.map(e => e.message)
        });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ where: { email, otpCode: otp } });
        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        user.isVerified = true;
        user.otpCode = null;
        await user.save();
        
        // Send welcome email
        const profile = user.role === 'worker' 
            ? await Worker.findOne({ where: { userId: user.id } })
            : await Employer.findOne({ where: { userId: user.id } });
            
        if (profile) {
            await sendWelcomeEmail(email, profile.firstName || profile.companyName);
        }
        
        res.json({ 
            message: "Account verified successfully!",
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified" });
        }
        
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        
        // Update user with new OTP
        user.otpCode = otp;
        user.otpExpires = otpExpires;
        await user.save();
        
        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp);
        
        if (!emailResult.success) {
            return res.status(500).json({ 
                message: 'Failed to send verification email',
                error: emailResult.error 
            });
        }
        
        console.log(`--- DEBUG: New OTP for ${email} is ${otp} ---`);
        
        res.json({
            message: 'Verification code sent successfully!',
            needsVerification: true
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }
        
        if (user && (await bcrypt.compare(password, user.password)))
        {
            res.json({
                token: generateToken(user.id, user.role),
                user: { id: user.id, role: user.role, email: user.email }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
