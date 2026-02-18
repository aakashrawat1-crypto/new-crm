const { getDb } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async getAll() {
        const db = await getDb();
        return await db.all(`SELECT * FROM ${this.tableName}`);
    }

    async getById(id) {
        const db = await getDb();
        return await db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    }

    async create(item) {
        const db = await getDb();
        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const newItem = { id, createdAt, ...item };

        const keys = Object.keys(newItem);
        const placeholders = keys.map(() => '?').join(', ');
        const values = Object.values(newItem);

        await db.run(
            `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );

        return newItem;
    }

    async update(id, updates) {
        const db = await getDb();
        const keys = Object.keys(updates);
        if (keys.length === 0) return await this.getById(id);

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        await db.run(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
            values
        );

        return await this.getById(id);
    }

    async delete(id) {
        const db = await getDb();
        const result = await db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.changes > 0;
    }

    async findOne(predicate_or_condition, params = []) {
        const db = await getDb();
        // For SQLite, we prefer SQL conditions. If it's a string, use it as WHERE clause.
        if (typeof predicate_or_condition === 'string') {
            return await db.get(`SELECT * FROM ${this.tableName} WHERE ${predicate_or_condition}`, params);
        }
        // Fallback or handle differently if needed, but for now we expect SQL strings
        throw new Error('findOne expects a SQL condition string');
    }

    async find(condition, params = []) {
        const db = await getDb();
        return await db.all(`SELECT * FROM ${this.tableName} WHERE ${condition}`, params);
    }
}

module.exports = BaseRepository;
