const opportunityService = require('../services/opportunityService');

const createOpportunity = (req, res) => {
    try {
        const opp = opportunityService.createOpportunity(req.body, req.user);
        res.status(201).json(opp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOpportunities = (req, res) => {
    const opps = opportunityService.getOpportunities();
    res.json(opps);
};

const getOpportunityById = (req, res) => {
    const opp = opportunityService.getOpportunityById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opp);
};

const updateOpportunity = (req, res) => {
    try {
        const opportunity = opportunityService.updateOpportunity(req.params.id, req.body);
        res.json(opportunity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    updateOpportunity
};
