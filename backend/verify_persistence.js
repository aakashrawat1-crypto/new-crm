const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let authHeaders = {};

async function run() {
    try {
        console.log('1. Registering/Login Admin...');
        const adminRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Admin User',
            email: `admin_${Date.now()}@test.com`,
            password: 'password123',
            role: 'admin'
        }).catch(err => {
            if (err.response && err.response.data.message === 'User already exists') {
                return axios.post(`${API_URL}/auth/login`, {
                    email: 'admin@test.com',
                    password: 'password123'
                });
            }
            throw err;
        });
        const token = adminRes.data.token || adminRes.data.user?.token;
        authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        console.log('   Auth successful.');

        console.log('2. Creating a Lead (to get an Opportunity)...');
        const leadRes = await axios.post(`${API_URL}/leads`, {
            organizationName: 'Persistence Corp',
            fullName: 'John Smith',
            email: 'john@persistence.com',
            mobile: '555-0100'
        }, authHeaders);

        const opportunity = leadRes.data.opportunity;
        const oppId = opportunity.id;
        console.log(`   Opportunity created. ID: ${oppId}`);

        console.log('3. Updating Opportunity with new fields...');
        const updateData = {
            stage: 'Negotiation',
            git: 'https://github.com/persistence/test',
            internalNotes: 'These are some internal notes.',
            productIds: ['prod-1', 'prod-2'],
            pmChecklist: 'Checklist item 1',
            qbrNotes: 'QBR notes content'
        };

        const updateRes = await axios.patch(`${API_URL}/opportunities/${oppId}`, updateData, authHeaders);
        const updatedOpp = updateRes.data;

        console.log('4. Verifying persistence...');
        const verifyFields = ['stage', 'git', 'internalNotes', 'pmChecklist', 'qbrNotes'];
        let success = true;

        verifyFields.forEach(field => {
            if (updatedOpp[field] !== updateData[field]) {
                console.error(`   FAILURE: Field "${field}" mismatch! Expected: "${updateData[field]}", Got: "${updatedOpp[field]}"`);
                success = false;
            } else {
                console.log(`   SUCCESS: Field "${field}" persists correctly.`);
            }
        });

        // Verify productIds (array vs string)
        if (JSON.stringify(updatedOpp.productIds) !== JSON.stringify(updateData.productIds)) {
            console.error(`   FAILURE: productIds mismatch! Expected: ${JSON.stringify(updateData.productIds)}, Got: ${JSON.stringify(updatedOpp.productIds)}`);
            success = false;
        } else {
            console.log('   SUCCESS: productIds array persists and parses correctly.');
        }

        if (!success) {
            process.exit(1);
        }

        console.log('   OVERALL SUCCESS: Opportunity data persistence verified.');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

run();
