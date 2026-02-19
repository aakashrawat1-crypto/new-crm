/**
 * Seed script: Backfill existing leads into the contacts table.
 * Run this ONCE after migration to populate contacts from any leads
 * that were created before the auto-sync was added.
 */
const { getDb } = require('./utils/db');
const { v4: uuidv4 } = require('uuid');

async function seedContactsFromLeads() {
    const db = await getDb();

    // Ensure the contacts table has the new columns
    try {
        await db.run('ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT "Active"');
    } catch (e) {
        // Column already exists, ignore
    }
    try {
        await db.run('ALTER TABLE contacts ADD COLUMN leadId TEXT');
    } catch (e) {
        // Column already exists, ignore
    }

    const leads = await db.all('SELECT * FROM leads');
    console.log(`Found ${leads.length} leads to backfill into contacts.`);

    let created = 0;
    for (const lead of leads) {
        // Check if a contact already exists for this lead
        const existing = await db.get('SELECT id FROM contacts WHERE leadId = ?', [lead.id]);
        if (existing) {
            console.log(`  Skipping lead ${lead.id} (${lead.fullName}) — contact already exists.`);
            continue;
        }

        const contactId = uuidv4();
        await db.run(
            `INSERT INTO contacts (id, createdAt, name, email, phone, title, status, leadId, ownerId, accountId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                contactId,
                lead.createdAt || new Date().toISOString(),
                lead.fullName || 'Unknown',
                lead.email || '',
                lead.mobile || lead.officePhone || '',
                lead.jobTitle || 'Prospect',
                lead.status || 'New',
                lead.id,
                lead.ownerId || 'system',
                lead.accountId || null
            ]
        );
        console.log(`  Created contact ${contactId} for lead ${lead.id} (${lead.fullName})`);
        created++;
    }

    console.log(`\nDone. Created ${created} new contact(s) from ${leads.length} lead(s).`);
}

seedContactsFromLeads().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
