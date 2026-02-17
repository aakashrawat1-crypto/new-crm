const productRepository = require('../repositories/productRepository');

class ProductService {
    createProduct(data, user) {
        return productRepository.create({
            ...data,
            createdBy: user.id
        });
    }

    getProducts() {
        return productRepository.getAll();
    }
}

module.exports = new ProductService();
