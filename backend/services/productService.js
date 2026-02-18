const productRepository = require('../repositories/productRepository');

class ProductService {
    async createProduct(data, user) {
        return await productRepository.create({
            ...data,
            createdBy: user.id
        });
    }

    async getProducts() {
        return await productRepository.getAll();
    }
}

module.exports = new ProductService();
