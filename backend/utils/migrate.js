const { getDb } = require('./db');

async function migrate() {
    const db = await getDb();

    console.log('Starting migration...');

    // Drop tables for clean slate (optional, but needed here for schema changes)
    await db.exec('DROP TABLE IF EXISTS revenue');
    await db.exec('DROP TABLE IF EXISTS opportunities');
    await db.exec('DROP TABLE IF EXISTS leads');
    await db.exec('DROP TABLE IF EXISTS contacts');
    await db.exec('DROP TABLE IF EXISTS accounts');
    await db.exec('DROP TABLE IF EXISTS products');
    await db.exec('DROP TABLE IF EXISTS roles');
    await db.exec('DROP TABLE IF EXISTS UserInfo');
    await db.exec('DROP TABLE IF EXISTS Roles');

    // Roles table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role_name TEXT NOT NULL
        )
    `);


    // UserInfo table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS UserInfo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            role_id INTEGER,
            is_active BOOLEAN DEFAULT 1,
            FOREIGN KEY (role_id) REFERENCES Roles(id)
        )
    `);


    // Account table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Account (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name VARCHAR(255) NOT NULL,
            Client_Classification VARCHAR(100),
            Category VARCHAR(100),
            Industry VARCHAR(100),
            Sub_Industry VARCHAR(100),
            Geography VARCHAR(100),
            Account_Manager VARCHAR(255),
            Project_Manager VARCHAR(255),
            Delivery_Manager VARCHAR(255),
            Revenue DECIMAL(18, 2),
            SFDC_Instances INTEGER,
            Upsell_Opportunity_Area TEXT,
            Account_Status VARCHAR(50),
            CID VARCHAR(50),
            LastModified_By VARCHAR(255),
            LastModified_Date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Sub_Account table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Sub_Account (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            AccountID INTEGER NOT NULL,
            Sub_Account_Name TEXT NOT NULL,
            Contact TEXT,
            LastModified_By TEXT,
            LastModified_Date TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE CASCADE
        )
    `);

    // Contact table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Contact (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            Email TEXT,
            Designation TEXT,
            AccountID INTEGER,
            Created_Date TEXT DEFAULT CURRENT_TIMESTAMP,
            LastModified_By TEXT,
            LastModified_Date TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE SET NULL
        )
    `);

    // Leads table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Leads (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Account_ID INTEGER,
            Department VARCHAR(100),
            Created_Date DATE DEFAULT CURRENT_TIMESTAMP,
            Account VARCHAR(255),
            Customer_Name VARCHAR(255),
            Customer_Email VARCHAR(255),
            Sales_Manager VARCHAR(100),
            Delivery_Manager VARCHAR(100),
            Lead_Type VARCHAR(50),
            Last_Conversation TEXT,
            Last_Conversation_Date DATE,
            Comments TEXT,
            FTECount DECIMAL(10, 2),
            Non_FTE DECIMAL(10, 2),
            Expected_Hours DECIMAL(10, 2),
            Contract_Type VARCHAR(50),
            Status VARCHAR(50) DEFAULT 'New',
            Closed_Date DATE,
            Lost_Reason TEXT,
            Proposal_Link VARCHAR(2048),
            Estimates_Link VARCHAR(2048),
            LastModified_By VARCHAR(100),
            LastModified_Date DATE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT FK_Leads_Account FOREIGN KEY (Account_ID) REFERENCES Account(ID) ON DELETE SET NULL
        )
    `);

    console.log('Migration completed successfully.');
}

if (require.main === module) {
    migrate().catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
}

module.exports = { migrate };
