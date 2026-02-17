const leadRepository = require('../repositories/leadRepository');
const accountRepository = require('../repositories/accountRepository');
const contactRepository = require('../repositories/contactRepository');
const opportunityRepository = require('../repositories/opportunityRepository');

class LeadService {
    async createLead(leadData, user) {
        try {
            const { companyName, contactName, email, phone, title, description } = leadData;

            // 1. Check if Account exists
            let account = accountRepository.findByName(companyName);

            if (!account) {
                // Create new Account
                account = accountRepository.create({
                    name: companyName,
                    ownerId: user?.id || 'system',
                    status: 'New'
                });
            }

            // 2. Create Contact
            const contact = contactRepository.create({
                accountId: account.id,
                name: contactName,
                email,
                phone,
                title,
                ownerId: user?.id || 'system'
            });

            // 3. Create Opportunity
            const opportunity = opportunityRepository.create({
                accountId: account.id,
                name: `Deal - ${companyName}`,
                stage: 'Prospect',
                value: 0,
                closeDate: null,
                ownerId: user?.id || 'system',
                description
            });

            // 4. Create Lead
            const lead = leadRepository.create({
                companyName,
                contactName,
                email,
                phone,
                status: 'New',
                ownerId: user?.id || 'system',
                accountId: account.id,
                contactId: contact.id,
                opportunityId: opportunity.id
            });

            return { lead, account, contact, opportunity };
        } catch (error) {
            console.error('CRITICAL ERROR in createLead:', error);
            throw error;
        }
    }

    getAllLeads() {
        return leadRepository.getAll();
    }

    getLeadById(id) {
        return leadRepository.getById(id);
    }

    updateLeadStatus(id, status) {
        return leadRepository.update(id, { status });
    }
}

module.exports = new LeadService();
