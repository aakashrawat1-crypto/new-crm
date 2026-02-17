const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', contactController.createContact);
router.get('/', contactController.getContacts);
router.put('/:id', contactController.updateContact);

module.exports = router;
