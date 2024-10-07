const { newProductService, getProductService, updateProductService, deleteProductService } = require("../services/productService");

const newProductController = async (req, res) => {
    const productData = req.body

    try {
        const newProduct = await newProductService(productData);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProductController = async (req, res) => {
    try {
        const allProducts = await getProductService();
        res.status(200).json({allProducts}); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const newData = req.body;
        const updatedProduct = await updateProductService(productId, newData);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteProductController = async (req, res) => {
    const { productId } = req.params
    try {
        const delectedProduct = await deleteProductService(productId);
        res.status(200).json(delectedProduct)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    newProductController,
    getProductController,
    updateProductController,
    deleteProductController
};