const opportunityRepository = require('../repositories/opportunityRepository');

class OpportunityService {
    createOpportunity(data, user) {
        return opportunityRepository.create({
            ...data,
            ownerId: user.id
        });
    }

    getOpportunities() {
        return opportunityRepository.getAll();
    }

    getOpportunity(id) {
        return opportunityRepository.getById(id);
    }

    updateOpportunity(id, updateData) {
        return opportunityRepository.update(id, {
            ...updateData,
            updatedAt: new Date()
        });
    }
}

module.exports = new OpportunityService();
