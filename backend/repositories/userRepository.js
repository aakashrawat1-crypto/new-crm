const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }

    findByEmail(email) {
        return this.findOne(user => user.email === email);
    }
}

module.exports = new UserRepository();
