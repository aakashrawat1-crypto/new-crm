const contactService = require('./services/contactService');
const leadService = require('./services/leadService');

async function test() {
    try {
        console.log('--- Creating a Test Lead ---');
        await leadService.createLead({
            fullName: 'Test User ' + Date.now(),
            organizationName: 'Test Org',
            email: 'test@example.com',
            mobile: '1234567890'
        }, { id: 'admin' });

        console.log('--- Fetching Unified Contacts ---');
        const contacts = await contactService.getContacts();
        console.log('Total Unified Contacts:', contacts.length);
        if (contacts.length > 0) {
            console.log('Last item:', JSON.stringify(contacts[contacts.length - 1], null, 2));
        }
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
