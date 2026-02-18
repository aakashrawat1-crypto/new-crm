const BaseRepository = require('./baseRepository');

class AccountRepository extends BaseRepository {
    constructor() {
        super('accounts');
    }

    async findByName(name) {
        if (!name) return null;
        return await this.findOne('LOWER(name) = LOWER(?)', [name]);
    }
}

module.exports = new AccountRepository();
