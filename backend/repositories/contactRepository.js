const BaseRepository = require('./baseRepository');

class ContactRepository extends BaseRepository {
    constructor() {
        super('Contact');
    }

    async findByAccountId(accountId) {
        return await this.find('AccountID = ?', [accountId]);
    }

    async findByEmail(email) {
        if (!email) return null;
        return await this.findOne('LOWER(Email) = LOWER(?)', [email]);
    }

    async findByName(name, accountId) {
        if (!name) return null;
        return await this.findOne('LOWER(Name) = LOWER(?) AND AccountID = ?', [name, accountId]);
    }
}

module.exports = new ContactRepository();
