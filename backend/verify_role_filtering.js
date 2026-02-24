const leadService = require('./services/leadService');
const leadRepository = require('./repositories/leadRepository');
const { getDb } = require('./utils/db');

async function verify() {
    const db = await getDb();

    console.log('--- Cleaning up and Seeding Leads for Verification ---');
    await db.run('DELETE FROM Leads');

    // Seed lead for Sales Rep A
    await leadRepository.create({
        Customer_Name: 'Lead A',
        Sales_Manager: 'Sales Rep A',
        Status: 'New'
    });

    // Seed lead for Sales Rep B
    await leadRepository.create({
        Customer_Name: 'Lead B',
        Sales_Manager: 'Sales Rep B',
        Status: 'New'
    });

    console.log('Seeding completed.');

    const adminUser = { name: 'Admin', role: 'admin' };
    const repA = { name: 'Sales Rep A', role: 'SALES_REP' };
    const repB = { name: 'Sales Rep B', role: 'SALES_REP' };

    console.log('\n--- Testing Admin Role ---');
    const adminLeads = await leadService.getAllLeads(adminUser);
    console.log(`Admin sees ${adminLeads.length} leads (Expected: 2)`);
    if (adminLeads.length !== 2) throw new Error('Admin should see all leads');

    console.log('\n--- Testing Sales Rep A Role ---');
    const repALeads = await leadService.getAllLeads(repA);
    console.log(`Rep A sees ${repALeads.length} leads (Expected: 1)`);
    console.log('Leads for Rep A:', repALeads.map(l => l.Customer_Name).join(', '));
    if (repALeads.length !== 1 || repALeads[0].Customer_Name !== 'Lead A') {
        throw new Error('Rep A filtering failed');
    }

    console.log('\n--- Testing Sales Rep B Role ---');
    const repBLeads = await leadService.getAllLeads(repB);
    console.log(`Rep B sees ${repBLeads.length} leads (Expected: 1)`);
    console.log('Leads for Rep B:', repBLeads.map(l => l.Customer_Name).join(', '));
    if (repBLeads.length !== 1 || repBLeads[0].Customer_Name !== 'Lead B') {
        throw new Error('Rep B filtering failed');
    }

    console.log('\nVerification Successful!');
    await db.close();
}

verify().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
