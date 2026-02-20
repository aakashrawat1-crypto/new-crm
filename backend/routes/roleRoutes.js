const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Protect all routes
router.use(authenticate);

/**
 * 🔹 Create a new role
 * Only admin can create roles
 */
router.post('/', authorize(['admin']), roleController.createRole);

/**
 * 🔹 Get all roles
 * Only admin can view roles
 */
router.get('/', authorize(['admin']), roleController.getAllRoles);

/**
 * 🔹 Get role details by ID
 * Only admin can view role
 */
router.get('/:id', authorize(['admin']), roleController.getRoleById);

/**
 * 🔹 Update a role
 * Only admin can update role
 */
router.put('/:id', authorize(['admin']), roleController.updateRole);

/**
 * 🔹 Delete a role
 * Only admin can delete role
 */
router.delete('/:id', authorize(['admin']), roleController.deleteRole);

module.exports = router;
