const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getNotify, updateNotification} = require('../controllers/messageController')

const router = express.Router()

router.route('/')
.get(protect, getNotify)
.put(protect, updateNotification)
module.exports = router;
