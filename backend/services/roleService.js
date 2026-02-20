const roleRepository = require('../repositories/roleRepository');

const roleService = {

    // Create Role
    async createRole({ id, name, description }) {

        if (!name) {
            throw new Error('Role name is required');
        }

        // Check if role already exists
        const existingRole = await roleRepository.getRoleByName(name);
        if (existingRole) {
            throw new Error('Role already exists');
        }

        return await roleRepository.createRole({
            id,
            name,
            description: description || null
        });
    },

    // Get Role By ID
    async getRoleById(id) {

        if (!id) {
            throw new Error('Role ID is required');
        }

        const role = await roleRepository.getRoleById(id);

        if (!role) {
            throw new Error('Role not found');
        }

        return role;
    },

    // Get Role By Name
    async getRoleByName(name) {

        if (!name) {
            throw new Error('Role name is required');
        }

        const role = await roleRepository.getRoleByName(name);

        if (!role) {
            throw new Error('Role not found');
        }

        return role;
    },

    // Get All Roles
    async getAllRoles() {
        return await roleRepository.getAllRoles();
    },

    // Update Role
    async updateRole(id, { name, description }) {

        if (!id) {
            throw new Error('Role ID is required');
        }

        const existingRole = await roleRepository.getRoleById(id);

        if (!existingRole) {
            throw new Error('Role not found');
        }

        // Prevent duplicate name
        if (name) {
            const roleWithSameName = await roleRepository.getRoleByName(name);
            if (roleWithSameName && roleWithSameName.id !== id) {
                throw new Error('Another role with this name already exists');
            }
        }

        return await roleRepository.updateRole(id, {
            name: name || existingRole.name,
            description: description || existingRole.description
        });
    },

    // Delete Role
    async deleteRole(id) {

        if (!id) {
            throw new Error('Role ID is required');
        }

        const role = await roleRepository.getRoleById(id);
        if (!role) {
            throw new Error('Role not found');
        }

        const db = await require('../utils/db').getDb();
        const usersUsingRole = await db.get(
            'SELECT COUNT(*) as count FROM users WHERE roleId = ?',
            [id]
        );

        if (usersUsingRole.count > 0) {
            throw new Error('Cannot delete role assigned to users');
        }

        await roleRepository.deleteRole(id);

        return { message: 'Role deleted successfully' };
    }

};

module.exports = roleService;





