const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = 'c:\\Users\\aakash.rawat1\\Desktop\\CRM\\CRM.db';
const db = new sqlite3.Database(dbPath);

console.log('Inspecting database at:', dbPath);

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Tables:', tables.map(t => t.name).join(', '));
        
        tables.forEach(table => {
            db.all(`PRAGMA table_info(${table.name});`, (err, columns) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`\nTable: ${table.name}`);
                columns.forEach(col => {
                    console.log(`  - ${col.name} (${col.type})`);
                });
            });
        });
    });
});
