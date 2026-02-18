const { getDb } = require('./utils/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    const db = await getDb();
    const email = 'admin@test.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Checking if user ${email} exists...`);
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!existing) {
        console.log(`Creating user ${email}...`);
        await db.run(
            'INSERT INTO users (id, name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), 'Admin User', email, hashedPassword, 'admin', new Date().toISOString()]
        );
        console.log('User created successfully.');
    } else {
        console.log('User already exists.');
    }
}

seed().catch(console.error);
