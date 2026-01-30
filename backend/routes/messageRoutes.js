// maps URLs to controller functions

const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// all message routes require login
router.use(protect);

router.post('/', sendMessage);
router.get('/conversations/list', getConversations);
router.get('/:otherUserId', getMessages);

module.exports = router;