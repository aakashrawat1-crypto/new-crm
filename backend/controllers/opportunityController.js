const opportunityService = require('../services/opportunityService');

const createOpportunity = async (req, res) => {
    try {
        const opp = await opportunityService.createOpportunity(req.body, req.user);
        res.status(201).json(opp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOpportunities = async (req, res) => {
    try {
        const opps = await opportunityService.getOpportunities();
        res.json(opps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOpportunityById = async (req, res) => {
    try {
        const opp = await opportunityService.getOpportunity(req.params.id);
        if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
        res.json(opp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await opportunityService.updateOpportunity(req.params.id, req.body);
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
