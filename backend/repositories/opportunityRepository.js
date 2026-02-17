const BaseRepository = require('./baseRepository');

class OpportunityRepository extends BaseRepository {
    constructor() {
        super('opportunities');
    }

    findByAccountId(accountId) {
        return this.find(opp => opp.accountId === accountId);
    }
}

module.exports = new OpportunityRepository();
