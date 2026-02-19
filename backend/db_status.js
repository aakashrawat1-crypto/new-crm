const { getDb } = require('./utils/db');
const fs = require('fs');

async function check() {
    try {
        const db = await getDb();
        const contacts = await db.all('SELECT * FROM contacts');
        const leads = await db.all('SELECT * FROM leads');

        const result = {
            contactsCount: contacts.length,
            leadsCount: leads.length,
            contacts: contacts,
            leads: leads
        };

        fs.writeFileSync('db_status_report.json', JSON.stringify(result, null, 2));
        console.log('Report generated in db_status_report.json');
    } catch (e) {
        fs.writeFileSync('db_status_report.json', JSON.stringify({ error: e.message, stack: e.stack }));
        console.error('Check failed:', e);
    }
}

check();
