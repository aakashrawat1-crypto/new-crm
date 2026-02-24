const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path'); // Path module add kiya hai

const dummyLeads = [
    {
        account_ID: 101,
        department: 'Enterprise Sales',
        createdAt: '2023-10-20T10:00:00Z',
        account: 'TechNova Solutions',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@technova.example.com',
        salesManager: 'Alexander Sterling',
        deliveryManager: 'Rachel Maas',
        leadType: 'Inbound',
        lastConversation: 'Client requested a demo of the new predictive analytics module.',
        lastConversationDate: '2023-10-24T14:30:00Z',
        comments: 'High priority target. Budget seems flexible.',
        fteCount: 4.5,
        nonFte: 1.0,
        expectedHours: 720,
        contractType: 'Time & Materials',
        status: 'New',
        proposalLink: 'https://docs.google.com/proposal-draft-1',
        estimatesLink: 'https://docs.google.com/estimates-v2',
        lostReason: null
    },
    {
        account_ID: 102,
        department: 'SMB Segment',
        createdAt: '2023-10-15T09:15:00Z',
        account: 'GreenLeaf Retail',
        customerName: 'David Cho',
        customerEmail: 'd.cho@greenleaf.example.com',
        salesManager: 'Alexander Sterling',
        deliveryManager: 'Pending',
        leadType: 'Referral',
        lastConversation: 'Discussed basic rollout plan. Awaiting budget approval from their board.',
        lastConversationDate: '2023-10-18T11:00:00Z',
        comments: 'Very likely to convert if we can hit the Q4 deadline.',
        fteCount: 2.0,
        nonFte: 0.5,
        expectedHours: 320,
        contractType: 'Fixed Bid',
        status: 'Converted',
        proposalLink: null,
        estimatesLink: null,
        lostReason: null
    },
    {
        account_ID: 103,
        department: 'Public Sector',
        createdAt: '2023-09-01T14:00:00Z',
        account: 'City Metro Transit',
        customerName: 'Robert Lang',
        customerEmail: 'rlang@metro.gov.test',
        salesManager: 'Jessica Wong',
        deliveryManager: 'Tom Hardy',
        leadType: 'Outbound',
        lastConversation: 'Final RFP submitted. They went with a competitor who underbid.',
        lastConversationDate: '2023-09-30T16:45:00Z',
        comments: 'Lost on price. Consider revisiting in 12 months.',
        fteCount: 12.0,
        nonFte: 3.0,
        expectedHours: 1920,
        contractType: 'Retainer',
        status: 'Closed Lost',
        proposalLink: null,
        estimatesLink: null,
        lostReason: 'Competitor offered a 30% lower bid on the initial year.'
    }
];

async function seedData() {
    try {
        // 🚨 SOLUTION: Exact wahi path use kiya hai jo migrate.js mein tha
        const dbPath = path.resolve(__dirname, 'data/crm.db');
        console.log('Connecting to database at:', dbPath);

        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('✅ Connected to crm.db successfully.');
        console.log('Seeding Leads data started...');

        // Loop through each lead and insert it into the database
        for (const lead of dummyLeads) {
            await db.run(
                `INSERT INTO Leads (
                    Account_ID, Department, Created_Date, Account, Customer_Name, Customer_Email, 
                    Sales_Manager, Delivery_Manager, Lead_Type, Last_Conversation, 
                    Last_Conversation_Date, Comments, FTECount, Non_FTE, Expected_Hours, 
                    Contract_Type, Status, Proposal_Link, Estimates_Link, Lost_Reason
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    lead.account_ID, lead.department, lead.createdAt, lead.account, lead.customerName, lead.customerEmail,
                    lead.salesManager, lead.deliveryManager, lead.leadType, lead.lastConversation,
                    lead.lastConversationDate, lead.comments, lead.fteCount, lead.nonFte, lead.expectedHours,
                    lead.contractType, lead.status, lead.proposalLink, lead.estimatesLink, lead.lostReason
                ]
            );
        }

        console.log('🎉 Success! 3 dummy leads have been safely inserted into the Leads table.');

        // Close the database connection
        await db.close();
    } catch (error) {
        console.error('❌ Error while seeding data:', error.message);
    }
}

seedData();