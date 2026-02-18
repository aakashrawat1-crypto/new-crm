const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function run() {
    try {
        console.log('1. Registering/Login Admin...');
        // We implemented register in authService but not exposed in a public way easily without token? 
        // Wait, register endpoint is public.
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'ADMIN'
            });
            token = res.data.token;
            console.log('   Registered successfully');
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   User exists, logging in...');
                const res = await axios.post(`${API_URL}/auth/login`, {
                    email: 'admin@test.com',
                    password: 'password123'
                });
                token = res.data.token;
            } else {
                throw e;
            }
        }

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('2. Creating First Lead (Acme Corp)...');
        const lead1Res = await axios.post(`${API_URL}/leads`, {
            organizationName: 'Acme Corp',
            fullName: 'Alice Smith',
            email: 'alice@acme.com',
            mobile: '1234567890'
        }, authHeaders);
        const account1Id = lead1Res.data.lead.accountId;
        console.log(`   Lead 1 created. Account ID: ${account1Id}`);

        console.log('3. Creating Second Lead for Same Organization (Acme Corp)...');
        const lead2Res = await axios.post(`${API_URL}/leads`, {
            organizationName: 'Acme Corp',
            fullName: 'Bob Jones',
            email: 'bob@acme.com',
            mobile: '0987654321'
        }, authHeaders);
        const account2Id = lead2Res.data.lead.accountId;
        console.log(`   Lead 2 created. Account ID: ${account2Id}`);

        if (account1Id && account1Id === account2Id) {
            console.log('   SUCCESS: Account IDs match! Logic working.');
        } else {
            console.error('   FAILURE: Account IDs do not match or are missing.');
            console.log(`   ID 1: ${account1Id}, ID 2: ${account2Id}`);
            process.exit(1);
        }

        console.log('4. Verifying Account Details (Hierarchy)...');
        const accountDetailsRes = await axios.get(`${API_URL}/accounts/${account1Id}`, authHeaders);
        const details = accountDetailsRes.data;
        console.log(`   Account: ${details.name}`);
        console.log(`   Leads found in Account: ${details.leads?.length || 0}`);

        if (details.leads && details.leads.some(l => l.fullName === 'Alice Smith')) {
            console.log('   SUCCESS: Lead "Alice Smith" found in Account details!');
        } else {
            console.error('   FAILURE: Lead not found in Account details.');
            process.exit(1);
        }

        console.log('5. Verifying Dashboard Stats...');
        const statsRes = await axios.get(`${API_URL}/dashboard`, authHeaders);
        console.log('   Stats:', statsRes.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}
run();
