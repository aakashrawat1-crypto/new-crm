const { getDb } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');
const accountRepository = require('../repositories/accountRepository');
const contactRepository = require('../repositories/contactRepository');
const subAccountRepository = require('../repositories/subAccountRepository');
const leadRepository = require('../repositories/leadRepository');
const opportunityRepository = require('../repositories/opportunityRepository');

class UpsertService {
    async upsertHierarchy(payload, user) {
        const db = await getDb();
        const ownerId = user?.id || 'system';
        const timestamp = new Date().toISOString();

        // Start Transaction
        await db.run('BEGIN TRANSACTION');

        try {
            // 1. Account Upsert
            let accountId;
            if (payload.account) {
                let account = await accountRepository.findByName(payload.account.name);
                if (!account) {
                    const newAccount = {
                        id: uuidv4(),
                        name: payload.account.name,
                        industry: payload.account.industry || 'Other',
                        website: payload.account.website || '',
                        ownerId: ownerId,
                        createdAt: timestamp
                    };
                    await db.run(
                        `INSERT INTO accounts (id, name, industry, website, ownerId, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
                        [newAccount.id, newAccount.name, newAccount.industry, newAccount.website, newAccount.ownerId, newAccount.createdAt]
                    );
                    accountId = newAccount.id;
                } else {
                    accountId = account.id;
                }
            }

            // 2. Sub_Account Upsert (Child of Account)
            let subAccountId = null;
            if (payload.sub_account && accountId) {
                let subAccount = await subAccountRepository.findByName(payload.sub_account.name, accountId);
                if (!subAccount) {
                    const newSubAccount = {
                        id: uuidv4(),
                        accountId: accountId,
                        name: payload.sub_account.name,
                        ownerId: ownerId,
                        createdAt: timestamp
                    };
                    await db.run(
                        `INSERT INTO sub_accounts (id, accountId, name, ownerId, createdAt) VALUES (?, ?, ?, ?, ?)`,
                        [newSubAccount.id, newSubAccount.accountId, newSubAccount.name, newSubAccount.ownerId, newSubAccount.createdAt]
                    );
                    subAccountId = newSubAccount.id;
                } else {
                    subAccountId = subAccount.id;
                }
            }

            // 3. Contact Upsert (Child of Account)
            let contactId = null;
            if (payload.contact && accountId) {
                let contact = await contactRepository.findByEmail(payload.contact.email);
                if (!contact) {
                    const newContact = {
                        id: uuidv4(),
                        accountId: accountId,
                        name: payload.contact.name || 'Unknown',
                        email: payload.contact.email,
                        phone: payload.contact.phone || '',
                        title: payload.contact.title || '',
                        ownerId: ownerId,
                        createdAt: timestamp
                    };
                    await db.run(
                        `INSERT INTO contacts (id, accountId, name, email, phone, title, ownerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [newContact.id, newContact.accountId, newContact.name, newContact.email, newContact.phone, newContact.title, newContact.ownerId, newContact.createdAt]
                    );
                    contactId = newContact.id;
                } else {
                    contactId = contact.id;
                    // Optionally update accountId if it was different? User didn't specify.
                }
            }

            // 4. Lead Upsert (Child of Account)
            let leadId = null;
            if (payload.lead && accountId) {
                let lead = await leadRepository.findByFullName(payload.lead.fullName);
                if (!lead) {
                    const newLead = {
                        id: uuidv4(),
                        accountId: accountId,
                        fullName: payload.lead.fullName,
                        email: payload.lead.email || '',
                        status: payload.lead.status || 'New',
                        ownerId: ownerId,
                        createdAt: timestamp
                    };
                    await db.run(
                        `INSERT INTO leads (id, accountId, fullName, email, status, ownerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [newLead.id, newLead.accountId, newLead.fullName, newLead.email, newLead.status, newLead.ownerId, newLead.createdAt]
                    );
                    leadId = newLead.id;
                } else {
                    leadId = lead.id;
                }
            }

            // 5. Opportunity Insertion (Child of all)
            let opportunity = null;
            if (payload.opportunity) {
                const newOpp = {
                    id: uuidv4(),
                    accountId: accountId || null,
                    subAccountId: subAccountId || null,
                    contactId: contactId || null,
                    leadId: leadId || null,
                    name: payload.opportunity.name || 'New Opportunity',
                    amount: payload.opportunity.amount || 0,
                    stage: payload.opportunity.stage || 'Discovery',
                    ownerId: ownerId,
                    createdAt: timestamp
                };

                // Note: The user specified exact foreign keys in the prompt. 
                // Handling NULLs safely for Sub-Account or Lead.
                await db.run(
                    `INSERT INTO opportunities (id, accountId, subAccountId, contactId, leadId, dealDetail, stage, ownerId, createdAt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [newOpp.id, newOpp.accountId, newOpp.subAccountId, newOpp.contactId, newOpp.leadId, newOpp.name, newOpp.stage, newOpp.ownerId, newOpp.createdAt]
                );
                opportunity = newOpp;
            }

            // Commit Transaction
            await db.run('COMMIT');

            return {
                accountId,
                subAccountId,
                contactId,
                leadId,
                opportunity
            };

        } catch (error) {
            // Rollback on any failure
            await db.run('ROLLBACK');
            console.error('Upsert transaction failed, rolled back:', error);
            throw error;
        }
    }
}

module.exports = new UpsertService();
