const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'tblCustomers'
    },
    order: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'tblProducts'
            },
            quantity: Number
        }
    ],
    totalPrice: Number,
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('tblOrders', orderSchema);