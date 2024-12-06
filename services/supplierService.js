const Supplier = require("../models/supplier");
const { Op } = require("sequelize");

const registerSupplierService = async (supplier, supplierProduct) => {
    console.log(supplier);
    const supplierExists = await Supplier.findOne({ where: { name: supplier } });
    const productExists = await Supplier.findOne({ where: { product: supplierProduct } });

    if (supplierExists){
        throw new Error('Supplier already exists');
    }
    if (productExists){
        throw new Error('Product already exists');
    }
    
    const newSupplier = await Supplier.create({
        name: supplier,
        product: supplierProduct
    });
    return newSupplier;
};

const getSuppliersService = async () => {
    try {
        const suppliers = await Supplier.findAll();
        return suppliers;
    } catch (err) {
        throw new Error('Erro ao buscar suppliers: ', err.message);
    }
};


module.exports = { 
    registerSupplierService, 
    getSuppliersService
};