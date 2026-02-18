const BaseRepository = require('./baseRepository');

class OpportunityRepository extends BaseRepository {
    constructor() {
        super('opportunities');
    }

    async getAll() {
        const results = await super.getAll();
        return results.map(opp => this._parse(opp));
    }

    async findByAccountId(accountId) {
        const results = await this.find('accountId = ?', [accountId]);
        return results.map(opp => this._parse(opp));
    }

    async getById(id) {
        const opp = await super.getById(id);
        return this._parse(opp);
    }

    async create(data) {
        const serializedData = this._serialize(data);
        const newItem = await super.create(serializedData);
        return this._parse(newItem);
    }

    async update(id, data) {
        const serializedData = this._serialize(data);
        const updatedItem = await super.update(id, serializedData);
        return this._parse(updatedItem);
    }

    _serialize(data) {
        if (data.productIds && Array.isArray(data.productIds)) {
            return { ...data, productIds: JSON.stringify(data.productIds) };
        }
        return data;
    }

    _parse(opp) {
        if (!opp) return null;
        if (opp.productIds && typeof opp.productIds === 'string') {
            try {
                return { ...opp, productIds: JSON.parse(opp.productIds) };
            } catch (e) {
                return { ...opp, productIds: [] };
            }
        }
        return opp;
    }
}

module.exports = new OpportunityRepository();
