const productModel = require('../models/product');

module.exports.create = async (product) => {
    if (!product)
        throw new Error('Missing product');

    await productModel.create(product);
}

