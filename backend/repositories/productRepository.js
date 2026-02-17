const BaseRepository = require('./baseRepository');

class ProductRepository extends BaseRepository {
    constructor() {
        super('products');
    }
}

module.exports = new ProductRepository();
