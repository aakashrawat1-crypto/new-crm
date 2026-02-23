const axios = require('axios');

const API_URL = 'http://localhost:5002/api';

async function test() {
    try {
        console.log('1. Registering/Login Test User...');
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Upsert User',
                email: 'upsert@test.com',
                password: 'password123',
                role: 'ADMIN'
            });
            token = res.data.token;
            console.log('   Registered successfully');
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   User exists, logging in...');
                const res = await axios.post(`${API_URL}/auth/login`, {
                    email: 'upsert@test.com',
                    password: 'password123'
                });
                token = res.data.token;
            } else {
                throw e;
            }
        }

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n2. Testing Upsert with Full Payload...');
        const payload = {
            account: {
                name: 'Test Corp',
                industry: 'Tech',
                website: 'https://testcorp.com'
            },
            sub_account: {
                name: 'Test Corp - Dept A'
            },
            contact: {
                name: 'John Doe',
                email: 'john.doe@testcorp.com',
                phone: '555-0199',
                title: 'Manager'
            },
            lead: {
                fullName: 'John Doe Lead',
                email: 'john.doe@testcorp.com',
                status: 'New'
            },
            opportunity: {
                name: 'Test Deal 1',
                amount: 50000,
                stage: 'Discovery'
            }
        };

        const res1 = await axios.post(`${API_URL}/external/upsert`, payload, authHeaders);
        console.log('   Response Status:', res1.status);
        console.log('   Response Data:', JSON.stringify(res1.data.data, null, 2));

        console.log('\n3. Testing Missing Sub-Account and Lead...');
        const partialPayload = {
            account: {
                name: 'Test Corp'
            },
            contact: {
                name: 'Jane Smith',
                email: 'jane.smith@testcorp.com'
            },
            opportunity: {
                name: 'Test Deal 2'
            }
        };

        const res2 = await axios.post(`${API_URL}/external/upsert`, partialPayload, authHeaders);
        console.log('   Response Status:', res2.status);
        if (res2.data.data.subAccountId === null && res2.data.data.leadId === null) {
            console.log('   SUCCESS: Sub-Account and Lead IDs are NULL as expected.');
        } else {
            console.error('   FAILURE: Sub-Account or Lead ID is not NULL.');
        }

    } catch (error) {
        console.error('Error during testing:', error.response ? error.response.data : error.message);
    }
}

test();
