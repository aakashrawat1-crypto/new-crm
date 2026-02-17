const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/store.json');

const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // Initialize if not exists
            const initialData = {
                users: [],
                leads: [],
                accounts: [],
                contacts: [],
                opportunities: [],
                products: []
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return null;
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
};

module.exports = { readData, writeData };
