const Product = require("../models/product");
const { Op } = require("sequelize");

const newProductService = async (productData) => {
    const productExists = await Product.findOne({ where: { name: productData.name } });

    if (productExists){
        throw new Error('productExists already exists');
    }

    if (!productData.name ||!productData.desc ||!productData.price ||!productData.stock ||!Number.isInteger(productData.stock) || productData.stock < 1) {
        throw new Error('Invalid product data');
    }

    const newProduct = await Product.create({
        name: productData.name,
        desc: productData.desc,
        price: productData.price,
        stock: productData.stock
    });
    return newProduct;
};

const getProductService = async () => {
    try {
        const products = await Product.findAll();
        return products;
    } catch (err) {
        throw new Error('Erro ao buscar produtos: ', err.message);
    }
};

const updateProductService = async (productId, newData) => {
    const product = await Product.findByPk(productId);
    const productName = await Product.findOne({where: {name: newData.name, id: { [Op.ne]: productId }}});
    if (!product) {
        throw new Error('Product not found');
    };

    if (productName) {
        throw new Error('Product already exists');
    };

    if (newData.name) {
        product.name = newData.name;
    }
    if (newData.desc) {
        product.desc = newData.desc;
    }
    if (newData.price) {
        product.price = newData.price;
    }
    if (newData.stock) {
        if (!Number.isInteger(newData.stock) || newData.stock < 1){
            throw new Error('Invalid product data');
        }
        product.stock = newData.stock;
    }
    await product.save();
    return product;
};

const deleteProductService = async (productId) => {
    const product = await Product.findByPk(productId);

    if(!product){
        throw new Error("Product not found")
    }

    await product.destroy();
    return(`Product deleted: Id = ${product.id}, Name = ${product.name}`);
};

module.exports = { 
    newProductService, 
    updateProductService, 
    getProductService, 
    deleteProductService
};