const BaseRepository = require('./baseRepository');

class AccountRepository extends BaseRepository {
    constructor() {
        super('Account');
    }

    async findByName(name) {
        if (!name) return null;
        return await this.findOne('LOWER(Name) = LOWER(?)', [name]);
    }
}

module.exports = new AccountRepository();
