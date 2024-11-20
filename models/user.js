const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    user_strEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    user_strFullName: {
        type: String,
        required: true
    },
    user_strPassword: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('tblUsers', userSchema);