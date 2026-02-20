const roleService = require('../services/roleService');

const roleController = {

    // 🔹 Create a new role
    async createRole(req, res) {
        try {
            const { id, name, description } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Role name is required' });
            }

            const role = await roleService.createRole({ id, name, description });

            res.status(201).json({
                message: 'Role created successfully',
                role
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // 🔹 Get all roles
    async getAllRoles(req, res) {
        try {
            const roles = await roleService.getAllRoles();
            res.status(200).json({ roles });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 🔹 Get role by ID
    async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const role = await roleService.getRoleById(id);
            res.status(200).json({ role });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    // 🔹 Update a role
    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const updatedRole = await roleService.updateRole(id, { name, description });

            res.status(200).json({
                message: 'Role updated successfully',
                role: updatedRole
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // 🔹 Delete a role
    async deleteRole(req, res) {
        try {
            const { id } = req.params;
            const result = await roleService.deleteRole(id);

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

};

module.exports = roleController;
