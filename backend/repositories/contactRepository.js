const BaseRepository = require('./baseRepository');

class ContactRepository extends BaseRepository {
    constructor() {
        super('contacts');
    }

    findByAccountId(accountId) {
        return this.find(contact => contact.accountId === accountId);
    }
}

module.exports = new ContactRepository();
