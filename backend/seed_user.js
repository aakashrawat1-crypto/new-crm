const { getDb } = require('./utils/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    const db = await getDb();
    const email = process.env.ADMIN_EMAIL || 'admin@test.com';
    const password = process.env.ADMIN_PASSWORD || 'password123';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Checking if user ${email} exists...`);
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!existing) {
        console.log('Fetching admin role ID...');
        const adminRole = await db.get('SELECT id FROM roles WHERE name = ?', ['admin']);
        if (!adminRole) throw new Error('Admin role not found');

        console.log(`Creating user ${email}...`);
        await db.run(
            'INSERT INTO users (id, name, email, password, roleId, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), 'Admin User', email, hashedPassword, adminRole.id, new Date().toISOString()]
        );

        console.log('Default admin user created successfully.');
    } else {
        console.log('User already exists.');
    }
}

seed().catch(console.error);

module.exports = seed;