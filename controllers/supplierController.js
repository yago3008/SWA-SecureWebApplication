const { registerSupplierService, getSuppliersService  } = require("../services/supplierService");

const registerSupplierController = async (req, res) => {
    const { name, product } = req.body
    console.log(name)
    try {
        const newSupplier = await registerSupplierService(name, product);
        res.status(201).json(newSupplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSuppliersController = async (req, res) => {

    try {
        const allSuppliers = await getSuppliersService();
        res.status(200).json(allSuppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    registerSupplierController, getSuppliersController
};