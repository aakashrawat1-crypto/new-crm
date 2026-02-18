const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/social-login', authController.socialLogin);
router.post('/firebase-login', authController.firebaseLogin);
router.get('/verify', authMiddleware.authenticate, authController.verify);

module.exports = router;
