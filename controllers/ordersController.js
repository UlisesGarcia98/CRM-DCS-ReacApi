const Order = require('../models/orders');


exports.addOrder = async (req, res, next) => {
    const orders = new Order(req.body);
    try {
        const result = await orders.save();
        res.status(201).json({ message: 'Pedido creado correctamente'});
    } catch (error) {
        next(error);
    }
}

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('customer').populate({
            path: 'order.product',
            mode: 'tblProducts'
        });
        res.json({ orders  });
    } catch (error) {
        next(error);
    }
}

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer').populate({
            path: 'order.product',
            model: 'tblProducts'
        });
        if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json({ message: 'Pedido obtenido correctamente', order });
    } catch (error) {
        next(error);
    }
}

exports.updateOrder = async (req, res, next) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customer').populate({
            path: 'order.product',
            model: 'tblProducts'
        });
        if (!updatedOrder) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json({ message: 'Pedido actualizado correctamente', updatedOrder });
    } catch (error) {
        next(error);
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        next(error);
    }
}