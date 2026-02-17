const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);

module.exports = router;
