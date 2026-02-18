const BaseRepository = require('./baseRepository');

class LeadRepository extends BaseRepository {
    constructor() {
        super('leads');
    }

    async findByFullName(fullName) {
        return await this.findOne('fullName = ?', [fullName]);
    }
}

module.exports = new LeadRepository();
