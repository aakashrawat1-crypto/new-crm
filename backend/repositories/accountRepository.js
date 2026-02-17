const BaseRepository = require('./baseRepository');

class AccountRepository extends BaseRepository {
    constructor() {
        super('accounts');
    }

    findByName(name) {
        if (!name) return null;
        return this.findOne(account => account.name.toLowerCase() === name.toLowerCase());
    }
}

module.exports = new AccountRepository();
