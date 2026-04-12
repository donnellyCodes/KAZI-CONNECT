// maps URLs to controller functions

const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// all message routes require login
router.use(protect);

router.post('/send', sendMessage);
router.get('/conversation/:otherUserId', getMessages);
router.get('/conversations/list', getConversations);

module.exports = router;