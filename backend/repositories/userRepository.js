const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }

    async findByEmail(email) {
        return await this.findOne('email = ?', [email]);
    }
}

module.exports = new UserRepository();
