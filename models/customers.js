const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customersSchema = new Schema({
    customers_strName: {
        type: String,
        trim: true
    },
    customers_strLastName: {
        type: String,
        trim: true
    },
    customers_strCompany: {
        type: String,
        trim: true
    },
    customers_email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true
    },
    customers_PhoneNumber: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('tblCustomers', customersSchema);