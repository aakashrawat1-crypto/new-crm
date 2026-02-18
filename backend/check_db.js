const { getDb } = require('./utils/db');

async function check() {
    const db = await getDb();

    console.log('--- ACCOUNTS ---');
    const accounts = await db.all('SELECT * FROM accounts');
    console.log(JSON.stringify(accounts, null, 2));

    console.log('\n--- LEADS ---');
    const leads = await db.all('SELECT * FROM leads');
    console.log(JSON.stringify(leads, null, 2));

    console.log('\n--- OPPORTUNITIES ---');
    const opps = await db.all('SELECT * FROM opportunities');
    console.log(JSON.stringify(opps, null, 2));
}

check().catch(console.error);
