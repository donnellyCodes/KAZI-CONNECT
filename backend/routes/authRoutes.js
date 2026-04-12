const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, resendOTP } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;