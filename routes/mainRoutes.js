const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customerController');
const productsController = require('../controllers/productsController');
const ordersController = require('../controllers/ordersController');
const usersController = require('../controllers/userController');
//Middleware para proteger rutas
const auth = require('../middleware/auth');

module.exports = function(){

    router.post('/customers', auth, customersController.newCustomer);

    //Obtener todos los cliientes
    router.get('/customers', auth, customersController.getAllCustomers);

    //Obtener un cliente por ID
    router.get('/customers/:id', auth, customersController.getCustomerById);

    //Actualizar un cliente
    router.put('/customers/:id', auth, customersController.updateCustomer);

    //Borrar un cliente
    router.delete('/customers/:id', auth, customersController.deleteCustomer);

    /* Productos */

    router.post('/products' , auth,
        productsController.uploadArchive,
        productsController.addProduct);

    //Obtener todos los productos
    router.get('/products', auth, productsController.getAllProducts);

    //Obtener un producto por ID
    router.get('/products/:id', auth, productsController.getProductById);

    // Obtener un producto por su nombre
    router.post('/products/name/:name', auth, productsController.getProductByName);

    //Actualizar un producto
    router.put('/products/:id', auth, 
        productsController.uploadArchive,
        productsController.updateProduct);

    //Borrar un producto
    router.delete('/products/:id', auth, productsController.deleteProduct);

    /* Pedidos un producto*/
    router.post('/orders/new/:id',
        ordersController.addOrder);

    //Obtener todos los pedidos
    router.get('/orders', auth, ordersController.getAllOrders);

    //Obtener un pedido por ID
    router.get('/orders/:id', auth, ordersController.getOrderById);

    //Actualizar un pedido
    router.put('/orders/:id', auth, ordersController.updateOrder);

    //Borrar un pedido
    router.delete('/orders/:id', auth, ordersController.deleteOrder);

    // Usuarios
    router.post('/createAccount', auth, usersController.registerUser);

    router.post('/login', usersController.loginUser );

    return router;

}