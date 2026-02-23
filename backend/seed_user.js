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
    const existing = await db.get('SELECT * FROM UserInfo WHERE email = ?', [email]);

    if (!existing) {
        console.log('Fetching admin role ID...');
        let adminRole = await db.get('SELECT id FROM Roles WHERE role_name = ?', ['admin']);
        if (!adminRole) {
            console.log('Admin role not found, creating it...');
            await db.run('INSERT INTO Roles (role_name) VALUES (?)', ['admin']);
            adminRole = await db.get('SELECT id FROM Roles WHERE role_name = ?', ['admin']);
        }

        console.log(`Creating user ${email}...`);
        await db.run(
            'INSERT INTO UserInfo (name, email, password, role_id) VALUES (?, ?, ?, ?)',
            ['Admin User', email, hashedPassword, adminRole.id]
        );

        console.log('Default admin user created successfully.');
    } else {
        console.log('User already exists.');
    }
}

seed().catch(console.error);

module.exports = seed;