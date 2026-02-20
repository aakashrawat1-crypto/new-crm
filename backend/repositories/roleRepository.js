const { getDb } = require('../utils/db');

// Role Repository: CRUD operations for roles table
const roleRepository = {
    // Create a new role
    async createRole({ id, name, description }) {
        const db = await getDb();
        await db.run(
            'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
            [id, name, description]
        );
        return { id, name, description };
    },

    // Get role by ID
    async getRoleById(id) {
        const db = await getDb();
        return db.get('SELECT * FROM roles WHERE id = ?', [id]);
    },

    // Get role by name
    async getRoleByName(name) {
        const db = await getDb();
        return db.get('SELECT * FROM roles WHERE name = ?', [name]);
    },

    // List all roles
    async getAllRoles() {
        const db = await getDb();
        return db.all('SELECT * FROM roles');
    },

    // Update role
    async updateRole(id, { name, description }) {
        const db = await getDb();
        await db.run(
            'UPDATE roles SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return this.getRoleById(id);
    },

    // Delete role
    async deleteRole(id) {
        const db = await getDb();
        await db.run('DELETE FROM roles WHERE id = ?', [id]);
        return true;
    }
};

module.exports = roleRepository;