const BaseRepository = require('./baseRepository');

class SubAccountRepository extends BaseRepository {
    constructor() {
        super('sub_accounts');
    }

    async findByName(name, accountId) {
        if (!name) return null;
        return await this.findOne('LOWER(name) = LOWER(?) AND accountId = ?', [name, accountId]);
    }
}

module.exports = new SubAccountRepository();
