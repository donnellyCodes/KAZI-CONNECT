const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { getAllUsers, verifyWorker } = require('../controllers/adminController');
const { getAdminStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.put('/admin/verify', protect, authorize('admin'), verifyWorker);

// file upload routes for worker documents
router.post('/upload-cv', protect, authorize('worker'), upload.single('cv'), (req, res) => {
    console.log('CV upload successful for user:', req.user.id);
    res.json({ message: "CV uploaded successfully", url: req.file.path });
});

router.post('/upload-id', protect, authorize('worker'), upload.single('idDocument'), (req, res) => {
    console.log('ID upload successful for user:', req.user.id);
    res.json({ message: "ID uploaded successfully", url: req.file.path });
});

module.exports = router;