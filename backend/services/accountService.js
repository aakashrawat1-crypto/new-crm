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
                name,
                ownerId: user?.id || 'system',
                industry: 'Other',
                website: ''
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
            ...accountData,
            ownerId: user?.id || 'system'
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
