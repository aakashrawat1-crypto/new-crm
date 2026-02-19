const fs = require('fs');
const path = require('path');
const { getDb } = require('./utils/db');

async function importContacts() {
    const db = await getDb();

    const storePath = path.join(__dirname, 'data', 'store.json');
    const raw = fs.readFileSync(storePath, 'utf8');
    const store = JSON.parse(raw);

    // Add optional columns if they don't exist in contacts table
    try { await db.run('ALTER TABLE contacts ADD COLUMN revenue REAL'); } catch (e) {}
    try { await db.run('ALTER TABLE contacts ADD COLUMN closedWonRevenue REAL'); } catch (e) {}
    try { await db.run('ALTER TABLE contacts ADD COLUMN updatedAt TEXT'); } catch (e) {}

    const contacts = store.contacts || [];
    console.log(`Found ${contacts.length} contact(s) in store.json`);

    let created = 0;
    for (const c of contacts) {
        const exists = await db.get('SELECT id FROM contacts WHERE id = ?', [c.id]);
        if (exists) continue;

        await db.run(
            `INSERT INTO contacts (id, createdAt, name, email, phone, title, status, leadId, ownerId, accountId, revenue, closedWonRevenue, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                c.id,
                c.createdAt || new Date().toISOString(),
                c.name || c.contactName || 'Unknown',
                c.email || '',
                c.phone || '',
                c.title || '',
                c.status || 'Active',
                c.leadId || c.contactId || null,
                c.ownerId || null,
                c.accountId || null,
                c.revenue ? Number(c.revenue) : null,
                c.closedWonRevenue ? Number(c.closedWonRevenue) : null,
                c.updatedAt || null
            ]
        );
        created++;
    }

    console.log(`Imported ${created} contact(s) into the database.`);
}

if (require.main === module) {
    importContacts().catch(err => {
        console.error('Import failed:', err);
        process.exit(1);
    });
}

module.exports = { importContacts };
