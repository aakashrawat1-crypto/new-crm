const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function getDb() {
    if (db) return db;

    db = await open({
        filename: path.join(__dirname, '../data/crm.db'),
        driver: sqlite3.Database
    });

    await db.exec('PRAGMA busy_timeout = 5000');

    return db;
}

module.exports = { getDb };
