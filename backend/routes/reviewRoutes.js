const express = require('express');
const router = express.Router();
const { createEmployerReview, getReviewsForWorker } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/worker/:workerUserId', getReviewsForWorker);
router.post('/:jobId', protect, authorize('employer'), createEmployerReview);

module.exports = router;
