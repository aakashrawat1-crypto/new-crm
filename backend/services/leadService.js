const leadRepository = require('../repositories/leadRepository');
const opportunityRepository = require('../repositories/opportunityRepository');
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
                fullName: fullName || 'Unknown Lead',
                jobTitle: jobTitle || '',
                organizationName: organizationName || '',
                email: email || '',
                mobile: mobile || '',
                officePhone: officePhone || '',
                leadSource: leadSource || 'Other',
                status: 'New',
                ownerId: user?.id || 'system',
                accountId: accountId
            });
            console.log('LeadService: Lead created:', lead.id, 'with accountId:', lead.accountId);

            // 2. Create Opportunity linked to the Lead AND Account
            const opportunity = await opportunityRepository.create({
                leadId: lead.id,
                accountId: accountId,
                dealDetail: `Deal - ${organizationName || fullName}`,
                stage: 'Discovery',
                ownerId: user?.id || 'system'
            });

            return { lead, opportunity, account };
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
