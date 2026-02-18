const leadService = require('../services/leadService');

const createLead = async (req, res) => {
    try {
        const result = await leadService.createLead(req.body, req.user);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeads = async (req, res) => {
    try {
        const leads = await leadService.getAllLeads();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLead = async (req, res) => {
    try {
        const lead = await leadService.getLeadById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await leadService.updateLeadStatus(req.params.id, status);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLead, getLeads, getLead, updateStatus };
