const express = require('express');
const router = express.Router();
const { createDispute, getAllDisputes } = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createDispute);
router.get('/', protect, authorize('admin'), getAllDisputes);

module.exports = router;