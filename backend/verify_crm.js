const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

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
            companyName: 'Acme Corp',
            contactName: 'Alice Smith',
            email: 'alice@acme.com',
            phone: '1234567890'
        }, authHeaders);
        const lead1 = lead1Res.data.lead;
        const account1 = lead1Res.data.account;
        console.log(`   Lead created: ${lead1.id}`);
        console.log(`   Account created/linked: ${account1.id} (${account1.name})`);

        console.log('3. Creating Second Lead (Acme Corp) - Should reuse Account...');
        const lead2Res = await axios.post(`${API_URL}/leads`, {
            companyName: 'Acme Corp',
            contactName: 'Bob Jones',
            email: 'bob@acme.com',
            phone: '0987654321'
        }, authHeaders);
        const lead2 = lead2Res.data.lead;
        const account2 = lead2Res.data.account;
        console.log(`   Lead created: ${lead2.id}`);
        console.log(`   Account linked: ${account2.id}`);

        if (account1.id === account2.id) {
            console.log('SUCCESS: Account ID matches! Logic working.');
        } else {
            console.error('FAILURE: Account IDs do not match.');
            process.exit(1);
        }

        console.log('4. Verifying Dashboard Stats...');
        const statsRes = await axios.get(`${API_URL}/dashboard`, authHeaders);
        console.log('   Stats:', statsRes.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

run();
