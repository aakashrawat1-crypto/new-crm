const leadRepository = require('../repositories/leadRepository');
const opportunityRepository = require('../repositories/opportunityRepository');

const getDashboardStats = async (req, res) => {
    try {
        const leads = await leadRepository.getAll();
        const opportunities = await opportunityRepository.getAll();

        const totalLeads = leads.length;
        const convertedLeads = leads.filter(l => l.status === 'Converted').length;

        const activeDeals = opportunities.filter(o =>
            o.stage !== 'Closed Won' && o.stage !== 'Closed Lost'
        ).length;

        const closedDeals = opportunities.filter(o => o.stage === 'Closed Won').length;

        const revenue = opportunities
            .filter(o => o.stage === 'Closed Won')
            .reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0);

        res.json({
            totalLeads,
            convertedLeads,
            activeDeals,
            closedDeals,
            revenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
