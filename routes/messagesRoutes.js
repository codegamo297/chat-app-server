const { addMessage, getAllMessages } = require('../controllers/messageController');

const router = require('express').Router();

// Create account
router.post('/addmsg/', addMessage);
// Create account
router.post('/getmsg/', getAllMessages);

module.exports = router;
