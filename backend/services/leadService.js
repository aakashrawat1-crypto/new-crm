const leadRepository = require('../repositories/leadRepository');
const opportunityRepository = require('../repositories/opportunityRepository');
const contactRepository = require('../repositories/contactRepository');
const accountService = require('./accountService');

class LeadService {
    async createLead(leadData, user) {
        const {
            fullName,
            organizationName,
            jobTitle,
            email,
            mobile,
            officePhone,
            leadSource,
            description
        } = leadData;

        try {
            // 0. Get or Create Account based on Organization Name
            console.log('LeadService: Getting or creating account for:', organizationName);
            const account = await accountService.getOrCreateAccount(organizationName, user);
            const accountId = account ? account.id : null;
            console.log('LeadService: Account obtained:', accountId);

            // 1. Create Lead
            console.log('LeadService: Creating lead with accountId:', accountId);
            const lead = await leadRepository.create({
                Customer_Name: fullName || 'Unknown Lead',
                Account_ID: accountId,
                Customer_Email: email || '',
                Department: '',
                Account: organizationName || '',
                Sales_Manager: '',
                Delivery_Manager: '',
                Lead_Type: leadSource || 'Other',
                Status: 'New',
                Contract_Type: '',
                LastModified_By: user?.name || 'system'
            });
            console.log('LeadService: Lead created:', lead.id, 'with Account_ID:', accountId);

            // 2. Create Opportunity linked to the Lead AND Account (Leaving dummy objects due to existing relationships)
            const opportunity = await opportunityRepository.create({
                leadId: lead.id,
                accountId: accountId,
                dealDetail: `Deal - ${organizationName || fullName}`,
                stage: 'Discovery',
                ownerId: user?.id || 1
            });

            // 3. Auto-create a Contact entry from the Lead data
            const contact = await contactRepository.create({
                Name: fullName || 'Unknown Lead',
                Email: email || '',
                Designation: jobTitle || 'Prospect',
                AccountID: accountId,
                LastModified_By: user?.name || 'system'
            });
            console.log('LeadService: Contact auto-created:', contact.id, 'linked to lead:', lead.id);

            return { lead, opportunity, account, contact };
        } catch (error) {
            console.error('CRITICAL ERROR in createLead:', error);
            throw error;
        }
    }

    async getAllLeads() {
        return await leadRepository.getAll();
    }

    async getLeadById(id) {
        return await leadRepository.getById(id);
    }

    async updateLeadStatus(id, status) {
        return await leadRepository.update(id, { status });
    }
}

module.exports = new LeadService();
