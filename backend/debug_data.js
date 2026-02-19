const contactService = require('./services/contactService');
const { getDb } = require('./utils/db');

async function debug() {
    try {
        console.log('--- Checking DB directly ---');
        const db = await getDb();
        const contactsRaw = await db.all('SELECT * FROM contacts');
        const leadsRaw = await db.all('SELECT * FROM leads');
        console.log('Raw Contacts count:', contactsRaw.length);
        console.log('Raw Leads count:', leadsRaw.length);

        console.log('\n--- Checking Unified Contacts ---');
        const unified = await contactService.getContacts();
        console.log('Unified Contacts count:', unified.length);
        console.log('First 2 items:', JSON.stringify(unified.slice(0, 2), null, 2));
    } catch (e) {
        console.error('Debug failed:', e);
    }
}

debug();
