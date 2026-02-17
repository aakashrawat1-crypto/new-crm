const BaseRepository = require('./baseRepository');

class LeadRepository extends BaseRepository {
    constructor() {
        super('leads');
    }
}

module.exports = new LeadRepository();
