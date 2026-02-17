const leadRepository = require('../repositories/leadRepository');
const opportunityRepository = require('../repositories/opportunityRepository');

const getDashboardStats = (req, res) => {
    const leads = leadRepository.getAll();
    const opportunities = opportunityRepository.getAll();

    const totalLeads = leads.length;
    // Assuming 'Converted' status exists for leads, or checking if they have linked accounts
    // The auto-create logic makes all leads "converted" effectively, but let's stick to status.
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;

    // Active deals: not won or lost
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
};

module.exports = { getDashboardStats };
