const accountRepository = require('../repositories/accountRepository');
const contactRepository = require('../repositories/contactRepository');
const opportunityRepository = require('../repositories/opportunityRepository');

const leadRepository = require('../repositories/leadRepository');

class AccountService {
    getAllAccounts() {
        return accountRepository.getAll();
    }

    getAccountById(id) {
        return accountRepository.getById(id);
    }

    createAccount(accountData, user) {
        // Enforce unique name (case-insensitive)
        const existing = accountRepository.findByName(accountData.name);
        if (existing) {
            throw new Error('Account with this name already exists');
        }

        return accountRepository.create({
            ...accountData,
            ownerId: user.id,
            createdAt: new Date()
        });
    }

    getAccountDetails(id) {
        const account = accountRepository.getById(id);
        if (!account) return null;

        const contacts = contactRepository.findByAccountId(id);
        const opportunities = opportunityRepository.findByAccountId(id);
        const leads = leadRepository.find(l => l.accountId === id);

        return { ...account, contacts, opportunities, leads };
    }
}

module.exports = new AccountService();
