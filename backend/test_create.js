const leadService = require('./services/leadService');

async function test() {
    try {
        console.log("Starting test...");
        const result = await leadService.createLead({
            companyName: 'Test Inc',
            contactName: 'John Doe',
            email: 'john@test.com',
            phone: '1234567890',
            title: 'Manager',
            description: 'Test'
        }, { id: 'test_user' });
        console.log("Success:", result);
    } catch (e) {
        console.error("FAILED:", e);
    }
}

test();
