const BaseRepository = require('./baseRepository');

class LeadRepository extends BaseRepository {
    constructor() {
        super('Leads');
    }

    async findByFullName(fullName) {
        return await this.findOne('Customer_Name = ?', [fullName]);
    }
}

module.exports = new LeadRepository();
