const express = require('express');
const router = express.Router();
const { initiatePayment, getPaymentByJob, handleMpesaCallback } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/callback', handleMpesaCallback);
router.post('/initiate/:jobId', protect, authorize('employer'), initiatePayment);
router.get('/job/:jobId', protect, getPaymentByJob);

module.exports = router;
