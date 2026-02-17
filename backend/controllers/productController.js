const productService = require('../services/productService');

const createProduct = (req, res) => {
    try {
        const product = productService.createProduct(req.body, req.user);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = (req, res) => {
    const products = productService.getProducts();
    res.json(products);
};

module.exports = { createProduct, getProducts };
