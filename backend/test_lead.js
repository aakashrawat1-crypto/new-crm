const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testLeadCreation() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'ayush.negi@grazziti.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        console.log('2. Attempting to create lead...');
        const leadRes = await axios.post(`${API_URL}/leads`, {
            companyName: 'Test Corp',
            contactName: 'Test User',
            email: 'test@corp.com',
            phone: '1234567890',
            title: 'Manager',
            description: 'Testing lead creation'
        }, { headers });

        console.log('SUCCESS:', leadRes.data);
    } catch (error) {
        console.error('FAILURE:', error.response ? error.response.data : error.message);
    }
}

testLeadCreation();
