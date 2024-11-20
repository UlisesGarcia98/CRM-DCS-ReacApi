const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const productShema = new Schema({
    products_strName: {
        type: String,
        trim: true,
    },
    products_numPrice: {
        type: Number
    },
    products_strImage: {
        type: String
    }
});

module.exports = mongoose.model('tblProducts', productShema);