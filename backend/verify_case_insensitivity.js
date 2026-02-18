const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let authHeaders = {};

async function run() {
    try {
        console.log('1. Registering/Login Admin...');
        const adminRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Admin User',
            email: `admin_case_${Date.now()}@test.com`,
            password: 'password123',
            role: 'admin'
        });
        const token = adminRes.data.token || adminRes.data.user?.token;
        authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        console.log('   Auth successful.');

        console.log('2. Creating Leads with different casings for "Acme Corp"...');

        // Lead 1: Mixed Case
        const lead1Res = await axios.post(`${API_URL}/leads`, {
            organizationName: 'Acme Corp',
            fullName: 'Alice Smith',
            email: 'alice@acme.com',
            mobile: '1234567890'
        }, authHeaders);
        const account1Id = lead1Res.data.lead.accountId;
        console.log(`   Lead 1 (Acme Corp) created. Account ID: ${account1Id}`);

        // Lead 2: lower case
        const lead2Res = await axios.post(`${API_URL}/leads`, {
            organizationName: 'acme corp',
            fullName: 'Bob Smith',
            email: 'bob@acme.com',
            mobile: '0987654321'
        }, authHeaders);
        const account2Id = lead2Res.data.lead.accountId;
        console.log(`   Lead 2 (acme corp) created. Account ID: ${account2Id}`);

        // Lead 3: UPPER CASE
        const lead3Res = await axios.post(`${API_URL}/leads`, {
            organizationName: 'ACME CORP',
            fullName: 'Charlie Smith',
            email: 'charlie@acme.com',
            mobile: '1122334455'
        }, authHeaders);
        const account3Id = lead3Res.data.lead.accountId;
        console.log(`   Lead 3 (ACME CORP) created. Account ID: ${account3Id}`);

        if (account1Id === account2Id && account2Id === account3Id) {
            console.log('   SUCCESS: All leads share the same Account ID regardless of casing!');
        } else {
            console.error('   FAILURE: Account IDs do not match!');
            console.log(`   IDs: ${account1Id}, ${account2Id}, ${account3Id}`);
            process.exit(1);
        }

        console.log('3. Verifying Account Details...');
        const accountRes = await axios.get(`${API_URL}/accounts/${account1Id}`, authHeaders);
        console.log(`   Account Name in DB: ${accountRes.data.name}`);
        console.log(`   Total Leads in Account: ${accountRes.data.leads.length}`);

        if (accountRes.data.leads.length === 3) {
            console.log('   SUCCESS: Account contains all 3 leads.');
        } else {
            console.error(`   FAILURE: Expected 3 leads, got ${accountRes.data.leads.length}`);
            process.exit(1);
        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

run();
