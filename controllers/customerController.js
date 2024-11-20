const customers = require('../models/customers');

//Agrega un nuevo cliente

exports.newCustomer = async (req, res, next) => {
    const customer = new customers(req.body);

    try {
        //Almacenar el registro
        await customer.save();
        res.json({mensaje : 'Se añadio un nuevo cliente'});
    } catch (error) {
        //Si hay un error console.log y next
        res.send(error);
        next();
    }
}

exports.getAllCustomers = async (req, res, next) => {
    try {
        //Obtener todos los clientes    
        const customer = await customers.find({});
        res.json(customer);
    } catch (error) {
        //Si hay un error console.log y next
        console.log(error);
        next();
    }
}

exports.getCustomerById = async (req, res, next) => {

    
    try {
        //Obtener un cliente por ID
        const customer = await customers.findById(req.params.id);
        res.json(customer);
    } catch (error) {
        //Si hay un error console.log y next
        console.log(error);
        res.send({mensaje: 'Este cliente no existe', error: error})
        next();
    }
}

exports.updateCustomer = async (req, res, next) => {
    try {
        //Actualizar un cliente por ID
        const customer = await customers.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(customer);
    } catch (error) {
        //Si hay un error console.log y next
        console.log(error);
        next();
    }
}

exports.deleteCustomer = async (req, res, next) => {
    try {
        //Borrar un cliente por ID
        const customer = await customers.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Cliente eliminado correctamente'});
    } catch (error) {
        //Si hay un error console.log y next
        console.log(error);
        res.send({mensaje: 'Este cliente no existe', error: error})
        next();
    }
}