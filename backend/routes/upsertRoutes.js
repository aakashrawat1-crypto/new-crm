const express = require('express');
const router = express.Router();
const upsertController = require('../controllers/upsertController');
const { authenticate } = require('../middleware/authMiddleware');

// Route for external webhooks or frontend upsert
// Removing authenticate for external webhook if needed, but keeping it for security per default practices
router.post('/', authenticate, upsertController.upsertData);

module.exports = router;
