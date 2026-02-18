const BaseRepository = require('./baseRepository');

class RevenueRepository extends BaseRepository {
    constructor() {
        super('revenue');
    }

    async findByOpportunityId(opportunityId) {
        return await this.findOne('opportunityId = ?', [opportunityId]);
    }
}

module.exports = new RevenueRepository();
