const leadService = require('../services/leadService');

const createLead = async (req, res) => {
    try {
        const result = await leadService.createLead(req.body, req.user);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeads = (req, res) => {
    const leads = leadService.getAllLeads();
    res.json(leads);
};

const getLead = (req, res) => {
    const lead = leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
};

const updateStatus = (req, res) => {
    const { status } = req.body;
    const lead = leadService.updateLeadStatus(req.params.id, status);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
};

module.exports = { createLead, getLeads, getLead, updateStatus };
