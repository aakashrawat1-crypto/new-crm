const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function getDb() {
    if (db) return db;

    const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/crm.db');
    console.log('Connecting to database at:', dbPath);

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec('PRAGMA busy_timeout = 5000');

    // Enable foreign keys for SQLite so CASCADE triggers correctly
    await db.exec('PRAGMA foreign_keys = ON');

    return db;
}

module.exports = { getDb };
