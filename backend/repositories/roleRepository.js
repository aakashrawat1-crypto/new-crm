const { getDb } = require('../utils/db');

// Role Repository: CRUD operations for Roles table
const roleRepository = {
    // Create a new role
    async createRole({ name }) {
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO Roles (role_name) VALUES (?)',
            [name]
        );
        return { id: result.lastID, name };
    },

    // Get role by ID
    async getRoleById(id) {
        const db = await getDb();
        return db.get('SELECT id, role_name as name FROM Roles WHERE id = ?', [id]);
    },

    // Get role by name
    async getRoleByName(name) {
        const db = await getDb();
        return db.get('SELECT id, role_name as name FROM Roles WHERE role_name = ?', [name]);
    },

    // List all roles
    async getAllRoles() {
        const db = await getDb();
        return db.all('SELECT id, role_name as name FROM Roles');
    },

    // Update role
    async updateRole(id, { name }) {
        const db = await getDb();
        await db.run(
            'UPDATE Roles SET role_name = ? WHERE id = ?',
            [name, id]
        );
        return this.getRoleById(id);
    },

    // Delete role
    async deleteRole(id) {
        const db = await getDb();
        await db.run('DELETE FROM Roles WHERE id = ?', [id]);
        return true;
    }
};

module.exports = roleRepository;