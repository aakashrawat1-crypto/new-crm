const { getDb } = require('./utils/db');

async function checkSchema() {
    const db = await getDb();

    console.log('--- LEADS SCHEMA ---');
    const info = await db.all('PRAGMA table_info(leads)');
    console.log(JSON.stringify(info, null, 2));

    console.log('\n--- ACCOUNTS SCHEMA ---');
    const accInfo = await db.all('PRAGMA table_info(accounts)');
    console.log(JSON.stringify(accInfo, null, 2));
}

checkSchema().catch(console.error);
