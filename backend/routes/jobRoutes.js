const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, getMyJobs, getEmployerStats, getJobApplications, getWorkerStats, getRecommendedJobs, updateApplicationStatus, completeJob } = require('../controllers/jobController');
const { applyForJob } = require('../controllers/applicationController');
const { getContactInfo } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');

// job routes
router.post('/', protect, authorize('employer'), createJob); // only employers can post
// application routes
router.post('/:jobId/apply', protect, authorize('worker'), applyForJob); // only workers can apply

router.get('/my-jobs', protect, authorize('employer'), getMyJobs);
router.get('/employer-stats', protect, authorize('employer'), getEmployerStats);
router.get('/worker-stats', protect, authorize('worker'), getWorkerStats);
router.get('/recommendations', protect, authorize('worker'), getRecommendedJobs);

router.get('/contact-info/:userId', protect, getContactInfo);

router.get('/:jobId/applicants', protect, getJobApplications);

router.get('/', protect, getAllJobs); // everyone can see jobs
router.get('/:id', getJobById);
router.put('/:id/complete', protect, authorize('employer'), completeJob);
router.put('/applications/:id', protect, authorize('employer'), updateApplicationStatus);


module.exports = router;