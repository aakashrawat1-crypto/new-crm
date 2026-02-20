const { getDb } = require('./db');

async function migrate() {
    const db = await getDb();

    console.log('Starting migration...');

    // Drop tables for clean slate (optional, but needed here for schema changes)
    await db.exec('DROP TABLE IF EXISTS revenue');
    await db.exec('DROP TABLE IF EXISTS opportunities');
    await db.exec('DROP TABLE IF EXISTS leads');
    await db.exec('DROP TABLE IF EXISTS contacts');
    await db.exec('DROP TABLE IF EXISTS accounts');
    await db.exec('DROP TABLE IF EXISTS products');
    await db.exec('DROP TABLE IF EXISTS users');


    // Roles table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT
    )
    `);


    // Users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        createdAt TEXT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        roleId TEXT,
        FOREIGN KEY (roleId) REFERENCES roles(id)
        )
    `);


    // Accounts table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            createdAt TEXT,
            name TEXT UNIQUE COLLATE NOCASE,
            industry TEXT,
            website TEXT,
            ownerId TEXT,
            FOREIGN KEY (ownerId) REFERENCES users(id)
        )
    `);

    // Leads table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            createdAt TEXT,
            fullName TEXT,
            jobTitle TEXT,
            organizationName TEXT,
            email TEXT,
            mobile TEXT,
            officePhone TEXT,
            leadSource TEXT,
            status TEXT,
            ownerId TEXT,
            accountId TEXT,
            FOREIGN KEY (ownerId) REFERENCES users(id),
            FOREIGN KEY (accountId) REFERENCES accounts(id)
        )
    `);

    // Opportunities table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS opportunities (
            id TEXT PRIMARY KEY,
            createdAt TEXT,
            leadId TEXT UNIQUE,
            accountId TEXT,
            dealDetail TEXT,
            git TEXT,
            pmChecklist TEXT,
            qbrNotes TEXT,
            internalNotes TEXT,
            productIds TEXT,
            stage TEXT,
            expectedCloseDate TEXT,
            ownerId TEXT,
            updatedAt TEXT,
            FOREIGN KEY (leadId) REFERENCES leads(id),
            FOREIGN KEY (accountId) REFERENCES accounts(id),
            FOREIGN KEY (ownerId) REFERENCES users(id)
        )
    `);

    // Revenue table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS revenue (
            id TEXT PRIMARY KEY,
            createdAt TEXT,
            opportunityId TEXT UNIQUE,
            amount REAL,
            status TEXT,
            closeDate TEXT,
            lossReason TEXT,
            FOREIGN KEY (opportunityId) REFERENCES opportunities(id)
        )
    `);

    // Contacts table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            createdAt TEXT,
            name TEXT,
            email TEXT,
            phone TEXT,
            title TEXT,
            status TEXT DEFAULT 'Active',
            leadId TEXT,
            ownerId TEXT,
            accountId TEXT,
            FOREIGN KEY (leadId) REFERENCES leads(id),
            FOREIGN KEY (ownerId) REFERENCES users(id),
            FOREIGN KEY (accountId) REFERENCES accounts(id)
        )
    `);

    // Products table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            createdAt TEXT,
            name TEXT,
            description TEXT,
            price REAL,
            createdBy TEXT,
            FOREIGN KEY (createdBy) REFERENCES users(id)
        )
    `);

    console.log('Migration completed successfully.');
}

if (require.main === module) {
    migrate().catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
}

module.exports = { migrate };
