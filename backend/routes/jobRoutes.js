const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById } = require('../controllers/jobController');
const { applyForJob } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// job routes
router.post('/', protect, authorize('employer'), createJob); // only employers can post
router.get('/', getAllJobs); // everyone can see jobs
router.get('/:id', getJobById);

// application routes
router.post('/:jobId/apply', protect, authorize('worker'), applyForJob); // only workers can apply

router.get('/:jobId/applications', protect, authorize('employer'), getJobApplications);
router.put('/applications/:id', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;