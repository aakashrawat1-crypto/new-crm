const accountRepository = require('../repositories/accountRepository');
const contactRepository = require('../repositories/contactRepository');
const opportunityRepository = require('../repositories/opportunityRepository');
const leadRepository = require('../repositories/leadRepository');

class AccountService {
    async getAllAccounts() {
        return await accountRepository.getAll();
    }

    async getAccountById(id) {
        return await accountRepository.getById(id);
    }

    async getOrCreateAccount(name, user) {
        if (!name) return null;

        let account = await accountRepository.findByName(name);
        if (!account) {
            account = await accountRepository.create({
                Name: name,
                LastModified_By: user?.name || 'system',
                Industry: 'Other'
            });
        }
        return account;
    }

    async createAccount(accountData, user) {
        const existing = await accountRepository.findByName(accountData.name);
        if (existing) {
            throw new Error('Account with this name already exists');
        }

        return await accountRepository.create({
            Name: accountData.name,
            Industry: accountData.industry || 'Other',
            Client_Classification: accountData.clientClassification || '',
            Category: accountData.category || '',
            Sub_Industry: accountData.subIndustry || '',
            Geography: accountData.geography || '',
            Account_Manager: accountData.accountManager || '',
            Project_Manager: accountData.projectManager || '',
            Delivery_Manager: accountData.deliveryManager || '',
            Revenue: accountData.revenue || 0,
            SFDC_Instances: accountData.sfdcInstances || 0,
            Upsell_Opportunity_Area: accountData.upsellOpportunityArea || '',
            Account_Status: accountData.status || 'Active',
            CID: accountData.cid || '',
            LastModified_By: user?.name || 'system'
        });
    }

    async getAccountDetails(id) {
        const account = await accountRepository.getById(id);
        if (!account) return null;

        // Note: Repository methods like findByAccountId need to be implemented/fixed for SQL too
        const contacts = await contactRepository.find('accountId = ?', [id]);
        const opportunities = await opportunityRepository.find('accountId = ?', [id]);
        const leads = await leadRepository.find('accountId = ?', [id]);

        return { ...account, contacts, opportunities, leads };
    }
}

module.exports = new AccountService();
