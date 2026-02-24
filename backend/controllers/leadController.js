const leadService = require('../services/leadService');

const createLead = async (req, res) => {
    try {
        // 1. data comes from frontend
        const rawData = req.body;

        // 2. React ke naamo ko Service ke required naamo mein Map karna
        const mappedData = {
            fullName: rawData.contactName || 'Unknown Contact', // React 'contactName' -> Service 'fullName'
            organizationName: rawData.companyName || 'Unknown Org', // React 'companyName' -> Service 'organizationName'
            jobTitle: rawData.title || '',                       // React 'title' -> Service 'jobTitle'
            email: rawData.email || '',
            mobile: rawData.phone || '',                         // React 'phone' -> Service 'mobile'
            officePhone: rawData.officePhone || '',
            leadSource: rawData.leadSource || 'Inbound',
            description: rawData.description || ''
        };

        // 3. Mapped data ko service mein bhej dena
        // Agar auth middleware se req.user nahi aa raha, toh ek dummy user pass kar rahe hain
        const user = req.user || { id: 1, name: 'System Admin' };

        const result = await leadService.createLead(mappedData, user);
        res.status(201).json(result);
    } catch (error) {
        console.error("Lead Creation Error:", error);
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