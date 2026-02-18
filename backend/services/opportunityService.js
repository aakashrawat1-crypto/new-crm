const opportunityRepository = require('../repositories/opportunityRepository');

class OpportunityService {
    async createOpportunity(data, user) {
        return await opportunityRepository.create({
            ...data,
            ownerId: user.id
        });
    }

    async getOpportunities() {
        return await opportunityRepository.getAll();
    }

    async getOpportunity(id) {
        return await opportunityRepository.getById(id);
    }

    async updateOpportunity(id, updateData) {
        return await opportunityRepository.update(id, {
            ...updateData,
            updatedAt: new Date()
        });
    }
}

module.exports = new OpportunityService();
