const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super('UserInfo');
    }

    async findByEmail(email) {
        return await this.findOne('email = ?', [email]);
    }

    async create(item) {
        const { getDb } = require('../utils/db');
        const db = await getDb();
        const keys = Object.keys(item);
        const placeholders = keys.map(() => '?').join(', ');
        const values = Object.values(item);

        const result = await db.run(
            `INSERT INTO UserInfo (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );
        return { id: result.lastID, ...item };
    }
}

module.exports = new UserRepository();
